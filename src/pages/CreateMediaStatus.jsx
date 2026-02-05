import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Status } from '@/entities/Status';
import { User } from '@/entities/User';
import { UploadFile } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Send, UploadCloud } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function CreateMediaStatus() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handlePost = async () => {
        if (!file) return;
        setIsLoading(true);
        try {
            const user = await User.me();
            const { file_url } = await UploadFile({ file });
            
            const type = file.type.startsWith('video') ? 'video' : 'image';

            await Status.create({
                user_id: user.id,
                user_name: user.full_name,
                user_profile_image: user.profile_image,
                type: type,
                content: file_url,
                caption: caption,
            });
            navigate(createPageUrl('MyStatus'));
        } catch (error) {
            console.error("Error creating status:", error);
            alert("Failed to post status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gray-900 text-white">
            <header className="flex items-center justify-between p-4 bg-black/30">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
                <h1 className="text-lg font-semibold">Add Media Status</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                {preview ? (
                    <div className="w-full max-w-sm aspect-[9/16] rounded-xl overflow-hidden bg-black">
                        {file.type.startsWith('video') ? (
                            <video src={preview} controls className="w-full h-full object-contain" />
                        ) : (
                            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                        )}
                    </div>
                ) : (
                    <div 
                        onClick={() => fileInputRef.current.click()}
                        className="w-full max-w-sm aspect-[9/16] rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800"
                    >
                        <UploadCloud className="w-16 h-16 text-gray-500 mb-4" />
                        <p className="text-gray-400">Tap to upload photo or video</p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </main>

            <footer className="p-4 bg-black/30 flex items-center gap-3">
                <Input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption..."
                    className="flex-1 bg-gray-800 border-gray-700 rounded-full text-white placeholder-gray-400"
                />
                <Button onClick={handlePost} size="lg" className="rounded-full primary-btn" disabled={isLoading || !file}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
            </footer>
        </div>
    );
}