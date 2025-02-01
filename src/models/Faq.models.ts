/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose,{Schema,Document} from 'mongoose';
import {translate} from '@vitalets/google-translate-api';


export interface FAQ extends Document{
    question:string,
    answer:string,
    tranlations:object
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
        default: () => new Map() // Ensure translations is initialized as a Map
    }
})

FaqSchema.pre('save',async function(next){
    if(this.isModified('question') || this.isModified('answer')){
       const languages = ['en','hi','bn','fr'];
       const translations = new Map<string, { question: string, answer: string }>();

       for(const lang of languages){
            try {
                const translatedQuestion = await translate(this.question,{to:lang});
                const translatedAnswer = await translate(this.answer,{to:lang});

                translations.set(lang, {
                    question: translatedQuestion.text,
                    answer: translatedAnswer.text
                  });
            } catch (error) {
                console.error(`Error translating to ${lang}:`, error);
            }
       }

       this.translations = translations;
    }

    next();
});

export default mongoose.model<FAQ>('FAQ',FaqSchema);