import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { User, Clock, Check, Send, Download, Share2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const StatusBadge = ({ status, scholarName }) => {
  const styles = {
    pending: 'bg-green-100 text-green-800 border-green-200',
    taken: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    responded: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  const text = {
    pending: '🟢 Pending',
    taken: `🟡 Taken by ${scholarName}`,
    responded: '🔵 Responded',
    completed: '⚪ Completed'
  };
  return <Badge className={styles[status]}>{text[status]}</Badge>;
};

const ScholarBadge = ({ role }) => {
  const text = {
    maulana: '🎓 Maulana',
    zakir: '🎤 Zakir',
    zakera: '👩‍🦱 Zakera',
  };
  return <Badge variant="outline" className="text-xs">{text[role] || 'Scholar'}</Badge>;
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export default function IstikharaRequestCard({ request, response, currentUser, onTake, onRespond, isPast }) {
  const [responseText, setResponseText] = useState('');
  const isMyRequest = request.user_id === currentUser.id;
  const isMyTakenRequest = request.scholar_id === currentUser.id;
  const canTake = ['maulana', 'zakir', 'zakera'].includes(currentUser.user_type) && request.status === 'pending' && !isMyRequest;

  const handleRespond = () => {
    if (!responseText.trim()) {
      alert('Please provide a response.');
      return;
    }
    onRespond(request.id, responseText);
    setResponseText('');
  };

  const handleDownloadPDF = () => {
    toast.success('PDF download feature coming soon!');
  };

  const handleDownloadImage = () => {
    toast.success('Image download feature coming soon!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Istikhara Request',
        text: `Istikhara Request: ${request.query}`,
      }).catch(() => {
        toast.info('Sharing cancelled');
      });
    } else {
      toast.info('Share feature not supported on this device');
    }
  };

  return (
    <Card className="shadow-lg border-emerald-200/50 bg-white hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <CardTitle className="text-lg text-emerald-800">Request #{request.id?.slice(0, 8) || 'N/A'}</CardTitle>
            <StatusBadge status={isPast ? 'completed' : request.status} scholarName={request.scholar_name} />
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <Clock className="w-4 h-4" />
            <span>{formatTimeAgo(request.created_date)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold text-emerald-700 mb-2">Concern:</p>
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-lg border-l-4 border-emerald-500">
            <p className="text-emerald-900 leading-relaxed">"{request.query}"</p>
          </div>
        </div>
        
        {request.notes && (
          <div>
            <p className="font-semibold text-emerald-700 mb-2">Additional Notes:</p>
            <p className="text-emerald-800/90 text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">"{request.notes}"</p>
          </div>
        )}

        {/* Payment Badge */}
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 border-green-200">Payment: ₹{request.amount} Paid ✅</Badge>
        </div>

        {/* Scholar's Response Display (for user who made the request) */}
        {isMyRequest && (request.status === 'responded' || isPast) && response && (
          <div className="mt-6 border-t border-emerald-200 pt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {request.scholar_name?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="font-bold text-emerald-800">{request.scholar_name}</p>
                <ScholarBadge role={request.scholar_role} />
              </div>
            </div>
            <p className="font-semibold text-emerald-700 mb-2">Scholar's Response:</p>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900 leading-relaxed">"{response.response_text}"</p>
            </div>
            
            {/* Action Buttons for Response */}
            <div className="flex gap-2 mt-4">
              <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
              <Button onClick={handleDownloadImage} variant="outline" size="sm" className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <ImageIcon className="w-4 h-4 mr-2" /> Save as Image
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm" className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        )}

        {/* Scholar's Response Input (for scholar who took the request) */}
        {isMyTakenRequest && request.status === 'taken' && (
          <div className="mt-6 border-t border-emerald-200 pt-4">
            <p className="font-semibold text-emerald-700 mb-3">Provide Your Response:</p>
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Share the Istikhara result and your spiritual guidance here..."
              className="h-32 dialog-input"
            />
            <Button onClick={handleRespond} className="mt-3 w-full primary-btn text-lg font-semibold py-6">
              <Send className="w-5 h-5 mr-2" /> Send Response to User
            </Button>
          </div>
        )}
      </CardContent>
      
      {!isMyRequest && !isPast && (
        <CardFooter className="flex justify-between items-center bg-gray-50/50 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 text-sm text-emerald-700">
            <User className="w-4 h-4" />
            <span>Requested by: {request.user_name}</span>
          </div>
          {canTake && (
            <Button onClick={() => onTake(request.id)} size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-md">
              <Check className="w-4 h-4 mr-2" /> Take This Request
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}