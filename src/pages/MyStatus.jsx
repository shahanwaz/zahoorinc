import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/entities/User';
import { Status } from '@/entities/Status';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Eye, Play, FileText } from 'lucide-react';
import { createPageUrl } from '@/utils';
import StatusViewer from "@/components/status/StatusViewer";
import { formatDistanceToNow } from 'date-fns';

export default function MyStatus() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [myStatuses, setMyStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingStatus, setViewingStatus] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const user = await User.me();
            setCurrentUser(user);
            if (user) {
                // Get statuses and filter out expired ones (older than 24 hours)
                const statuses = await Status.filter({ user_id: user.id }, '-created_date');
                const now = new Date();
                const validStatuses = statuses.filter(status => {
                    const createdDate = new Date(status.created_date);
                    const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
                    return hoursDiff < 24;
                });
                setMyStatuses(validStatuses);
            }
        } catch (error) {
            console.error("Error loading status data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusDelete = async (statusId) => {
        if (confirm('Are you sure you want to delete this status?')) {
            try {
                await Status.delete(statusId);
                loadData();
            } catch (error) {
                console.error("Error deleting status:", error);
            }
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return '';
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString; // Fallback to raw string on error
        }
    };

    const getBackgroundColor = (bg) => {
        const colorMap = {
            'bg-emerald-500': '#10b981',
            'bg-blue-500': '#3b82f6',
            'bg-purple-500': '#8b5cf6',
            'bg-red-500': '#ef4444',
            'bg-yellow-500': '#eab308',
            'bg-gray-800': '#1f2937',
            'bg-pink-500': '#ec4899',
            'bg-indigo-500': '#6366f1'
        };
        return colorMap[bg] || '#10b981';
    };

    const getGradientStyle = (bg) => {
        const gradientMap = {
            'bg-gradient-to-br from-pink-500 to-yellow-500': 'linear-gradient(to bottom right, #ec4899, #eab308)',
            'bg-gradient-to-br from-blue-500 to-purple-500': 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
            'bg-gradient-to-br from-green-500 to-emerald-500': 'linear-gradient(to bottom right, #22c55e, #10b981)',
            'bg-gradient-to-br from-red-500 to-pink-500': 'linear-gradient(to bottom right, #ef4444, #ec4899)'
        };
        return gradientMap[bg] || null;
    };

    const StatusThumbnail = ({ status }) => {
        if (status.type === 'text') {
            const gradientStyle = getGradientStyle(status.background);
            const backgroundColor = gradientStyle ? null : getBackgroundColor(status.background);
            
            return (
                <div 
                    className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center relative"
                    style={{
                        background: gradientStyle || backgroundColor
                    }}
                >
                    <FileText className="w-6 h-6 text-white opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p 
                            className="text-white text-xs font-bold text-center px-1 leading-tight line-clamp-2"
                            style={{ textAlign: status.text_align || 'center' }}
                        >
                            {status.content.substring(0, 20)}...
                        </p>
                    </div>
                </div>
            );
        }
        
        if (status.type === 'image') {
            return (
                <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                    <img 
                        src={status.content} 
                        alt="Status preview" 
                        className="w-full h-full object-cover"
                    />
                    {status.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                            {status.caption}
                        </div>
                    )}
                </div>
            );
        }
        
        if (status.type === 'video') {
            return (
                <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-gray-900">
                    <video 
                        src={status.content} 
                        className="w-full h-full object-cover"
                        preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                    </div>
                    {status.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                            {status.caption}
                        </div>
                    )}
                </div>
            );
        }
        
        return (
            <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-400" />
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            </div>
        );
    }
    
    const myStatusGroup = currentUser ? [{
        userId: currentUser.id,
        name: currentUser.full_name,
        profileImage: currentUser.profile_image,
        statuses: myStatuses
    }] : [];

    return (
        <div className="p-4 space-y-6 pb-24">
            {/* My Status Header */}
            <div className="flex items-center gap-4 p-2 cursor-pointer" onClick={() => myStatuses.length > 0 && setViewingStatus(true)}>
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-offset-2 ring-offset-emerald-50 ring-emerald-400">
                        <img 
                            src={currentUser?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.full_name || 'U')}&background=random`} 
                            alt="My Profile" 
                            className="w-full h-full rounded-full object-cover" 
                        />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-emerald-800">My Status</h2>
                    <p className="text-sm text-gray-500">
                        {myStatuses.length > 0 ? `${myStatuses.length} updates` : 'Tap to add a status update'}
                    </p>
                </div>
            </div>

            {/* Recent Updates */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 px-2 mb-4">MY UPDATES</h3>
                {myStatuses.length > 0 ? (
                    <div className="space-y-3">
                        {myStatuses.map((status) => (
                            <div key={status.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                                <StatusThumbnail status={status} />
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                Posted {formatTimeAgo(status.created_date)}
                                            </p>
                                            <div className="flex items-center gap-3 text-gray-500 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="text-sm">{status.views?.length || 0} views</span>
                                                </div>
                                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                                    {status.type}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusDelete(status.id);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 bg-white rounded-xl border border-dashed border-emerald-200">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">No status updates yet</p>
                        <p className="text-gray-400 text-xs">Your status updates will appear here and be visible for 24 hours.</p>
                    </div>
                )}
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-24 right-6 flex flex-col gap-3">
                 <Button onClick={() => navigate(createPageUrl('CreateTextStatus'))} className="rounded-full w-14 h-14 primary-btn shadow-lg shadow-emerald-500/30">
                    ✍️
                </Button>
                <Button onClick={() => navigate(createPageUrl('CreateMediaStatus'))} className="rounded-full w-14 h-14 primary-btn shadow-lg shadow-emerald-500/30">
                    <Plus className="w-6 h-6" />
                </Button>
            </div>
            
            {viewingStatus && myStatuses.length > 0 && (
                <StatusViewer
                    allUsers={myStatusGroup}
                    initialUserIndex={0}
                    onClose={() => setViewingStatus(false)}
                />
            )}
        </div>
    );
}