import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const mockMessages = [
  { user: "Ali Raza", text: "SubhanAllah, beautiful recitation.", avatar: "https://ui-avatars.com/api/?name=Ali+Raza" },
  { user: "Fatima K.", text: "Masha'Allah, JazakAllah for this majlis.", avatar: "https://ui-avatars.com/api/?name=Fatima+K" },
  { user: "Hassan Syed", text: "Where is this majlis happening?", avatar: "https://ui-avatars.com/api/?name=Hassan+Syed" },
];

export default function LiveChat() {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { user: "You", text: newMessage, avatar: "https://ui-avatars.com/api/?name=You" }]);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
      <h3 className="font-semibold text-emerald-800 mb-4">Live Chat</h3>
      
      <div className="h-64 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start gap-3">
            <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-semibold text-emerald-700 text-sm">{msg.user}</p>
              <p className="text-gray-700 text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Input 
          placeholder="Say something..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-emerald-50 border-emerald-200"
        />
        <Button type="submit" size="icon" className="bg-emerald-600 hover:bg-emerald-700 flex-shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}