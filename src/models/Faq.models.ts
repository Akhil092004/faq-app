
import mongoose,{Schema,Document} from 'mongoose';
import {translate} from '@vitalets/google-translate-api';

import languageAvailable  from '@/constants/languages'



export interface FAQ extends Document{
    question:string,
    answer:string,
    translations:Map<string,{question:string,answer:string}>
}

const FaqSchema = new Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    translations: {
        type: Map,
        of: {
          question: String,
          answer: String
        },
        default: () => new Map() 
    }
})

FaqSchema.pre('save',async function(next){
    console.log('pre save hook');
    if(this.isModified('question') || this.isModified('answer')){
       const languages = languageAvailable.map(lang => lang.key);
       const translations = new Map<string, { question: string, answer: string }>();

       for(const lang of languages){
            try {
                const translatedQuestion = await translate(this.question,{to:lang});
                const translatedAnswer = await translate(this.answer,{to:lang});

                translations.set(lang, {
                    question: translatedQuestion.text,
                    answer: translatedAnswer.text
                  });
                await delay(1000) 
            } catch (error) {
                console.error(`Error translating to ${lang}:`, error);
            }
       }

       this.translations = translations;
    }

    next();
});


const FaqModel = (mongoose.models.Faq as mongoose.Model<FAQ>) || mongoose.model<FAQ>('Faq',FaqSchema);

export default FaqModel;

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
