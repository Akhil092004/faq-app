/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from 'mongoose';
import { TranslationServiceClient } from '@google-cloud/translate';
import { parseDocument } from 'htmlparser2';
import { DomUtils } from 'htmlparser2';
import languageAvailable from '@/constants/languages';

// Google Cloud Translate client setup
const translate = new TranslationServiceClient({
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS as string),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

export interface FAQ extends Document {
  question: string;
  answer: string;
  translations: Map<string, { question: string; answer: string }>;
}

const FaqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  translations: {
    type: Map,
    of: {
      question: String,
      answer: String,
    },
    default: () => new Map(),
  },
});

// Translate function using Google Cloud API v3
async function translateText(html: string, targetLang: string): Promise<string | undefined> {
  try {
    const dom = parseDocument(html);
    const textNodes: Text[] = [];

    // Extract text content from HTML
    const extractText = (node: any) => {
      if (node.type === 'text') {
        textNodes.push(node.data);
      } else if (node.children) {
        node.children.forEach(extractText);
      }
    };

    extractText(dom);
    const textContent = textNodes.map(node => node.data);

    // Translate text content using Google Cloud Translate API v3
    const [response] = await translate.translateText({
      parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
      contents: textContent,
      targetLanguageCode: targetLang,
    });

    // Replace original text with translated text
    response.translations?.forEach((translatedText, index) => {
      if (translatedText.translatedText) {
        textNodes[index].data = translatedText.translatedText;
      }
    });

    // Convert back to HTML string
    const translatedHtml = DomUtils.getOuterHTML(dom);
    return translatedHtml;
  } catch (error) {
    console.error('Error translating text:', error);
    return undefined;
  }
}

// Pre-save hook to handle translations
FaqSchema.pre('save', async function (next) {
  console.log('pre-save hook');
  if (this.isModified('question') || this.isModified('answer')) {
    const languages = languageAvailable.map(lang => lang.key);
    const translations = new Map<string, { question: string; answer: string }>();

    for (const lang of languages) {
      try {
        const translatedQuestion = await translateText(this.question, lang);
        const translatedAnswer = await translateText(this.answer, lang);

        if (!translatedQuestion || !translatedAnswer) {
          console.log(`Translation not available for ${lang}`);
          continue;
        }

        translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer,
        });

        // Delay to avoid exceeding API rate limits
        await delay(1000);
      } catch (error) {
        console.error(`Error translating to ${lang}:`, error);
      }
    }

    this.translations = translations;
  }

  next();
});

// Function to introduce delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const FaqModel = (mongoose.models.Faq as mongoose.Model<FAQ>) || mongoose.model<FAQ>('Faq', FaqSchema);

export default FaqModel;
