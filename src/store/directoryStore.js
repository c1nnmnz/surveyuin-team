import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { serviceUnits } from '../data/serviceUnits';

// Debug check to ensure all services are loaded
console.log('Total services in source data:', serviceUnits.length);
console.log('Service IDs:', serviceUnits.map(s => s.id).sort((a, b) => a - b).join(', '));


// Create the directory store
export const useDirectoryStore = create(
  persist(
    (set, get) => {
      // Add internal flag to track initialization
      let isInitialized = false;
      
      return {
      // Store version to handle updates
      storeVersion: "1.0.1", // Update this when making significant changes
      
      // All service units
      services: serviceUnits,
      
      // Flag to track initialization state 
      get isInitialized() {
        return isInitialized;
      },
      
      // Method to mark store as initialized
      setInitialized: () => {
        isInitialized = true;
      },
      
      // Filter and search state
      searchQuery: '',
      facultyFilter: 'all',
      categoryFilter: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      
      // User's favorite services
      favorites: [],
      
      // Tracks which services the user has completed surveys for
      completedSurveys: [],
      
      // Action to set search query
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Action to set faculty filter
      setFacultyFilter: (faculty) => set({ facultyFilter: faculty }),
      
      // Action to set category filter
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      
      // Action to set sort method
      setSorting: (sortBy, sortOrder = 'asc') => set({ sortBy, sortOrder }),
      
      // Action to toggle a service as favorite
      toggleFavorite: (serviceId) => set((state) => {
        const isFavorite = state.favorites.includes(serviceId);
        return {
          favorites: isFavorite
            ? state.favorites.filter(id => id !== serviceId)
            : [...state.favorites, serviceId]
        };
      }),
      
      // Action to mark a survey as completed
      markSurveyCompleted: (serviceId) => set((state) => ({
        completedSurveys: state.completedSurveys.includes(serviceId)
          ? state.completedSurveys
          : [...state.completedSurveys, serviceId]
      })),
      
      // Action to reset all filters
      resetFilters: () => set({
        searchQuery: '',
        facultyFilter: 'all',
        categoryFilter: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
      }),
      
      // Computed property to get all unique faculties
      getFaculties: () => {
        const faculties = [...new Set(serviceUnits.map(service => service.faculty))];
        return ['all', ...faculties].map(faculty => ({
          value: faculty === 'all' ? 'all' : faculty,
          label: faculty === 'all' ? 'Semua Fakultas/Unit' : faculty
        }));
      },
      
      // Computed property to get all unique categories
      getCategories: () => {
        const categories = [...new Set(serviceUnits.map(service => service.category))];
        
        // Debug: Check if Keuangan is in the categories list
        if (!categories.includes('Keuangan')) {
          console.warn('Keuangan category missing from automatic detection!');
          categories.push('Keuangan');
        }
        
        return ['all', ...categories].map(category => ({
          value: category === 'all' ? 'all' : category,
          label: category === 'all' ? 'Semua Kategori' : category
        }));
      },
      
      // Computed property to get filtered and sorted services
      getFilteredServices: () => {
        const state = get();
        let filtered = [...state.services];
        
        // Apply search query
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(service => 
            service.name.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query) ||
            service.location.toLowerCase().includes(query)
          );
        }
        
        // Apply faculty filter
        if (state.facultyFilter !== 'all') {
          filtered = filtered.filter(service => 
            service.faculty === state.facultyFilter
          );
        }
        
        // Apply category filter
        if (state.categoryFilter !== 'all') {
          filtered = filtered.filter(service => 
            service.category === state.categoryFilter
          );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
          let valueA, valueB;
          
          // Determine values to compare based on sortBy
          switch (state.sortBy) {
            case 'name':
              valueA = a.name;
              valueB = b.name;
              break;
            case 'faculty':
              valueA = a.faculty;
              valueB = b.faculty;
              break;
            case 'category':
              valueA = a.category;
              valueB = b.category;
              break;
            default:
              valueA = a.name;
              valueB = b.name;
          }
          
          // Perform the comparison
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return state.sortOrder === 'asc' 
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          } else {
            return state.sortOrder === 'asc'
              ? valueA - valueB
              : valueB - valueA;
          }
        });
        
        return filtered;
      },
      
      // Get a service by ID
      getServiceById: (id) => {
        // If store is not initialized yet, return null without warnings
        if (!isInitialized) {
          return null;
        }
        
        // Handle null or undefined id
        if (id === null || id === undefined) {
          console.warn('getServiceById called with null or undefined id');
          return null;
        }
        
        // Try to parse the ID as an integer
        const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
        
        // Handle non-numeric IDs or NaN after parsing
        if (isNaN(parsedId)) {
          console.warn(`getServiceById called with non-numeric id: ${id}`);
          return null;
        }
        
        // Find the service with the matching ID
        return get().services.find(service => service.id === parsedId);
      },
      
      // Check if a service is favorited
      isServiceFavorite: (serviceId) => {
        return get().favorites.includes(serviceId);
      },
      
      // Check if a service has a completed survey
      isServiceCompleted: (serviceId) => {
        return get().completedSurveys.includes(serviceId);
      }
    };
    },
    {
      name: 'directory-storage-v2', // Updated name to force a reset
      onRehydrateStorage: (state) => {
        console.log('Directory store rehydrated with version:', serviceUnits.length, 'services');
        
        // Mark store as initialized after rehydration
        return (rehydratedState) => {
          if (rehydratedState) {
            setTimeout(() => {
              rehydratedState.setInitialized();
            }, 100);
          }
        };
      }
    }
  )
); 

// Export a function to initialize the store
export function initializeDirectoryStore() {
  const store = useDirectoryStore.getState();
  store.setInitialized();
  return store;
} 