'use client';

import { useState, useRef, useEffect } from 'react';
import { toggleLike, toggleSavePost } from './actions';
import { useRouter } from 'next/navigation';

export default function PostActions({ 
  postId, 
  initialLikes, 
  initialIsLiked,
  initialIsSaved,
  title,
  user
}: { 
  postId: string; 
  initialLikes: number; 
  initialIsLiked: boolean;
  initialIsSaved: boolean;
  title: string;
  user: any;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const router = useRouter();
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareMenuRef]);

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like this post.");
      router.push('/auth');
      return;
    }
    if (loading) return;

    setLikes((prev) => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
    setLoading(true);

    try {
      await toggleLike(postId);
    } catch (err) {
      setLikes((prev) => isLiked ? prev + 1 : prev - 1);
      setIsLiked(isLiked);
      alert("Failed to update like status.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please log in to save posts.");
      router.push('/auth');
      return;
    }
    if (saveLoading) return;

    setIsSaved(!isSaved);
    setSaveLoading(true);

    try {
      await toggleSavePost(postId);
    } catch (err) {
      setIsSaved(isSaved);
      alert("Failed to save post.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(`Check out this post: ${title}`);
    const encodedUrl = encodeURIComponent(url);

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${text}&body=${encodedUrl}`;
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
    setShowShareMenu(false);
  };

  const formatLikes = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="flex items-center space-x-6 text-sm font-medium text-slate-500 relative">
      <button 
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-slate-900'}`}
      >
        <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        <span>{formatLikes(likes)}</span>
      </button>
      
      <div className="relative" ref={shareMenuRef}>
        <button 
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center space-x-2 hover:text-slate-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          <span>Share</span>
        </button>

        {showShareMenu && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white border border-slate-200 shadow-lg rounded-lg py-2 z-10 flex flex-col items-start">
            <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">WhatsApp</button>
            <button onClick={() => handleShare('twitter')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">Twitter / X</button>
            <button onClick={() => handleShare('email')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">Email</button>
            <button onClick={() => handleShare('copy')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">Copy Link</button>
          </div>
        )}
      </div>

      <button 
        onClick={handleSave}
        disabled={saveLoading}
        className={`flex items-center space-x-2 transition-colors ${isSaved ? 'text-blue-700' : 'hover:text-slate-900'}`}
      >
        <svg className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      </button>
    </div>
  );
}
