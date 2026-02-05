
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Question } from '@/entities/Question';
import { User } from '@/entities/User';
import { createPageUrl } from '@/utils';

import QuestionHeader from '@/components/questions/QuestionHeader';
import AnswerSection from '@/components/questions/AnswerSection';
import ReplyInput from '@/components/questions/ReplyInput';

// Fallback mock answers for dummy questions
const getMockAnswersForQuestion = (questionId) => {
  return [
    {
      id: `${questionId}_a1`,
      question_id: questionId,
      content: 'This is a comprehensive answer to your question. Islamic scholars have discussed this topic extensively, and there are multiple perspectives to consider based on different schools of thought.',
      author_id: 'mock_maulana',
      author_name: 'Maulana Ahmed',
      author_role: 'maulana',
      author_avatar: 'https://ui-avatars.com/api/?name=Maulana+Ahmed&background=059669&color=fff',
      created_date: new Date(Date.now() - 86400000).toISOString(),
      is_best_answer: true,
      likes: Array.from({ length: 15 }, (_, i) => `u${i + 10}`),
      dislikes: [],
      score: 15,
      comments: [
        {
          id: `${questionId}_c1`,
          answer_id: `${questionId}_a1`,
          content: 'JazakAllah for this detailed explanation.',
          author_id: 'mock_user1',
          author_name: 'User',
          author_role: 'user',
          author_avatar: 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff',
          created_date: new Date(Date.now() - 72000000).toISOString(),
          likes: ['u2', 'u3'],
        }
      ],
    },
    {
      id: `${questionId}_a2`,
      question_id: questionId,
      content: 'I would like to add to the previous answer. From my personal experience and understanding, this topic requires careful consideration of both the spiritual and practical aspects.',
      author_id: 'mock_user2',
      author_name: 'Ali Hassan',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Ali+Hassan&background=8b5cf6&color=fff',
      created_date: new Date(Date.now() - 36000000).toISOString(),
      is_best_answer: false,
      likes: Array.from({ length: 8 }, (_, i) => `u${i + 30}`),
      dislikes: [],
      score: 8,
      comments: [],
    },
  ];
};

export default function QuestionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const questionId = params.get('id');
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (questionId) {
      loadData();
    } else {
      setError("No question ID provided");
      setLoading(false);
    }
  }, [questionId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load current user
      const user = await User.me().catch(() => null);
      setCurrentUser(user);

      // Try to fetch the question from the database
      let fetchedQuestion = null;
      
      try {
        const questions = await Question.filter({ id: questionId });
        if (questions && questions.length > 0) {
          fetchedQuestion = questions[0];
        }
      } catch (dbError) {
        console.log("Question not in database, checking dummy data...");
      }

      // If not found in database, check if it's a dummy question from Questions page
      if (!fetchedQuestion) {
        // Import the dummy questions from Questions page
        const dummyQuestions = await import('./Questions').then(module => {
          // Access the dummy questions if exported, or reconstruct them
          // For now, we'll use a fallback approach
          return null;
        });

        // If still not found, check localStorage or create a basic fallback
        const questionsPageData = sessionStorage.getItem(`question_${questionId}`);
        if (questionsPageData) {
          fetchedQuestion = JSON.parse(questionsPageData);
        }
      }

      if (!fetchedQuestion) {
        // Last resort: create a placeholder based on the ID
        setError("Question not found");
        setLoading(false);
        return;
      }

      setQuestion(fetchedQuestion);

      // For now, use mock answers (in a real app, you'd fetch from Answer entity)
      const mockAnswers = getMockAnswersForQuestion(questionId);
      setAnswers(mockAnswers);

      // Increment view count
      if (fetchedQuestion.id) {
        try {
          await Question.update(fetchedQuestion.id, {
            view_count: (fetchedQuestion.view_count || 0) + 1
          });
        } catch (updateError) {
          console.log("Could not update view count:", updateError);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading question data:", error);
      setError("Failed to load question");
      setLoading(false);
    }
  };

  const handlePostAnswer = async (content) => {
    if (!currentUser) {
      alert("Please log in to post an answer");
      return;
    }

    const newAnswer = {
      id: `a${Date.now()}`,
      question_id: questionId,
      content,
      author_id: currentUser.id,
      author_name: currentUser.full_name || 'User',
      author_role: currentUser.user_type || 'user',
      author_avatar: currentUser.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || 'U')}&background=10b981&color=fff`,
      created_date: new Date().toISOString(),
      likes: [],
      dislikes: [],
      score: 0,
      comments: [],
    };
    
    setAnswers(prev => [newAnswer, ...prev]);

    // Update answer count in the question
    try {
      if (question.id) {
        await Question.update(question.id, {
          answer_count: (question.answer_count || 0) + 1
        });
      }
    } catch (error) {
      console.error("Error updating answer count:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200 shadow-sm">
          <div className="flex items-center p-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-3 hover:bg-emerald-50">
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-emerald-800">Question Details</h1>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Question Not Found</h2>
          <p className="text-gray-600 mb-6 text-center">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => navigate(createPageUrl('Questions'))}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
          >
            Back to Questions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-3 hover:bg-emerald-50">
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-emerald-800">Question Details</h1>
              <p className="text-sm text-emerald-600">Community Discussion</p>
            </div>
          </div>
          
          {/* Ask Question Button */}
          <Button 
            onClick={() => navigate(createPageUrl('Questions'))}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Ask</span>
          </Button>
        </div>
      </header>

      {/* Question Details */}
      <div className="p-4 space-y-6">
        <QuestionHeader question={question} currentUser={currentUser} />
        <AnswerSection answers={answers} currentUser={currentUser} />
      </div>

      {/* Sticky Reply Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-200 shadow-lg p-4">
        <div className="max-w-4xl mx-auto">
          <ReplyInput onSubmit={handlePostAnswer} placeholder="Write your answer..." />
        </div>
      </div>
    </div>
  );
}
