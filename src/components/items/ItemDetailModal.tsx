import React, { useState } from 'react';
import { X, ShoppingBag, ExternalLink, Circle, ThumbsUp, ThumbsDown, MessageCircle, Send, ZoomIn } from 'lucide-react';
import type { Item } from '@/types';
import { useTheme } from "@/hooks/useTheme";

interface ItemDetailModalProps {
  item: Item;
  onClose: () => void;
}

interface Review {
  text: string;
  username: string;
  date: string;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const { theme } = useTheme();

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [username, setUsername] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [imageFullscreen, setImageFullscreen] = useState(false);
  
  // Initial reviews plus user-added reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      text: "Really loved the quality! Totally worth it.",
      username: "Jane Doe",
      date: "May 15, 2025"
    },
    {
      text: "The delivery was quick and the item matched the description.",
      username: "John Smith",
      date: "May 10, 2025"
    }
  ]);

  const handleAddComment = () => {
    if (commentText.trim() === '') return;
    
    // Create new review from comment
    const newReview: Review = {
      text: commentText,
      username: username.trim() !== '' ? username : 'Anonymous User',
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
    
    // Add the new review to the existing reviews
    setReviews([newReview, ...reviews]);
    
    // Reset form
    setCommentText('');
    setCommentOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative flex flex-col md:flex-row h-full">
          <button 
            onClick={onClose}
            className={`absolute right-3 top-3 p-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-700/80 hover:bg-gray-700' 
                : 'bg-white/80 hover:bg-white'
            } shadow-md z-10 transition-all duration-200`}
            aria-label="Close"
          >
            <X size={18} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
          </button>

          {/* Left side - Image */}
          <div className="md:w-1/2 relative h-[250px] md:h-auto flex-shrink-0">
            <img 
              src={item.image_src} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setImageFullscreen(true);
              }}
            />
            <div className="absolute top-3 left-3">
              <button 
                className={`p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700/80 hover:bg-gray-700' 
                    : 'bg-white/80 hover:bg-white'
                } shadow-md transition-all duration-200`}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageFullscreen(true);
                }}
              >
                <ZoomIn size={18} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
              </button>
            </div>
            <div className="absolute bottom-4 right-4">
              <span className={`px-4 py-2 rounded-lg text-white text-base font-medium ${
                theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-600'
              }`}>
                ₹{item.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="md:w-1/2 h-[calc(90vh-250px)] md:h-[90vh] flex flex-col overflow-hidden">
            <div className="overflow-y-auto p-6 flex-grow">
              {/* Icons */}
              <div className="flex items-center sm:mt-0 gap-4 mb-4">
                <button
                  className={`p-2 rounded-full transition-all duration-200 ${liked ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-indigo-500'}`}
                  onClick={() => {
                    setLiked(!liked);
                    if (disliked) setDisliked(false);
                  }}
                >
                  <ThumbsUp size={20} />
                  <p className='text-sm'>{liked ? 'Liked' : 'Like'}</p>
                </button>
                <button
                  className={`p-2 rounded-full transition-all duration-200 ${disliked ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-pink-500'}`}
                  onClick={() => {
                    setDisliked(!disliked);
                    if (liked) setLiked(false);
                  }}
                >
                  <ThumbsDown size={20} />
                  <p className='text-sm'>{disliked ? 'Disliked' : 'Dislike'}</p>
                </button>
                <button
                  className="p-2 rounded-full text-gray-500 hover:text-blue-500 transition-colors"
                  onClick={() => setCommentOpen(true)}
                >
                  <MessageCircle size={20} />
                  <p className='text-sm'>Comment</p>
                </button>
              </div>

              {/* Title */}
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
              } mb-4`}>{item.title}</h2>

              {/* Available on */}
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } mb-2`}>Available on:</h3>
                <div className="flex flex-wrap gap-2">
                  {item.services.map(service => (
                    <a
                      key={service.name}
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 hover:from-indigo-900/70 hover:to-purple-900/70 text-gray-200 border-indigo-700'
                          : 'bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-gray-800 border-indigo-100'
                      } rounded-lg border transition-all duration-200 shadow-sm`}
                    >
                      <ShoppingBag size={14} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} />
                      <span className="font-medium">{service.name}</span>
                      <ExternalLink size={12} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <h3 className="text-lg font-medium mb-4">Product Details</h3>
                <ul className="space-y-3">
                  {item.description.split('\n').map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-500">
                        <Circle size={8} fill="currentColor" />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Reviews Section with User Comments */}
                <div className="mt-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                      User Reviews ({reviews.length})
                    </h4>
                    <button
                      onClick={() => setCommentOpen(true)}
                      className={`text-xs px-3 py-1 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-indigo-500 hover:bg-indigo-600'
                      } text-white transition-colors`}
                    >
                      Add Review
                    </button>
                  </div>
                  <div className="space-y-2">
                    {reviews.map((review, index) => (
                      <div 
                        key={index} 
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-700 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        } p-3 rounded-lg ${index === 0 && 'border-l-4 border-indigo-500'}`}
                      >
                        <p className="text-sm">{`"${review.text}"`}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">- {review.username}</span>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    ))}
                    
                    {reviews.length === 0 && (
                      <div className={`p-4 text-center rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                      }`}>
                        <p className="text-sm text-gray-500">No reviews yet. Be the first to leave a review!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {commentOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]" onClick={() => setCommentOpen(false)}>
          <div 
            className={`rounded-xl p-6 w-full max-w-md ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
            
            {/* Username field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your Name (optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 rounded-lg border focus:outline-none transition-colors duration-200 
                  text-sm shadow-sm bg-transparent border-gray-300 focus:ring-2 focus:ring-indigo-400
                  dark:border-gray-700 dark:focus:ring-indigo-600"
              />
            </div>
            
            {/* Comment field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your Review</label>
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                placeholder="Share your thoughts about this product..."
                className="w-full p-3 rounded-lg border focus:outline-none resize-none transition-colors duration-200 
                  text-sm shadow-sm bg-transparent border-gray-300 focus:ring-2 focus:ring-indigo-400
                  dark:border-gray-700 dark:focus:ring-indigo-600"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                className="text-sm px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                onClick={() => setCommentOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="text-sm px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddComment}
                disabled={commentText.trim() === ''}
              >
                <Send size={16} /> Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {imageFullscreen && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60] backdrop-blur-sm"
          onClick={() => setImageFullscreen(false)}
        >
          <button 
            onClick={() => setImageFullscreen(false)}
            className="absolute right-6 top-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
            aria-label="Close"
          >
            <X size={24} className="text-white" />
          </button>
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={item.image_src} 
              alt={item.title} 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailModal;