import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import EjaraPostCard from '@/components/ejara/EjaraPostCard';
import PostEjaraModal from '@/components/ejara/PostEjaraModal';
import AvailServiceModal from '@/components/ejara/AvailServiceModal';

// Mock Data
const mockCurrentUser = { id: 'user_me', name: 'Ali Hassan', profileImage: 'https://ui-avatars.com/api/?name=Ali+Hassan&background=random' };

const initialPosts = [
  { id: 1, serviceType: 'roza', forWhom: 'Late Fatima Begum', quantity: 10, rate: 500, total: 5000, requester: { name: 'Syed Raza', profileImage: 'https://ui-avatars.com/api/?name=Syed+Raza' }, status: 'available' },
  { id: 2, serviceType: 'quran', forWhom: 'Late Ahmed Ali Khan', quantity: 2, rate: 2000, total: 4000, requester: { name: 'Zainab Jaffri', profileImage: 'https://ui-avatars.com/api/?name=Zainab+Jaffri' }, status: 'available' },
  { id: 3, serviceType: 'namaz', forWhom: 'Late Hassan Abbas', quantity: 30, rate: 30, total: 900, requester: { name: 'Fatima Rizvi', profileImage: 'https://ui-avatars.com/api/?name=Fatima+Rizvi' }, status: 'availed', availedBy: 'Maulana Abidi' },
  { id: 4, serviceType: 'roza', forWhom: 'My Beloved Mother', quantity: 5, rate: 500, total: 2500, requester: { name: mockCurrentUser.name, profileImage: mockCurrentUser.profileImage }, status: 'available' },
];

export default function EjaraServices() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAvailModal, setShowAvailModal] = useState(false);

  const handlePostService = (newPostData) => {
    const newPost = {
      id: posts.length + 1,
      ...newPostData,
      requester: { name: mockCurrentUser.name, profileImage: mockCurrentUser.profileImage },
      status: 'available'
    };
    setPosts([newPost, ...posts]);
  };

  const handleAvailClick = (post) => {
    setSelectedPost(post);
    setShowAvailModal(true);
  };
  
  const handleConfirmAvail = (postId) => {
    setPosts(posts.map(p => p.id === postId ? {...p, status: 'availed', availedBy: mockCurrentUser.name } : p));
  };

  const tabs = [
    { id: 'all', label: 'All Services' },
    { id: 'my_posts', label: 'My Posts' },
    { id: 'my_avails', label: 'My Avails' },
  ];

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'my_posts':
        return posts.filter(p => p.requester.name === mockCurrentUser.name);
      case 'my_avails':
        return posts.filter(p => p.availedBy === mockCurrentUser.name);
      case 'all':
      default:
        return posts.filter(p => p.status === 'available');
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cream-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200/50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-3 hover:bg-emerald-50">
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-emerald-800">Ejara Services</h1>
              <p className="text-sm text-emerald-600">A Community Marketplace for Spiritual Services</p>
            </div>
          </div>
          <Button onClick={() => setShowPostModal(true)} className="primary-btn shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> Post Ejara Service
          </Button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex space-x-2 bg-emerald-50 p-1 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-700 shadow'
                    : 'text-emerald-600 hover:bg-emerald-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4">
        <AnimatePresence>
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredPosts.map((post) => (
              <EjaraPostCard
                key={post.id}
                post={post}
                onAvail={() => handleAvailClick(post)}
                currentUser={mockCurrentUser}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🕊️</span>
            </div>
            <h3 className="text-xl font-semibold text-emerald-800">No Services Here</h3>
            <p className="text-emerald-600 max-w-sm mx-auto mt-2">
              {activeTab === 'all' ? 'No available services right now. You can be the first to post one!' : 'You have no services in this category yet.'}
            </p>
          </div>
        )}
      </main>

      <PostEjaraModal
        open={showPostModal}
        onOpenChange={setShowPostModal}
        onPostCreated={handlePostService}
      />
      <AvailServiceModal
        open={showAvailModal}
        onOpenChange={setShowAvailModal}
        post={selectedPost}
        onConfirmAvail={handleConfirmAvail}
      />
    </div>
  );
}