import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';

export default function ReplyInput({ onSubmit, placeholder = "Write a reply..." }) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <div className="flex items-start gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-gray-100 border-gray-200 focus:bg-white min-h-[40px] resize-none"
        rows={1}
      />
      <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-emerald-50">
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button onClick={handleSubmit} size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white">
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}