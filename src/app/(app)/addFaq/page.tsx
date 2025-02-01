'use client';

import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from "next/navigation";

const QuestionAnswerPage: React.FC = () => {
  // State for question and answer
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');

  const router = useRouter();

  // Handle question input change
  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  // Handle answer change (from the TinyMCE Editor)
  const handleAnswerChange = (newAnswer: string) => {
    setAnswer(newAnswer);
  };

  // Handle form submission
  const handleSubmit = async () => {

    console.log('Question:', question);
    console.log('Answer:', answer);

    //make the API call here to send-Faq
    const res = await fetch('/api/send-Faq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer }),
    });

    if (!res.ok) {
      console.error('Failed to submit FAQ');
      return;
    }

    router.push('/dashboard');

    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="w-full p-4">
      {/* Question Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Question</label>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Type your question here..."
        />
      </div>

      {/* TinyMCE Editor for Answer */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Answer</label>
        <Editor
          value={answer}
          apiKey="99f3but3w71fxoy1m8b7orodbmbv218nt9mi8f2mgec2tr74"
          init={{
            height: 400,
            menubar: true,
            plugins: [
              'image', 'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime',
              'media', 'table', 'code', 'help', 'wordcount', 'anchor',
            ],
            toolbar: "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onEditorChange={handleAnswerChange} 
        />
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionAnswerPage;
