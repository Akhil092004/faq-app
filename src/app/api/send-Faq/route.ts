/* eslint-disable @typescript-eslint/no-unused-vars */
import  faqModel from "@/models/Faq.models";
import mongoose from "mongoose";
import dbConnnect from "@/lib/dbConnect";

export async function POST(request:Request){
    await dbConnnect();
    try {
        const {question,answer} = await request.json();

        const faq = new faqModel({
            question,
            answer
        })

        await faq.save();
        return Response.json(
            {
                success:true,
                message:"FAQ created successfully"
            },
            {
                status:200
            }
        )

    } catch (error) {
        console.error('Error creating FAQ:',error);
        return Response.json(
            {
                success:false,
                message:"Error creating FAQ"
            },
            {
                status:500
            }
        )
    }
}