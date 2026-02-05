import React, { useState, useEffect } from 'react';
import { Status } from '@/entities/Status';
import { User } from '@/entities/User';
import { Plus } from 'lucide-react';
import StatusViewer from './StatusViewer';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function StatusHeader() {
  const [currentUser, setCurrentUser] = useState(null);
  const [myStatuses, setMyStatuses] = useState([]);
  const [otherStatuses, setOtherStatuses] = useState([]);
  const [viewingStatusUserIndex, setViewingStatusUserIndex] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me().catch(() => null);
        setCurrentUser(user);

        const allStatuses = await Status.list('-created_date', 50);
        
        // Filter out expired statuses (older than 24 hours)
        const now = new Date();
        const validStatuses = allStatuses.filter(status => {
          const createdDate = new Date(status.created_date);
          const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
          return hoursDiff < 24;
        });

        const myStatusUpdates = user ? validStatuses.filter(s => s.user_id === user.id) : [];
        const others = user ? validStatuses.filter(s => s.user_id !== user.id) : validStatuses;
        
        setMyStatuses(myStatusUpdates);

        const grouped = others.reduce((acc, status) => {
          if (!status.user_id) return acc;
          if (!acc[status.user_id]) {
            acc[status.user_id] = {
              userId: status.user_id,
              name: status.user_name,
              profileImage: status.user_profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(status.user_name)}&background=934790&color=E8D4B7`,
              statuses: []
            };
          }
          acc[status.user_id].statuses.push(status);
          return acc;
        }, {});

        setOtherStatuses(Object.values(grouped));

      } catch (error) {
        console.error("Error loading statuses:", error);
      }
    };
    loadData();
  }, []);

  const handleViewStatus = (index) => {
    setViewingStatusUserIndex(index);
  };

  const MyStatusIcon = () => {
    const profileImage = currentUser?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.full_name || 'U')}&background=10b981&color=fff`;
    
    if (myStatuses.length > 0 && currentUser) {
      return (
        <div onClick={() => handleViewStatus(0)} className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer w-20">
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-emerald-400 to-emerald-600">
              <div className="bg-white p-0.5 rounded-full w-full h-full">
                <img
                  src={profileImage}
                  alt="Your status"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-emerald-700 font-medium">Your Status</p>
        </div>
      );
    }

    return (
      <Link to={createPageUrl("MyStatus")} className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer w-20">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
            <img 
              src={profileImage}
              alt="Your status" 
              className="w-14 h-14 rounded-full object-cover" 
            />
          </div>
          <div className="bg-emerald-600 p-1 absolute bottom-0 right-0 rounded-full border-2 border-white">
            <Plus size={12} className="text-white" />
          </div>
        </div>
        <p className="text-xs text-center text-emerald-700">Your Status</p>
      </Link>
    );
  };

  const myStatusGroup = currentUser && myStatuses.length > 0 ? {
    userId: currentUser.id,
    name: "My Status",
    profileImage: currentUser.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || 'U')}&background=10b981&color=fff`,
    statuses: myStatuses
  } : null;

  const allUsersForViewer = myStatusGroup ? [myStatusGroup, ...otherStatuses] : otherStatuses;
  const myStatusOffset = myStatusGroup ? 1 : 0;

  return (
    <>
      <div className="pl-4 py-2 bg-white/60 backdrop-blur-sm">
        <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
          <MyStatusIcon />

          {otherStatuses.map((userStatus, index) => (
            <div key={userStatus.userId} onClick={() => handleViewStatus(index + myStatusOffset)} className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer w-20">
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-emerald-400 to-emerald-600">
                  <div className="bg-white p-0.5 rounded-full w-full h-full">
                    <img
                      src={userStatus.profileImage}
                      alt={userStatus.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-emerald-700 truncate w-full font-medium">{userStatus.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {viewingStatusUserIndex !== null && (
        <StatusViewer
          allUsers={allUsersForViewer}
          initialUserIndex={viewingStatusUserIndex}
          onClose={() => setViewingStatusUserIndex(null)}
        />
      )}
    </>
  );
}