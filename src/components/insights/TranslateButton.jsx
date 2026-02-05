import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Languages, Loader2 } from 'lucide-react';
import { InvokeLLM } from '@/integrations/Core';

export default function TranslateButton({ content, language = 'en', targetLanguage = 'en' }) {
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');

  const handleTranslate = async () => {
    if (translated || language === targetLanguage) return;
    
    setTranslating(true);
    try {
      const response = await InvokeLLM({
        prompt: `Translate the following text to English while preserving its meaning and context. If it's already in English, just return "Already in English". Text: "${content}"`,
        response_json_schema: {
          type: "object",
          properties: {
            translated_text: { type: "string" },
            original_language: { type: "string" },
            is_already_english: { type: "boolean" }
          }
        }
      });
      
      if (response.is_already_english) {
        setTranslated(true);
        setTranslatedContent('Already in English');
      } else {
        setTranslated(true);
        setTranslatedContent(response.translated_text);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  };

  if (language === 'en') return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleTranslate}
      disabled={translating || translated}
      className="text-emerald-400 hover:bg-emerald-800/30 text-xs"
    >
      {translating ? (
        <Loader2 className="w-3 h-3 animate-spin mr-1" />
      ) : (
        <Languages className="w-3 h-3 mr-1" />
      )}
      {translated ? 'Translated' : 'Translate'}
    </Button>
  );
}