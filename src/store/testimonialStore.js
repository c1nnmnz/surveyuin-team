import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  addReply,
  markAsHelpful,
  flagTestimonial,
  getTestimonialStats,
  getTestimonialTrends
} from '../api/testimonialService';
import { toast } from '@/components/ui/use-toast.jsx';
import { getSentiment } from '@/lib/utils';

// Default stats object to prevent null errors
const defaultStats = {
  total: 0,
  average: 0,
  changePercentage: 0,
  distribution: [
    { rating: 5, count: 0 },
    { rating: 4, count: 0 },
    { rating: 3, count: 0 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 }
  ],
  sentimentDistribution: {
    positive: 0,
    neutral: 0,
    negative: 0
  }
};

/**
 * Testimonial store to manage testimonial state
 */
const useTestimonialStore = create(
  persist(
    (set, get) => ({
      // State
      testimonials: [],
      testimonialDetails: {},
      stats: defaultStats,
      trends: null,
      isLoading: false,
      hasMore: true,
      error: null,
      
      // Pagination
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        hasMore: false
      },
      
      // Filters
      filters: {
        serviceId: null,
        rating: null,
        sortBy: 'newest', // 'newest', 'oldest', 'highest', 'lowest', 'helpful'
        sentiment: null, // 'positive', 'negative', 'neutral'
        search: '',
        region: null,
        userType: null,
        category: null,
      },
      
      // Helper Maps for UI State
      expandedIds: {},
      replyingIds: {},
      pendingReplies: {},
      likedIds: {},
      
      /**
       * Reset all testimonial data
       */
      resetTestimonials: () => {
        set({
          testimonials: [],
          testimonialDetails: {},
          stats: defaultStats,
          trends: null,
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            hasMore: false
          },
          expandedIds: {},
          replyingIds: {},
          pendingReplies: {},
          likedIds: {},
        });
      },
      
      /**
       * Set filters for testimonials
       * @param {Object} newFilters - Filter values to set
       * @param {boolean} fetchImmediately - Whether to fetch testimonials immediately after setting filters
       */
      setFilters: (newFilters, fetchImmediately = false) => {
        set(state => {
          const updatedFilters = { ...state.filters, ...newFilters };
          
          // Reset pagination when filters change
          if (fetchImmediately) {
            return {
              filters: updatedFilters,
              pagination: {
                ...state.pagination,
                page: 1
              },
              testimonials: []
            };
          }
          
          return { filters: updatedFilters };
        });
        
        if (fetchImmediately) {
          get().fetchTestimonials(true);
        }
      },
      
      /**
       * Generate query parameters from filters and pagination
       * @returns {Object} - Query parameters for API request
       */
      getQueryParams: () => {
        const { filters, pagination } = get();
        
        return {
          // Filters
          serviceId: filters.serviceId,
          rating: filters.rating,
          sortBy: filters.sortBy,
          sentiment: filters.sentiment,
          search: filters.search,
          region: filters.region,
          userType: filters.userType,
          category: filters.category,
          
          // Pagination
          page: pagination.page,
          limit: pagination.limit
        };
      },
      
      /**
       * Load more testimonials
       */
      loadMore: () => {
        get().fetchTestimonials(false);
      },
      
      /**
       * Fetch testimonials from API with current filters and pagination
       * @param {boolean} refresh - Whether to refresh the testimonials list
       */
      fetchTestimonials: async (refresh = false) => {
        const { isLoading, pagination } = get();
        
        // Don't fetch if already loading or no more data
        if (isLoading || (!pagination.hasMore && !refresh)) {
          return;
        }
        
        set(state => ({
          isLoading: true,
          error: null,
          // Reset list if refreshing
          pagination: {
            ...state.pagination,
            page: refresh ? 1 : state.pagination.page
          },
          testimonials: refresh ? [] : state.testimonials
        }));
        
        try {
          const params = get().getQueryParams();
          const response = await getTestimonials(params);
          
          set(state => {
            // Merge with existing testimonials if not refreshing
            const updatedTestimonials = refresh 
              ? response.data 
              : [...state.testimonials, ...response.data];
              
            // Remove duplicates
            const uniqueTestimonials = Array.from(
              new Map(updatedTestimonials.map(item => [item.id, item])).values()
            );
            
            return {
              testimonials: uniqueTestimonials,
              isLoading: false,
              pagination: {
                ...state.pagination,
                hasMore: response.hasMore,
                total: response.total,
                page: response.page + 1 // Increment page for next fetch
              },
              error: null
            };
          });
        } catch (error) {
          // Revert page if error occurs
          set(state => ({
            isLoading: false,
            error: error.message || 'Failed to load testimonials',
            pagination: {
              ...state.pagination,
              page: refresh ? 1 : state.pagination.page
            }
          }));
          
          toast({
            title: 'Error',
            description: error.message || 'Failed to load testimonials',
            variant: 'destructive'
          });
        }
      },
      
      /**
       * Fetch a single testimonial by ID
       * @param {string} id - Testimonial ID
       */
      fetchTestimonialById: async (id) => {
        set(state => ({
          isLoading: true,
          error: null
        }));
        
        try {
          const testimonial = await getTestimonialById(id);
          
          set(state => ({
            testimonialDetails: { 
              ...state.testimonialDetails, 
              [id]: testimonial 
            },
            isLoading: false
          }));
          
          return testimonial;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || `Failed to load testimonial #${id}`
          });
          
          toast({
            title: 'Error',
            description: error.message || `Failed to load testimonial #${id}`,
            variant: 'destructive'
          });
          
          return null;
        }
      },
      
      /**
       * Create a new testimonial
       * @param {Object} data - Testimonial data
       */
      createTestimonial: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          // Ensure sentiment is set based on rating
          const processedData = {
            ...data,
            sentiment: getSentiment(data.rating)
          };
          
          const testimonial = await createTestimonial(processedData);
          
          // Add to list and update stats
          set(state => {
            // Add to beginning of list if we're on the first page and no filters
            const shouldPrependToList = state.pagination.page <= 2 && 
              !state.filters.serviceId && 
              !state.filters.rating && 
              !state.filters.sentiment &&
              !state.filters.search;
              
            const updatedTestimonials = shouldPrependToList
              ? [testimonial, ...state.testimonials]
              : state.testimonials;
              
            return {
              testimonials: updatedTestimonials,
              isLoading: false,
              pagination: {
                ...state.pagination,
                total: state.pagination.total + 1
              }
            };
          });
          
          // Fetch updated stats after adding a testimonial
          get().fetchStats();
          
          toast({
            title: 'Sukses',
            description: 'Ulasan berhasil dikirim. Terima kasih atas masukan Anda!',
            variant: 'success'
          });
          
          return testimonial;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to create testimonial'
          });
          
          const errorMessage = error.message ? 
            error.message : 
            'Gagal mengirim ulasan. Silahkan periksa koneksi internet Anda dan coba lagi nanti.';
          
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive'
          });
          
          // Rethrow the error for the component to handle if needed
          throw {
            message: errorMessage,
            originalError: error
          };
        }
      },
      
      /**
       * Toggle expanded state of a testimonial
       * @param {string} id - Testimonial ID
       */
      toggleExpanded: (id) => {
        set(state => ({
          expandedIds: {
            ...state.expandedIds,
            [id]: !state.expandedIds[id]
          }
        }));
      },
      
      /**
       * Toggle reply state of a testimonial
       * @param {string} id - Testimonial ID
       */
      toggleReply: (id) => {
        set(state => ({
          replyingIds: {
            ...state.replyingIds,
            [id]: !state.replyingIds[id]
          }
        }));
      },
      
      /**
       * Update pending reply content
       * @param {string} id - Testimonial ID
       * @param {string} content - Reply content
       */
      updatePendingReply: (id, content) => {
        set(state => ({
          pendingReplies: {
            ...state.pendingReplies,
            [id]: content
          }
        }));
      },
      
      /**
       * Add a reply to a testimonial
       * @param {string} testimonialId - Testimonial ID
       * @param {Object} replyData - Reply data
       */
      addReply: async (testimonialId, replyData) => {
        set({ isLoading: true });
        
        try {
          await addReply(testimonialId, replyData);
          
          // Update testimonial in the list
          set(state => {
            const updatedTestimonials = state.testimonials.map(testimonial => {
              if (testimonial.id === testimonialId) {
                return {
                  ...testimonial,
                  replies: [
                    ...(testimonial.replies || []),
                    {
                      ...replyData,
                      id: `temp-${Date.now()}`,
                      timestamp: 'Baru saja',
                      date: new Date().toISOString()
                    }
                  ]
                };
              }
              return testimonial;
            });
            
            // Clear pending reply and replying state
            return {
              testimonials: updatedTestimonials,
              pendingReplies: {
                ...state.pendingReplies,
                [testimonialId]: ''
              },
              replyingIds: {
                ...state.replyingIds,
                [testimonialId]: false
              },
              isLoading: false
            };
          });
          
          toast({
            title: 'Sukses',
            description: 'Balasan terkirim',
            variant: 'success'
          });
        } catch (error) {
          set({ isLoading: false });
          
          toast({
            title: 'Error',
            description: error.message || 'Gagal mengirim balasan',
            variant: 'destructive'
          });
        }
      },
      
      /**
       * Mark a testimonial as helpful
       * @param {string} id - Testimonial ID
       */
      markAsHelpful: async (id) => {
        // Optimistic update
        set(state => {
          const updatedTestimonials = state.testimonials.map(testimonial => {
            if (testimonial.id === id) {
              return {
                ...testimonial,
                helpfulCount: (testimonial.helpfulCount || 0) + 1
              };
            }
            return testimonial;
          });
          
          return {
            testimonials: updatedTestimonials,
            likedIds: {
              ...state.likedIds,
              [id]: true
            }
          };
        });
        
        try {
          await markAsHelpful(id);
        } catch (error) {
          // Revert on error
          set(state => {
            const updatedTestimonials = state.testimonials.map(testimonial => {
              if (testimonial.id === id) {
                return {
                  ...testimonial,
                  helpfulCount: Math.max((testimonial.helpfulCount || 1) - 1, 0)
                };
              }
              return testimonial;
            });
            
            return {
              testimonials: updatedTestimonials,
              likedIds: {
                ...state.likedIds,
                [id]: false
              }
            };
          });
          
          toast({
            title: 'Error',
            description: error.message || 'Gagal menandai ulasan sebagai membantu',
            variant: 'destructive'
          });
        }
      },
      
      /**
       * Flag a testimonial as inappropriate
       * @param {string} id - Testimonial ID
       * @param {string} reason - Reason for flagging
       */
      flagTestimonial: async (id, reason) => {
        try {
          await flagTestimonial(id, reason);
          
          toast({
            title: 'Laporan Terkirim',
            description: 'Terima kasih atas laporan Anda. Tim kami akan meninjau ulasan ini.',
            variant: 'success'
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: error.message || 'Gagal melaporkan ulasan',
            variant: 'destructive'
          });
        }
      },
      
      /**
       * Fetch testimonial statistics
       * @param {Object} params - Query parameters
       */
      fetchStats: async (params = {}) => {
        set({ isLoading: true });
        
        try {
          const { filters } = get();
          const queryParams = {
            serviceId: filters.serviceId,
            period: params.period || 'all',
          };
          
          const stats = await getTestimonialStats(queryParams);
          
          set({
            stats,
            isLoading: false
          });
          
          return stats;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error.message || 'Failed to load testimonial statistics'
          });
          
          toast({
            title: 'Error',
            description: error.message || 'Gagal memuat statistik ulasan',
            variant: 'destructive'
          });
          
          return null;
        }
      },
      
      /**
       * Fetch testimonial trends data
       * @param {Object} params - Query parameters
       */
      fetchTrends: async (params = {}) => {
        set({ isLoading: true });
        
        try {
          const { filters } = get();
          const queryParams = {
            serviceId: filters.serviceId,
            period: params.period || 'month',
            interval: params.interval || 'day'
          };
          
          const trends = await getTestimonialTrends(queryParams);
          
          set({
            trends,
            isLoading: false
          });
          
          return trends;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error.message || 'Failed to load testimonial trends'
          });
          
          toast({
            title: 'Error',
            description: error.message || 'Gagal memuat tren ulasan',
            variant: 'destructive'
          });
          
          return null;
        }
      }
    }),
    {
      name: 'testimonial-store',
      // Only persist specific state
      partialize: (state) => ({
        filters: state.filters,
        expandedIds: state.expandedIds,
        likedIds: state.likedIds
      }),
      // Migration function to handle version changes
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // If we're migrating from version 0, ensure we have the new structure
          return {
            ...persistedState,
            filters: persistedState.filters || {
              serviceId: null,
              rating: null,
              sortBy: 'newest',
              sentiment: null,
              search: '',
              region: null,
              userType: null,
              category: null,
            },
            expandedIds: persistedState.expandedIds || {},
            likedIds: persistedState.likedIds || {}
          };
        }
        return persistedState;
      }
    }
  )
);

export default useTestimonialStore; 