import React from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import useTestimonialStore from '@/store/testimonialStore';
import { useUserStore } from '@/store/userStore';

const TestimonialListFilters = () => {
  const { filters, setFilters, fetchTestimonials } = useTestimonialStore();
  const { originOptions, typeOptions } = useUserStore();
  
  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };
  
  const handleRatingChange = (value) => {
    setFilters({ rating: value }, true);
  };
  
  const handleSortChange = (value) => {
    setFilters({ sortBy: value }, true);
  };
  
  const handleSentimentChange = (value) => {
    setFilters({ sentiment: value }, true);
  };
  
  const handleClearFilters = () => {
    setFilters({
      rating: 'all',
      sentiment: 'all',
      period: 'all',
      region: 'all',
      userType: 'all',
      category: 'all',
      search: ''
    }, true);
  };
  
  const handleRemoveFilter = (filterKey) => {
    const resetValue = {
      rating: 'all',
      sentiment: 'all',
      period: 'all',
      region: 'all',
      userType: 'all',
      category: 'all',
      search: ''
    };
    
    setFilters({ [filterKey]: resetValue[filterKey] }, true);
  };
  
  // Check if any filter is active
  const hasActiveFilters = 
    filters.rating !== 'all' && filters.rating !== null || 
    filters.sentiment !== 'all' && filters.sentiment !== null ||
    filters.search?.trim() !== '';
  
  return (
    <div className="space-y-4 w-full">
      {/* Search and filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search input */}
        <div className="relative flex-grow min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Cari ulasan..."
            className="pl-10 pr-4 py-2 w-full bg-gray-50 focus-visible:ring-primary-500"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Rating select */}
          <Select value={filters.rating || 'all'} onValueChange={handleRatingChange}>
            <SelectTrigger className="w-[120px] bg-gray-50">
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-sm">Rating</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="5">5 Bintang</SelectItem>
              <SelectItem value="4">4 Bintang</SelectItem>
              <SelectItem value="3">3 Bintang</SelectItem>
              <SelectItem value="2">2 Bintang</SelectItem>
              <SelectItem value="1">1 Bintang</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort order */}
          <Select value={filters.sortBy || 'newest'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] bg-gray-50">
              <span className="text-sm">Urutkan</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="highest">Rating Tertinggi</SelectItem>
              <SelectItem value="lowest">Rating Terendah</SelectItem>
              <SelectItem value="helpful">Paling Membantu</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Advanced filters popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 bg-gray-50 border-gray-200">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                <span className="text-sm">Lanjutan</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Filter Lanjutan</h3>
                  
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-gray-500"
                      onClick={handleClearFilters}
                    >
                      Reset
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="sentiment" className="text-xs">Sentimen</Label>
                    <Select value={filters.sentiment || 'all'} onValueChange={handleSentimentChange}>
                      <SelectTrigger id="sentiment" className="h-8 text-sm">
                        <SelectValue placeholder="Semua Sentimen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Sentimen</SelectItem>
                        <SelectItem value="positive">Positif</SelectItem>
                        <SelectItem value="neutral">Netral</SelectItem>
                        <SelectItem value="negative">Negatif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Clear filters button */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500" 
              onClick={handleClearFilters}
            >
              <X className="h-4 w-4 mr-1" />
              <span className="text-sm">Clear</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.rating !== 'all' && filters.rating !== null && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Rating: {filters.rating} ★
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleRemoveFilter('rating')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.sentiment !== 'all' && filters.sentiment !== null && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Sentiment: {filters.sentiment === 'positive' ? 'Positif' : 
                filters.sentiment === 'negative' ? 'Negatif' : 'Netral'}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleRemoveFilter('sentiment')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.search?.trim() !== '' && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              "{filters.search}"
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleRemoveFilter('search')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default TestimonialListFilters; 