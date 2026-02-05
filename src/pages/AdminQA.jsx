import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Question } from '@/entities/Question';
import { Answer } from '@/entities/Answer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, ThumbsUp, MessageCircle, Star, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminQA() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await Question.list('-created_date', 500);
      setQuestions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const loadAnswers = async (questionId) => {
    try {
      const data = await Answer.filter({ question_id: questionId }, '-created_date');
      setAnswers(data);
    } catch (error) {
      console.error('Error loading answers:', error);
    }
  };

  const handleViewQuestion = async (question) => {
    setSelectedQuestion(question);
    await loadAnswers(question.id);
    setShowDetailModal(true);
  };

  const handleFeatureQuestion = async (questionId, isFeatured) => {
    try {
      await Question.update(questionId, { is_featured: !isFeatured });
      alert(isFeatured ? 'Question unfeatured' : 'Question featured successfully');
      loadQuestions();
    } catch (error) {
      console.error('Error featuring question:', error);
      alert('Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        await Question.delete(questionId);
        alert('Question deleted successfully');
        loadQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Question',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{row.content}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      )
    },
    {
      key: 'author_name',
      label: 'Author',
    },
    {
      key: 'answer_count',
      label: 'Answers',
      render: (value) => (
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4 text-gray-400" />
          {value || 0}
        </div>
      )
    },
    {
      key: 'is_featured',
      label: 'Status',
      render: (value) => (
        value ? (
          <Badge className="bg-amber-100 text-amber-700">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        ) : null
      )
    },
    {
      key: 'created_date',
      label: 'Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewQuestion(row);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleFeatureQuestion(row.id, row.is_featured);
            }}
          >
            <Star className={`w-4 h-4 ${row.is_featured ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteQuestion(row.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout currentPage="qa">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Q&A</h1>
          <p className="text-gray-600">Moderate questions and answers from the community</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={questions}
            onRowClick={handleViewQuestion}
            searchable
            exportable
            onExport={() => alert('Export functionality coming soon')}
          />
        )}
      </div>

      {/* Question Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-6">
              {/* Question */}
              <div className="border-b pb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{selectedQuestion.title}</h3>
                  <Badge className="capitalize">{selectedQuestion.category}</Badge>
                </div>
                <p className="text-gray-700 mb-4">{selectedQuestion.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {selectedQuestion.author_name}</span>
                  <span>•</span>
                  <span>{format(new Date(selectedQuestion.created_date), 'MMM dd, yyyy HH:mm')}</span>
                  <span>•</span>
                  <span>{selectedQuestion.view_count || 0} views</span>
                </div>
              </div>

              {/* Answers */}
              <div>
                <h4 className="font-semibold mb-4">{answers.length} Answers</h4>
                <div className="space-y-4">
                  {answers.map((answer) => (
                    <div key={answer.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{answer.author_name}</span>
                          <Badge variant="outline" className="capitalize text-xs">
                            {answer.author_role}
                          </Badge>
                          {answer.is_best_answer && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Best Answer
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(answer.created_date), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{answer.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {answer.likes?.length || 0}
                        </span>
                        <span>{answer.comment_count || 0} comments</span>
                      </div>
                    </div>
                  ))}
                  {answers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No answers yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}