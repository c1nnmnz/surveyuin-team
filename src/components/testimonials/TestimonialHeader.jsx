import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Home, 
  ChevronLeft, 
  Download, 
  PlusCircle, 
  Share,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Breadcrumb from '@/components/ui/breadcrumb';

const TestimonialHeader = ({ 
  service = null, 
  isAdmin = false,
  showAddButton = true
}) => {
  const navigate = useNavigate();
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Get current date
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: id });
  
  // Handle navigation back to service
  const handleBackToService = () => {
    if (service?.id) {
      navigate(`/service/${service.id}`);
    } else {
      navigate('/directory');
    }
  };
  
  // Handle export data (for admins)
  const handleExportData = (format) => {
    alert(`Exporting data in ${format} format`);
    // Implementation would depend on your API
  };
  
  // Handle share page
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service ? `Ulasan ${service.name}` : 'Ulasan UIN Antasari',
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
        setShowShareDialog(true);
      });
    } else {
      setShowShareDialog(true);
    }
  };
  
  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link telah disalin ke clipboard');
    setShowShareDialog(false);
  };
  
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { path: '/', label: 'Beranda', icon: <Home className="h-4 w-4" /> },
          { path: '/directory', label: 'Layanan' },
          ...(service ? [{ path: `/service/${service.id}`, label: service.name }] : []),
          { label: 'Ulasan Pengguna', icon: <MessageSquare className="h-4 w-4" />, current: true }
        ]}
      />
      
      {/* Page title and actions */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {service && (
            <motion.button 
              onClick={handleBackToService}
              className="inline-flex items-center justify-center p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {service ? `Ulasan ${service.name}` : 'Ulasan Pengguna'}
              
              {service && service.verified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-none">
                        Terverifikasi
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Layanan ini telah diverifikasi oleh admin UIN Antasari</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h1>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {currentDate} • Ulasan dari pengguna sistem UIN Antasari
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Share button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="h-9"
          >
            <Share className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Bagikan</span>
          </Button>
          
          {/* Admin export button */}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Format Export</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleExportData('excel')}>
                    <FileText className="h-4 w-4 mr-2 text-green-600" />
                    <span>Excel (.xlsx)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportData('csv')}>
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    <span>CSV</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportData('pdf')}>
                    <FileText className="h-4 w-4 mr-2 text-red-600" />
                    <span>PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Add testimonial button */}
          {showAddButton && (
            <Button size="sm" className="h-9">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Beri Ulasan</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Share dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bagikan Halaman Ulasan</DialogTitle>
            <DialogDescription>
              Bagikan link halaman ulasan ini dengan orang lain
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {window.location.href}
            </div>
            <Button variant="secondary" size="sm" onClick={handleCopyLink}>
              Salin
            </Button>
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowShareDialog(false)}
            >
              Batal
            </Button>
            <Button 
              className="flex-1"
              onClick={handleCopyLink}
            >
              Bagikan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialHeader; 