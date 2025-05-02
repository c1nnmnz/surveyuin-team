import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ThumbsUp, 
  Reply, 
  Share, 
  Flag, 
  MoreHorizontal, 
  Clock, 
  Star, 
  Send, 
  AlertTriangle, 
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import useTestimonialStore from '@/store/testimonialStore';
import { useUserStore } from '@/store/userStore';
import { getRelativeTime } from '@/lib/utils';

// Helper function to get avatar fallback based on name
const getAvatarFallback = (name) => {
  if (!name || name.toLowerCase() === 'anonymous') return 'AN';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

// Helper to get profile image path based on gender
const getProfileImagePath = (gender) => {
  return gender === 'female' ? '/profile_picture_female.png' : '/profile_picture_male.png';
};

// Helper to get rating color
const getRatingColor = (rating) => {
  const colors = {
    5: { bg: 'bg-green-500/10', text: 'text-green-600' },
    4: { bg: 'bg-lime-500/10', text: 'text-lime-600' },
    3: { bg: 'bg-yellow-500/10', text: 'text-yellow-600' },
    2: { bg: 'bg-orange-500/10', text: 'text-orange-600' },
    1: { bg: 'bg-red-500/10', text: 'text-red-600' },
  };
  
  return colors[rating] || colors[3];
};

// Helper to get sentiment class
const getSentimentClass = (sentiment) => {
  const classes = {
    positive: { bg: 'bg-green-500/10', text: 'text-green-600' },
    neutral: { bg: 'bg-gray-500/10', text: 'text-gray-600' },
    negative: { bg: 'bg-red-500/10', text: 'text-red-600' },
  };
  
  return classes[sentiment] || classes.neutral;
};

const TestimonialCard = ({ testimonial, featured = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [helpfulCount, setHelpfulCount] = useState(testimonial.helpfulCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [replies, setReplies] = useState(testimonial.replies || []);
  
  const { markAsHelpful, addReply, flagTestimonial } = useTestimonialStore();
  const { isAdmin, isAuthenticated, user } = useUserStore();
  
  const isAnonymous = testimonial.name?.toLowerCase().includes('anonymous');
  const isNegative = testimonial.rating < 3;
  const shouldTruncate = testimonial.content?.length > 180 && !isExpanded;
  
  const displayContent = shouldTruncate
    ? `${testimonial.content.substring(0, 180)}...`
    : testimonial.content;
  
  // Handle reply submit
  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    
    const newReply = {
      id: Date.now(),
      content: replyContent.trim(),
      author: user?.name || 'You',
      isAdmin: isAdmin,
      timestamp: 'Baru saja',
      date: new Date().toISOString()
    };
    
    // Add reply locally
    setReplies([...replies, newReply]);
    
    // Call API (if connected)
    addReply(testimonial.id, newReply);
    
    // Reset form
    setReplyContent('');
    setShowReplyInput(false);
  };
  
  // Handle mark as helpful
  const handleMarkHelpful = () => {
    if (!hasLiked) {
      // Update locally
      setHelpfulCount(prev => prev + 1);
      setHasLiked(true);
      
      // Call API (if connected)
      markAsHelpful(testimonial.id);
    }
  };
  
  // Handle share testimonial
  const handleShareTestimonial = () => {
    let shareText = `"${testimonial.content.substring(0, 100)}..." - ${testimonial.name}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Ulasan UIN',
        text: shareText,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert('Link ulasan telah disalin ke clipboard');
    }
  };
  
  // Handle flag testimonial
  const handleFlagTestimonial = () => {
    if (window.confirm('Apakah Anda yakin ingin melaporkan ulasan ini sebagai tidak pantas?')) {
      flagTestimonial(testimonial.id, { reason: 'inappropriate_content' });
      alert('Ulasan telah dilaporkan. Tim moderator akan meninjau.');
    }
  };
  
  // Format date
  const formattedDate = testimonial.date
    ? format(new Date(testimonial.date), 'dd MMM yyyy', { locale: id })
    : testimonial.dateFormatted;
  
  // Get relative time
  const relativeTime = testimonial.date
    ? getRelativeTime(new Date(testimonial.date))
    : testimonial.timestamp;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden hover:shadow-sm transition-shadow ${
        featured ? 'border-primary-200 bg-primary-50/30' : 
        (isAnonymous || isNegative) ? 'bg-gray-50' : 'bg-white'
      }`}>
        {featured && (
          <div className="absolute top-0 right-0">
            <Badge className="m-3 bg-primary-100 text-primary-800 border-none">
              Direkomendasikan
            </Badge>
          </div>
        )}
        
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-9 w-9 border border-gray-100">
                <AvatarImage
                  src={testimonial.profileImage || getProfileImagePath(testimonial.gender)}
                  alt={testimonial.name}
                />
                <AvatarFallback className={isAnonymous ? 'bg-gray-200 text-gray-500' : 'bg-primary-100 text-primary-700'}>
                  {getAvatarFallback(testimonial.name)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  {testimonial.name}
                </h3>
                
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <span>{testimonial.role}</span>
                  
                  {testimonial.region && (
                    <>
                      <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-300"></span>
                      <MapPin className="h-3 w-3 mr-0.5" />
                      <span>{testimonial.region}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`flex h-6 items-center rounded-full px-2 ${
                getRatingColor(testimonial.rating).bg
              }`}>
                <Star className={`h-3.5 w-3.5 mr-0.5 fill-current ${
                  getRatingColor(testimonial.rating).text
                }`} />
                <span className={`text-xs font-medium ${
                  getRatingColor(testimonial.rating).text
                }`}>
                  {testimonial.rating}
                </span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShareTestimonial}>
                    <Share className="h-4 w-4 mr-2" />
                    Bagikan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMarkHelpful}>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Tandai Membantu
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleFlagTestimonial} className="text-red-600">
                    <Flag className="h-4 w-4 mr-2" />
                    Laporkan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-2">
          {/* Warning banner for anonymous or negative reviews */}
          {(isAnonymous || isNegative) && (
            <div className="mb-2 p-1.5 bg-amber-50 rounded text-xs flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-amber-800">
                {isAnonymous && isNegative 
                  ? 'Ulasan anonim dengan rating rendah. Pertimbangkan konteks saat mengevaluasi.' 
                  : isAnonymous 
                    ? 'Ulasan anonim. Identitas pengguna tidak dapat diverifikasi.'
                    : 'Ulasan dengan rating rendah. Evaluasi dengan bijak.'}
              </span>
            </div>
          )}
          
          {/* Service badge if available */}
          {testimonial.serviceName && (
            <div className="mb-2">
              <Badge variant="outline" className="bg-gray-100/80 text-gray-800">
                {testimonial.serviceName}
              </Badge>
            </div>
          )}
          
          {/* Date and time info */}
          <div className="flex items-center text-xs text-gray-500 mb-1.5">
            <Clock className="h-3 w-3 mr-1" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{relativeTime}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formattedDate}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Testimonial content */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {displayContent}
          </p>
          
          {/* Expand/collapse toggle */}
          {testimonial.content?.length > 180 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              {isExpanded ? 'Tampilkan lebih sedikit' : 'Tampilkan selengkapnya'}
            </button>
          )}
          
          {/* Sentiment tag */}
          {testimonial.sentiment && (
            <div className="mt-2">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                getSentimentClass(testimonial.sentiment).bg
              } ${
                getSentimentClass(testimonial.sentiment).text
              }`}>
                {testimonial.sentiment === 'positive' ? 'Positif' : 
                 testimonial.sentiment === 'negative' ? 'Negatif' : 'Netral'}
              </span>
            </div>
          )}
        </CardContent>
        
        {/* Replies section */}
        {replies.length > 0 && (
          <div className="px-3 pb-1">
            <div className="space-y-2 border-t pt-2 border-gray-100">
              {replies.map((reply, index) => (
                <div key={reply.id || index} className="flex gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={reply.isAdmin 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-gray-100 text-gray-700"
                    }>
                      {getAvatarFallback(reply.author)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 bg-gray-50 rounded-md p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 flex items-center">
                        {reply.author}
                        {reply.isAdmin && (
                          <Badge 
                            variant="outline" 
                            className="ml-1.5 text-[10px] h-3.5 py-0 bg-blue-50 text-blue-700 border-blue-100"
                          >
                            Admin
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {reply.timestamp || 'Baru saja'}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Reply input */}
        {showReplyInput && (
          <div className="p-3 pt-0">
            <div className="border-t pt-2 space-y-2 border-gray-100">
              <Textarea
                placeholder="Tulis balasan Anda..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="resize-none min-h-[60px] text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyContent('');
                  }}
                >
                  Batal
                </Button>
                <Button 
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim()}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Kirim
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <CardFooter className="px-3 pt-0 pb-3 flex justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkHelpful}
              disabled={hasLiked}
              className="h-7 text-gray-600 hover:text-gray-900"
            >
              <ThumbsUp className={`h-3.5 w-3.5 mr-1 ${hasLiked ? 'fill-blue-500 text-blue-500' : ''}`} />
              <span className="text-xs">
                {helpfulCount > 0 ? helpfulCount : ''} Bantu
              </span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="h-7 text-gray-600 hover:text-gray-900"
            >
              <Reply className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">
                {replies.length > 0 ? replies.length : ''} Balas
              </span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShareTestimonial}
              className="h-7 w-7 text-gray-600 hover:text-gray-900"
            >
              <Share className="h-3.5 w-3.5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleFlagTestimonial}
              className="h-7 w-7 text-gray-600 hover:text-gray-900"
            >
              <Flag className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard; 