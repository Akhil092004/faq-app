
import FaqModel from "@/models/Faq.models";
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextApiRequest,res:NextApiResponse){
    await dbConnect();

    try {


        if (!req.url) {
            return res.status(400).json({ error: "Request URL is required" });
        }
        const { searchParams } = new URL(req.url);
        const lang = searchParams.get('lang');

        //find all the FAQ
        if (!lang || typeof lang !== "string") {
            return res.status(400).json({ error: "Language parameter is required" });
        }

        // Fetch all FAQs from MongoDB
        const faqs = await FaqModel.find({}, { translations: 1 }).lean();

        console.log('faqs:',faqs);
        const filteredFaqs = faqs
        .map(faq => faq.translations?.[lang]) // Extract the translation for the specified language
        .filter(Boolean); // Remove undefined/null values

        console.log('filteredFaqs:',filteredFaqs);
        return Response.json(
            { faqs: filteredFaqs },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error('Error getting FAQ:',error);
        return Response.json(
            {
                success:false,
                message:"Error getting FAQ"
            },
            {
                status:500
            }
        )
    }
}