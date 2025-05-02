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
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import useTestimonialStore from '@/store/testimonialStore';
import { useUserStore } from '@/store/userStore';

const TestimonialListFilters = () => {
  const { filters, setFilters, resetFilters, fetchTestimonials } = useTestimonialStore();
  const { originOptions, typeOptions } = useUserStore();
  
  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };
  
  const handleRatingChange = (value) => {
    setFilters({ rating: value });
  };
  
  const handleSortChange = (value) => {
    setFilters({ sortBy: value });
  };
  
  const handleSentimentChange = (value) => {
    setFilters({ sentiment: value });
  };
  
  const handlePeriodChange = (value) => {
    setFilters({ period: value });
  };
  
  const handleRegionChange = (value) => {
    setFilters({ region: value }, true);
  };
  
  const handleUserTypeChange = (value) => {
    setFilters({ userType: value }, true);
  };
  
  const handleCategoryChange = (value) => {
    setFilters({ category: value }, true);
  };
  
  const handleApplyFilters = () => {
    fetchTestimonials(true);
  };
  
  const handleClearFilters = () => {
    resetFilters();
    fetchTestimonials(true);
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
    filters.rating !== 'all' || 
    filters.sentiment !== 'all' || 
    filters.period !== 'all' || 
    filters.region !== 'all' ||
    filters.userType !== 'all' ||
    filters.category !== 'all' ||
    filters.search !== '';
  
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Cari ulasan..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 focus:ring-primary-500 h-9"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Filter controls */}
          <div className="flex flex-wrap gap-2">
            {/* Rating select */}
            <Select value={filters.rating} onValueChange={handleRatingChange}>
              <SelectTrigger className="w-full sm:w-auto bg-gray-50 border-gray-200 h-9">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="text-sm">Rating</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Rating</SelectItem>
                <SelectItem value="5">5 Bintang</SelectItem>
                <SelectItem value="4">4 Bintang</SelectItem>
                <SelectItem value="3">3 Bintang</SelectItem>
                <SelectItem value="2">2 Bintang</SelectItem>
                <SelectItem value="1">1 Bintang</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sentiment select */}
            <Select value={filters.sentiment} onValueChange={handleSentimentChange}>
              <SelectTrigger className="w-full sm:w-auto bg-gray-50 border-gray-200 h-9">
                <span className="text-sm">Sentimen</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sentimen</SelectItem>
                <SelectItem value="positive">Positif</SelectItem>
                <SelectItem value="neutral">Netral</SelectItem>
                <SelectItem value="negative">Negatif</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Period select */}
            <Select value={filters.period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full sm:w-auto bg-gray-50 border-gray-200 h-9">
                <span className="text-sm">Periode</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort order */}
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-auto bg-gray-50 border-gray-200 h-9">
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
                <Button variant="outline" size="sm" className="bg-gray-50 border-gray-200 h-9">
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-sm">Lanjutan</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Filter Lanjutan</h3>
                  
                  <ScrollArea className="h-56 pr-4">
                    <div className="space-y-3">
                      {/* Filter by region */}
                      <div className="space-y-1.5">
                        <Label htmlFor="region" className="text-xs">Asal Responden</Label>
                        <Select value={filters.region || 'all'} onValueChange={handleRegionChange}>
                          <SelectTrigger id="region" className="h-8 text-sm">
                            <SelectValue placeholder="Semua Responden" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Responden</SelectItem>
                            {originOptions?.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Filter by user type */}
                      <div className="space-y-1.5">
                        <Label htmlFor="userType" className="text-xs">Jenis Responden</Label>
                        <Select value={filters.userType || 'all'} onValueChange={handleUserTypeChange}>
                          <SelectTrigger id="userType" className="h-8 text-sm">
                            <SelectValue placeholder="Semua Jenis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Jenis</SelectItem>
                            {typeOptions?.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Filter by service category */}
                      <div className="space-y-1.5">
                        <Label htmlFor="category" className="text-xs">Kategori Layanan</Label>
                        <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
                          <SelectTrigger id="category" className="h-8 text-sm">
                            <SelectValue placeholder="Semua Kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            <SelectItem value="academic">Akademik</SelectItem>
                            <SelectItem value="finance">Keuangan</SelectItem>
                            <SelectItem value="facility">Fasilitas</SelectItem>
                            <SelectItem value="it">IT & Sistem Informasi</SelectItem>
                            <SelectItem value="library">Perpustakaan</SelectItem>
                            <SelectItem value="student-affairs">Kemahasiswaan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </ScrollArea>
                  
                  <div className="flex justify-between pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={handleClearFilters} className="h-8 text-xs">
                      Reset
                    </Button>
                    <Button size="sm" onClick={handleApplyFilters} className="h-8 text-xs">
                      Terapkan
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Apply filters button */}
            <Button 
              className="ml-auto hidden sm:flex h-9 text-sm" 
              onClick={handleApplyFilters}
            >
              Terapkan Filter
            </Button>
          </div>
          
          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <div className="text-xs text-gray-500">
                Filter:
              </div>
              
              {filters.search && (
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100/80 text-xs py-0.5">
                  <Search className="h-2.5 w-2.5" />
                  <span className="max-w-[100px] truncate">{filters.search}</span>
                  <button 
                    onClick={() => handleRemoveFilter('search')}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}
              
              {filters.rating !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100/80 text-xs py-0.5">
                  {filters.rating} Bintang
                  <button 
                    onClick={() => handleRemoveFilter('rating')}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}
              
              {filters.sentiment !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100/80 text-xs py-0.5">
                  {filters.sentiment === 'positive' ? 'Positif' : 
                    filters.sentiment === 'neutral' ? 'Netral' : 'Negatif'}
                  <button 
                    onClick={() => handleRemoveFilter('sentiment')}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}
              
              {filters.period !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100/80 text-xs py-0.5">
                  {filters.period === 'week' ? 'Minggu Ini' : 
                    filters.period === 'month' ? 'Bulan Ini' : 'Tahun Ini'}
                  <button 
                    onClick={() => handleRemoveFilter('period')}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}
              
              {filters.region !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100/80 text-xs py-0.5">
                  {originOptions?.find(o => o.value === filters.region)?.label || filters.region}
                  <button 
                    onClick={() => handleRemoveFilter('region')}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}
              
              {filters.userType !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100/80 text-xs py-0.5">
                  {typeOptions?.find(o => o.value === filters.userType)?.label || filters.userType}
                  <button 
                    onClick={() => handleRemoveFilter('userType')}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}
              
              {filters.category !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100/80 text-xs py-0.5">
                  {filters.category === 'academic' ? 'Akademik' : 
                   filters.category === 'finance' ? 'Keuangan' :
                   filters.category === 'facility' ? 'Fasilitas' :
                   filters.category === 'it' ? 'IT & Sistem Informasi' :
                   filters.category === 'library' ? 'Perpustakaan' :
                   filters.category === 'student-affairs' ? 'Kemahasiswaan' : 
                   filters.category}
                  <button 
                    onClick={() => handleRemoveFilter('category')}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}
              
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-6 ml-auto sm:ml-0" 
                  onClick={handleClearFilters}
                >
                  Reset Semua
                </Button>
              )}
            </div>
          )}
          
          {/* Mobile apply button */}
          <div className="block sm:hidden">
            <Button 
              className="w-full h-9 text-sm" 
              onClick={handleApplyFilters}
            >
              Terapkan Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialListFilters; 