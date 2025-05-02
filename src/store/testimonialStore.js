import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import testimonialService from '../api/testimonialService';

const initialState = {
  testimonials: [],
  filteredTestimonials: [],
  currentTestimonial: null,
  totalCount: 0,
  isLoading: false,
  error: null,
  stats: {
    average: 0,
    total: 0,
    thisWeek: 0,
    changePercentage: 0,
    distribution: [],
    sentimentDistribution: {
      positive: 0,
      neutral: 0,
      negative: 0
    }
  },
  trends: [],
  pagination: {
    page: 1,
    limit: 10,
    hasMore: true
  },
  filters: {
    serviceId: null,
    rating: 'all',
    sortBy: 'newest',
    search: '',
    sentiment: 'all',
    period: 'all',
    region: 'all',
    userType: 'all',
    category: 'all'
  }
};

const useTestimonialStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Fetch testimonials with filters and pagination
        fetchTestimonials: async (resetPagination = false) => {
          try {
            set({ isLoading: true, error: null });
            
            const { filters, pagination } = get();
            const params = {
              ...filters,
              page: resetPagination ? 1 : pagination.page,
              limit: pagination.limit
            };
            
            const response = await testimonialService.getTestimonials(params);
            
            // Ensure each testimonial has gender for profile pictures
            const processedData = response.data.map(testimonial => ({
              ...testimonial,
              gender: testimonial.gender || (testimonial.name.toLowerCase().includes('fadiyah') || 
                      testimonial.name.toLowerCase().includes('siti') || 
                      testimonial.name.toLowerCase().includes('dina') || 
                      testimonial.name.toLowerCase().includes('ratna') ? 'female' : 'male')
            }));
            
            set((state) => ({
              testimonials: resetPagination 
                ? processedData 
                : [...state.testimonials, ...processedData],
              filteredTestimonials: resetPagination 
                ? processedData
                : [...state.testimonials, ...processedData],
              totalCount: response.total,
              pagination: {
                ...state.pagination,
                page: resetPagination ? 1 : state.pagination.page,
                hasMore: response.data.length === pagination.limit
              },
              isLoading: false
            }));
          } catch (error) {
            set({ error: error?.message || 'Failed to load testimonials', isLoading: false });
          }
        },
        
        // Load more testimonials (pagination)
        loadMore: async () => {
          const { pagination, isLoading } = get();
          
          if (pagination.hasMore && !isLoading) {
            set((state) => ({
              pagination: { ...state.pagination, page: state.pagination.page + 1 }
            }));
            await get().fetchTestimonials(false);
          }
        },
        
        // Set filters
        setFilters: (newFilters, fetchImmediately = false) => {
          set((state) => ({
            filters: {
              ...state.filters,
              ...newFilters
            }
          }));
          
          // Optionally fetch data immediately after setting filters
          if (fetchImmediately) {
            setTimeout(() => get().fetchTestimonials(true), 0);
          }
        },
        
        // Reset filters to default
        resetFilters: () => {
          const { serviceId } = get().filters;
          set({
            filters: {
              ...initialState.filters,
              serviceId // Keep the current serviceId
            }
          });
        },
        
        // Fetch testimonial statistics
        fetchStats: async () => {
          try {
            set({ isLoading: true, error: null });
            
            const { filters } = get();
            const response = await testimonialService.getTestimonialStats({
              serviceId: filters.serviceId,
              period: filters.period
            });
            
            set({ stats: response, isLoading: false });
          } catch (error) {
            set({ error: error?.message || 'Failed to load statistics', isLoading: false });
          }
        },
        
        // Fetch testimonial trends
        fetchTrends: async () => {
          try {
            set({ isLoading: true, error: null });
            
            const { filters } = get();
            const response = await testimonialService.getTestimonialTrends({
              serviceId: filters.serviceId,
              period: 'week',
              interval: 'day'
            });
            
            set({ trends: response, isLoading: false });
          } catch (error) {
            set({ error: error?.message || 'Failed to load trends', isLoading: false });
          }
        },
        
        // Get a specific testimonial by ID
        fetchTestimonialById: async (id) => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await testimonialService.getTestimonialById(id);
            
            set({ currentTestimonial: response, isLoading: false });
            return response;
          } catch (error) {
            set({ error: error?.message || 'Failed to load testimonial', isLoading: false });
            return null;
          }
        },
        
        // Create a new testimonial
        createTestimonial: async (testimonialData) => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await testimonialService.createTestimonial(testimonialData);
            
            set((state) => ({
              testimonials: [response, ...state.testimonials],
              filteredTestimonials: [response, ...state.filteredTestimonials],
              isLoading: false
            }));
            
            // Refresh stats
            await get().fetchStats();
            
            return response;
          } catch (error) {
            set({ error: error?.message || 'Failed to create testimonial', isLoading: false });
            return null;
          }
        },
        
        // Update an existing testimonial
        updateTestimonial: async (id, updates) => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await testimonialService.updateTestimonial(id, updates);
            
            set((state) => ({
              testimonials: state.testimonials.map(t => 
                t.id === id ? { ...t, ...response } : t
              ),
              filteredTestimonials: state.filteredTestimonials.map(t => 
                t.id === id ? { ...t, ...response } : t
              ),
              currentTestimonial: state.currentTestimonial?.id === id 
                ? { ...state.currentTestimonial, ...response }
                : state.currentTestimonial,
              isLoading: false
            }));
            
            return response;
          } catch (error) {
            set({ error: error?.message || 'Failed to update testimonial', isLoading: false });
            return null;
          }
        },
        
        // Delete a testimonial
        deleteTestimonial: async (id) => {
          try {
            set({ isLoading: true, error: null });
            
            await testimonialService.deleteTestimonial(id);
            
            set((state) => ({
              testimonials: state.testimonials.filter(t => t.id !== id),
              filteredTestimonials: state.filteredTestimonials.filter(t => t.id !== id),
              currentTestimonial: state.currentTestimonial?.id === id 
                ? null
                : state.currentTestimonial,
              isLoading: false
            }));
            
            // Refresh stats
            await get().fetchStats();
            
            return true;
          } catch (error) {
            set({ error: error?.message || 'Failed to delete testimonial', isLoading: false });
            return false;
          }
        },
        
        // Add a reply to a testimonial
        addReply: async (testimonialId, replyData) => {
          try {
            // Update optimistically for immediate UI feedback
            set((state) => ({
              testimonials: state.testimonials.map(t => 
                t.id === testimonialId 
                  ? { 
                      ...t, 
                      replies: Array.isArray(t.replies) 
                        ? [...t.replies, replyData] 
                        : [replyData] 
                    } 
                  : t
              ),
              isLoading: true
            }));
            
            // API call
            const response = await testimonialService.addReply(testimonialId, replyData);
            
            set({ isLoading: false });
            return response;
          } catch (error) {
            // If API call fails, restore the previous state
            const { testimonials } = get();
            set({
              testimonials: testimonials.map(t => 
                t.id === testimonialId 
                  ? { 
                      ...t, 
                      replies: Array.isArray(t.replies) && t.replies.length > 0
                        ? t.replies.slice(0, -1) // Remove the optimistically added reply
                        : [] 
                    } 
                  : t
              ),
              error: error?.message || 'Failed to add reply',
              isLoading: false
            });
            return null;
          }
        },
        
        // Mark a testimonial as helpful
        markAsHelpful: async (id) => {
          try {
            // Update optimistically for immediate UI feedback
            set((state) => ({
              testimonials: state.testimonials.map(t => 
                t.id === id 
                  ? { 
                      ...t, 
                      helpfulCount: (t.helpfulCount || 0) + 1,
                      userHasLiked: true
                    } 
                  : t
              ),
              isLoading: true
            }));
            
            // API call
            const response = await testimonialService.markAsHelpful(id);
            
            set({ isLoading: false });
            return response;
          } catch (error) {
            // If API call fails, restore the previous state
            const { testimonials } = get();
            set({
              testimonials: testimonials.map(t => 
                t.id === id 
                  ? { 
                      ...t, 
                      helpfulCount: Math.max(0, (t.helpfulCount || 1) - 1),
                      userHasLiked: false
                    } 
                  : t
              ),
              error: error?.message || 'Failed to mark as helpful',
              isLoading: false
            });
            return null;
          }
        },
        
        // Flag a testimonial
        flagTestimonial: async (id, report) => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await testimonialService.flagTestimonial(id, report);
            
            set((state) => ({
              testimonials: state.testimonials.map(t => 
                t.id === id ? { ...t, isFlagged: true } : t
              ),
              isLoading: false
            }));
            
            return response;
          } catch (error) {
            set({ error: error?.message || 'Failed to flag testimonial', isLoading: false });
            return null;
          }
        },
        
        // Clear errors
        clearError: () => set({ error: null }),
      }),
      {
        name: 'testimonial-store', // Name for localStorage persistence
        version: 1, // Version for migration management
      }
    )
  )
);

export default useTestimonialStore; 