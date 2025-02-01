'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller, Control } from 'react-hook-form';

// Define the form data type
interface PostFormData {
  title: string;
  slug: string;
  content: string;
  status: 'active' | 'inactive'; // Adjust as per your needs
}

interface RTEProps {
  name?: keyof PostFormData;
  control: Control<PostFormData>; // Use the PostFormData type for control
  label?: string;
  defaultValue?: string;
}

const RTE: React.FC<RTEProps> = ({ name = "content", control, label, defaultValue = "" }) => {
  return (
    <div className='w-full'>
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            initialValue={defaultValue}
            apiKey="99f3but3w71fxoy1m8b7orodbmbv218nt9mi8f2mgec2tr74"
            init={{
              initialValue: defaultValue,
              height: 500,
              menubar: true,
              plugins: [
                "image", "advlist", "autolink", "lists", "link", "charmap", "preview",
                "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime",
                "media", "table", "code", "help", "wordcount", "anchor",
              ],
              toolbar: "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
};

export default RTE;
