"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";  // Import useRouter hook
import languages from '@/constants/languages';
import axios from "axios";


export default function FaqComponent() {
    console.log("renderd");
    const [selectedLang, setSelectedLang] = useState("en");
    const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
    const router = useRouter(); // Initialize useRouter hook

    useEffect(() => {
        console.log("triggered");
    
        const fetchFAQs = async () => {
            try {
                const res = await axios.get(`/api/get-Faq?lang=${selectedLang}`);
                console.log("FAQs:", res.data.faqs);
                setFaqs(res.data.faqs);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
                setFaqs([]);
            }
        };
    
        fetchFAQs();
    }, [selectedLang]);
    
    const handleAddFaqRedirect = () => {
        router.push('/addFaq'); // Redirect to the add-faq page
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Language Dropdown */}
            <Select onValueChange={(value) => {
                console.log("Selected language:", value); // Debugging
                setSelectedLang(value);
            }} value={selectedLang}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map(lang => (
                        <SelectItem key={lang.key} value={lang.key}>
                            {lang.value}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Add FAQ Button */}
            <div className="mt-4">
                <button
                    onClick={handleAddFaqRedirect}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
                >
                    Add FAQ
                </button>
            </div>

            {/* FAQ Cards */}
            <div className="mt-6 space-y-4">
                {faqs.length > 0 ? (
                    faqs.map((faq, index) => (
                        <Card key={index} className="shadow-lg">
                            <CardHeader>
                                <CardTitle>{faq.question}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{faq.answer}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No FAQs available for this language.</p>
                )}
            </div>
        </div>
    );
}
