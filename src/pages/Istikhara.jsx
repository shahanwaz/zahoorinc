import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { User } from '@/entities/User';
import { Istikhara as IstikharaEntity } from '@/entities/Istikhara';
import { IstikharaResponse as IstikharaResponseEntity } from '@/entities/IstikharaResponse';
import { WalletTransaction } from '@/entities/WalletTransaction';
import RequestIstikharaModal from '@/components/istikhara/RequestIstikharaModal';
import IstikharaRequestCard from '@/components/istikhara/IstikharaRequestCard';

export default function Istikhara() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('my_requests');
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const allRequests = await IstikharaEntity.list('-created_date');
      setRequests(allRequests);
      
      const allResponses = await IstikharaResponseEntity.list('-created_date');
      setResponses(allResponses);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleCreateRequest = async (requestData) => {
    try {
      const newRequest = await IstikharaEntity.create({
        ...requestData,
        user_id: currentUser.id,
        user_name: currentUser.full_name,
        user_avatar: currentUser.profile_image,
        status: 'pending',
        payment_status: 'escrow',
        amount: 50
      });

      await WalletTransaction.create({
        user_id: currentUser.id,
        transaction_type: 'istikhara_request',
        amount: -50,
        status: 'completed',
        reference_id: newRequest.id,
        reference_type: 'istikhara',
        description: 'Istikhara request posted',
        balance_after: (currentUser.wallet_balance || 0) - 50
      });

      await loadData();
      alert('Istikhara request submitted successfully!');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  const handleTakeRequest = async (requestId) => {
    try {
      await IstikharaEntity.update(requestId, {
        status: 'taken',
        scholar_id: currentUser.id,
        scholar_name: currentUser.full_name,
        scholar_role: currentUser.user_type
      });
      
      await loadData();
      alert('Request taken successfully!');
    } catch (error) {
      console.error('Error taking request:', error);
      alert('Failed to take request. Please try again.');
    }
  };

  const handleSendResponse = async (requestId, responseText) => {
    try {
      const request = requests.find(r => r.id === requestId);
      
      await IstikharaResponseEntity.create({
        request_id: requestId,
        scholar_id: currentUser.id,
        scholar_name: currentUser.full_name,
        scholar_role: currentUser.user_type,
        response_text: responseText,
        requester_id: request.user_id,
        visibility: 'private'
      });

      await IstikharaEntity.update(requestId, {
        status: 'responded',
        payment_status: 'released',
        responded_date: new Date().toISOString()
      });

      await WalletTransaction.create({
        user_id: currentUser.id,
        transaction_type: 'istikhara_earning',
        amount: request.amount,
        status: 'completed',
        reference_id: requestId,
        reference_type: 'istikhara',
        description: `Earned from Istikhara response`,
        balance_after: (currentUser.wallet_balance || 0) + request.amount
      });

      await User.updateMyUserData({
        wallet_balance: (currentUser.wallet_balance || 0) + request.amount,
        total_earned: (currentUser.total_earned || 0) + request.amount
      });

      await loadData();
      alert(`Response sent successfully! ₹${request.amount} has been transferred to your wallet.`);
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response. Please try again.');
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading Istikhara Service...</p>
        </div>
      </div>
    );
  }

  const isScholar = ['maulana', 'zakir', 'zakera'].includes(currentUser.user_type);

  const userTabs = [
    { id: 'my_requests', label: 'My Requests' }
  ];
  
  const scholarTabs = [
    { id: 'my_requests', label: 'My Requests' },
    { id: 'all_requests', label: 'All Open Requests' }
  ];
  
  const tabs = isScholar ? scholarTabs : userTabs;

  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'my_requests':
        return requests.filter(r => r.user_id === currentUser.id && r.status !== 'completed');
      case 'all_requests':
        return requests.filter(r => r.status === 'pending' && r.user_id !== currentUser.id);
      default:
        return [];
    }
  };

  const getPastRequests = () => {
    return requests.filter(r => r.user_id === currentUser.id && r.status === 'completed');
  };

  const getResponseForRequest = (requestId) => {
    return responses.find(r => r.request_id === requestId);
  };

  const filteredRequests = getFilteredRequests();
  const pastRequests = getPastRequests();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200/50 shadow-sm">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-3 hover:bg-emerald-50">
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-emerald-800">Istikhara Service 🔮</h1>
            <p className="text-sm text-emerald-600">Seek spiritual guidance for your decisions</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="p-6 bg-gradient-to-r from-emerald-100 to-emerald-50 border-b border-emerald-200">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">🔮</span>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-3">Request Istikhara for Guidance</h2>
          <p className="text-emerald-700 leading-relaxed mb-6 max-w-2xl mx-auto">
            Submit your concern, and a qualified scholar will perform Istikhara on your behalf and provide private spiritual guidance. This is a trusted paid service to help you make important life decisions.
          </p>
          <Button 
            onClick={() => setShowRequestModal(true)} 
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-6 text-lg font-bold shadow-xl rounded-2xl"
          >
            <Plus className="w-6 h-6 mr-2" /> Request Istikhara
          </Button>
          <p className="text-sm text-emerald-600 mt-3">Fixed Rate: ₹50 per Istikhara</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-4 pt-6 pb-3 bg-white/80">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 bg-emerald-50 p-1 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'text-emerald-600 hover:bg-emerald-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Active Requests */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map(request => (
              <IstikharaRequestCard
                key={request.id}
                request={request}
                response={getResponseForRequest(request.id)}
                currentUser={currentUser}
                onTake={handleTakeRequest}
                onRespond={handleSendResponse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">🕊️</span>
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              {activeTab === 'all_requests' ? 'No Open Requests' : 'No Requests Yet'}
            </h3>
            <p className="text-emerald-600 max-w-md mx-auto">
              {activeTab === 'all_requests' 
                ? 'There are no open Istikhara requests at the moment. Check back soon.' 
                : 'You haven\'t requested any Istikhara yet. Click the button above to get started.'}
            </p>
          </div>
        )}

        {/* Past Requests Section */}
        {activeTab === 'my_requests' && pastRequests.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
              📋 Past Istikhara Requests
            </h3>
            <div className="space-y-4">
              {pastRequests.map(request => (
                <IstikharaRequestCard
                  key={request.id}
                  request={request}
                  response={getResponseForRequest(request.id)}
                  currentUser={currentUser}
                  onTake={handleTakeRequest}
                  onRespond={handleSendResponse}
                  isPast={true}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <RequestIstikharaModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        onSubmit={handleCreateRequest}
      />
    </div>
  );
}