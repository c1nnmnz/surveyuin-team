import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SendHorizontal, Star, Loader2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast.jsx';
import useTestimonialStore from '@/store/testimonialStore';
import { useUserStore } from '@/store/userStore';
import { serviceUnits } from '@/data/serviceUnits';

// Validation schema
const testimonialSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  email: z.string().email('Email tidak valid'),
  rating: z.string().min(1, 'Rating harus dipilih'),
  serviceName: z.string().min(1, 'Layanan harus dipilih'),
  content: z.string().min(10, 'Ulasan minimal 10 karakter').max(500, 'Ulasan maksimal 500 karakter'),
  isAnonymous: z.boolean().default(false),
});

// Star rating component - make it more compact
const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`p-0.5 rounded-full transition-all ${
            star <= (hoverRating || rating)
              ? 'text-yellow-500 scale-105'
              : 'text-gray-300'
          }`}
          onClick={() => setRating(star.toString())}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star
            className={`h-6 w-6 sm:h-7 sm:w-7 ${
              star <= (hoverRating || rating) ? 'fill-yellow-500' : ''
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const TestimonialForm = ({ onClose, isDialog = false }) => {
  const { toast } = useToast();
  const { createTestimonial } = useTestimonialStore();
  const { user, isAuthenticated } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState("3");
  
  // Initialize form with user data if available
  const form = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      rating: "3",
      serviceName: '',
      content: '',
      isAnonymous: false,
    },
  });
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Find selected service details
      const serviceId = data.serviceName;
      const selectedService = serviceUnits.find(s => s.id.toString() === serviceId);
      
      if (!selectedService) {
        throw new Error('Layanan harus dipilih. Silakan pilih layanan yang valid.');
      }
      
      // If anonymous, replace name with Anonymous
      const processedData = {
        ...data,
        name: data.isAnonymous ? 'Anonymous' : data.name,
        rating: parseInt(data.rating),
        date: new Date().toISOString(),
        role: user?.role || 'public',
        gender: user?.gender || 'male',
        serviceId: selectedService.id.toString(),
        serviceName: selectedService.name,
        category: selectedService.category.toLowerCase(),
      };
      
      // Send data to API 
      await createTestimonial(processedData);
      
      toast({
        title: "Berhasil!",
        description: "Terima kasih atas ulasan Anda.",
        variant: "success"
      });
      
      // Reset form
      form.reset();
      setSelectedRating("3");
      
      // Close dialog if in dialog mode
      if (isDialog && onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      toast({
        title: "Gagal mengirim ulasan",
        description: error.message || "Terjadi kesalahan saat mengirim ulasan. Silahkan coba lagi nanti.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Update rating in form when rating changes
  useEffect(() => {
    form.setValue('rating', selectedRating);
  }, [selectedRating, form]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-full mx-auto border-0 sm:border">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl sm:text-2xl">Berikan Ulasan</CardTitle>
              <CardDescription>
                Bantu kami meningkatkan layanan UIN Antasari Banjarmasin
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama Anda" 
                          {...field} 
                          disabled={form.watch('isAnonymous')}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan email Anda" 
                          type="email" 
                          {...field} 
                          className="h-9"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Email tidak akan ditampilkan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Layanan yang Anda Nilai</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Pilih layanan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        {serviceUnits.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-start">
                        <StarRating 
                          rating={parseInt(selectedRating)} 
                          setRating={setSelectedRating} 
                        />
                        <input 
                          type="hidden" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ulasan Anda</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Bagikan pengalaman Anda dengan layanan ini..." 
                        className="min-h-[80px] max-h-[120px] py-1.5 text-sm resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {field.value?.length || 0}/500 karakter
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Kirim sebagai anonim
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Nama Anda tidak akan ditampilkan di ulasan
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-2">
                {isDialog && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={onClose}
                  >
                    Batal
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="mr-2 h-4 w-4" />
                      Kirim Ulasan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialForm; 