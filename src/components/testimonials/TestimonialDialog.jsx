import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PencilLine } from 'lucide-react';
import TestimonialForm from './TestimonialForm';

const TestimonialDialog = ({ trigger, triggerClassName }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            className={triggerClassName || "bg-primary-600 text-white hover:bg-primary-700 px-3 sm:px-5 rounded-lg shadow-sm"}
            size="default"
          >
            <PencilLine className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="whitespace-nowrap text-sm sm:text-base">Tulis Ulasan</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[550px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Form Ulasan</DialogTitle>
        <DialogDescription className="sr-only">
          Form untuk memberikan ulasan layanan UIN Antasari Banjarmasin
        </DialogDescription>
        <TestimonialForm onClose={() => setOpen(false)} isDialog={true} />
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialDialog; 