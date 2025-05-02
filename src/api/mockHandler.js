import mockData from './mockData/testimonialData';

/**
 * Mock API handler to intercept requests and return mock data
 */
class MockHandler {
  constructor() {
    // Ensure dynamicTestimonials is initialized as an empty array
    this.dynamicTestimonials = [];
    this.setupMockInterceptor();
    
    // Initialize dynamic testimonials from localStorage if available
    try {
      const savedTestimonials = localStorage.getItem('mock_testimonials');
      if (savedTestimonials) {
        this.dynamicTestimonials = JSON.parse(savedTestimonials);
        console.log('Loaded dynamic testimonials from localStorage:', this.dynamicTestimonials.length);
      }
    } catch (error) {
      console.error('Error loading dynamic testimonials:', error);
      // Ensure we still have a valid array even after an error
      this.dynamicTestimonials = [];
    }
  }

  setupMockInterceptor() {
    // This will be called to initialize the interceptor
    console.log('Mock API handler initialized');
  }

  /**
   * Add a new testimonial to mock data
   * @param {Object} testimonial - Testimonial data
   * @returns {Object} - The added testimonial
   */
  addTestimonial(testimonial) {
    // Ensure dynamicTestimonials exists
    if (!this.dynamicTestimonials) {
      this.dynamicTestimonials = [];
    }
    
    // Create a new testimonial with generated ID
    const newTestimonial = {
      ...testimonial,
      id: `dynamic-${Date.now()}`,
      date: new Date().toISOString(),
      timestamp: 'Baru saja',
      isVerified: false,
      helpfulCount: 0,
      replies: []
    };
    
    // Add to dynamic testimonials
    this.dynamicTestimonials.unshift(newTestimonial);
    
    // Save to localStorage
    try {
      localStorage.setItem('mock_testimonials', JSON.stringify(this.dynamicTestimonials));
    } catch (error) {
      console.error('Error saving dynamic testimonials to localStorage:', error);
    }
    
    console.log('Added new testimonial to mock data:', newTestimonial);
    return newTestimonial;
  }

  /**
   * Get testimonials with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Object} - Paginated testimonials
   */
  getTestimonials(params = {}) {
    // Ensure dynamicTestimonials exists before accessing it
    if (!this.dynamicTestimonials) {
      this.dynamicTestimonials = [];
      console.warn('dynamicTestimonials was undefined, initializing as empty array');
    }
    
    let { 
      serviceId, 
      rating, 
      sortBy = 'newest', 
      sentiment, 
      page = 1, 
      limit = 10,
      search = '',
      region,
      userType,
      category
    } = params;
    
    console.log('Filter params:', params);
    
    // Make sure mockData and testimonials exist
    const mockTestimonials = mockData && mockData.testimonials ? mockData.testimonials : [];
    
    // Combine static and dynamic testimonials
    const combinedTestimonials = [...this.dynamicTestimonials, ...mockTestimonials];
    
    // Filter testimonials
    let filteredData = [...combinedTestimonials];
    console.log('Initial data count:', filteredData.length);
    
    // Assign userType based on role for filtering
    filteredData = filteredData.map(testimonial => {
      let derivedUserType = 'public';
      
      if (testimonial.role) {
        const roleLower = testimonial.role.toLowerCase();
        if (roleLower.includes('mahasiswa')) {
          derivedUserType = 'student';
        } else if (roleLower.includes('dosen') || roleLower.includes('guru besar') || roleLower.includes('professor')) {
          derivedUserType = 'lecturer';
        } else if (roleLower.includes('kepala') || roleLower.includes('staff') || roleLower.includes('admin')) {
          derivedUserType = 'staff';
        } else if (roleLower.includes('calon mahasiswa')) {
          derivedUserType = 'prospective';
        } else if (roleLower.includes('alumni')) {
          derivedUserType = 'alumni';
        } else if (roleLower.includes('pengunjung') || roleLower.includes('tamu')) {
          derivedUserType = 'public';
        } else if (roleLower.includes('mitra') || roleLower.includes('stakeholder')) {
          derivedUserType = 'partner';
        }
      }
      
      // Derive respondentOrigin from faculty info in role
      let derivedRespondentOrigin = 'public';
      if (testimonial.role) {
        const roleLower = testimonial.role.toLowerCase();
        if (roleLower.includes('fakultas ushuluddin')) {
          derivedRespondentOrigin = 'fuh';
        } else if (roleLower.includes('fakultas dakwah')) {
          derivedRespondentOrigin = 'fdik';
        } else if (roleLower.includes('fakultas ekonomi')) {
          derivedRespondentOrigin = 'febi';
        } else if (roleLower.includes('fakultas syariah')) {
          derivedRespondentOrigin = 'fs';
        } else if (roleLower.includes('fakultas tarbiyah')) {
          derivedRespondentOrigin = 'ftk';
        } else if (roleLower.includes('pascasarjana')) {
          derivedRespondentOrigin = 'pasca';
        } else if (roleLower.includes('kantor pusat') || roleLower.includes('rektorat')) {
          derivedRespondentOrigin = 'rektorat';
        }
      }
      
      // Derive category from serviceName if possible
      let derivedCategory = 'academic';
      if (testimonial.serviceName) {
        const serviceNameLower = testimonial.serviceName.toLowerCase();
        if (serviceNameLower.includes('keuangan') || serviceNameLower.includes('finance')) {
          derivedCategory = 'finance';
        } else if (serviceNameLower.includes('perpustakaan') || serviceNameLower.includes('library')) {
          derivedCategory = 'library';
        } else if (serviceNameLower.includes('utipd') || serviceNameLower.includes('it') || serviceNameLower.includes('sistem informasi')) {
          derivedCategory = 'it';
        } else if (serviceNameLower.includes('fasilitas') || serviceNameLower.includes('facility')) {
          derivedCategory = 'facility';
        } else if (serviceNameLower.includes('mahasiswa') || serviceNameLower.includes('kemahasiswaan')) {
          derivedCategory = 'student-affairs';
        }
      }
      
      return {
        ...testimonial,
        userType: testimonial.userType || derivedUserType,
        respondentOrigin: testimonial.respondentOrigin || derivedRespondentOrigin,
        category: testimonial.category || derivedCategory
      };
    });
    
    // Filter by serviceId
    if (serviceId && serviceId !== 'all') {
      filteredData = filteredData.filter(t => t.serviceId === serviceId);
      console.log('After serviceId filter:', filteredData.length);
    }
    
    // Filter by rating
    if (rating && rating !== 'all') {
      filteredData = filteredData.filter(t => t.rating === parseInt(rating));
      console.log('After rating filter:', filteredData.length);
    }
    
    // Filter by sentiment
    if (sentiment && sentiment !== 'all') {
      filteredData = filteredData.filter(t => t.sentiment === sentiment);
      console.log('After sentiment filter:', filteredData.length);
    }
    
    // Filter by region (respondentOrigin)
    if (region && region !== 'all') {
      console.log('Filtering by region/respondentOrigin:', region);
      filteredData = filteredData.filter(t => t.respondentOrigin === region);
      console.log('After region filter:', filteredData.length);
    }
    
    // Filter by userType
    if (userType && userType !== 'all') {
      console.log('Filtering by userType:', userType);
      filteredData = filteredData.filter(t => t.userType === userType);
      console.log('After userType filter:', filteredData.length);
    }
    
    // Filter by category
    if (category && category !== 'all') {
      console.log('Filtering by category:', category);
      filteredData = filteredData.filter(t => t.category === category);
      console.log('After category filter:', filteredData.length);
    }
    
    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      filteredData = filteredData.filter(t => 
        t.content.toLowerCase().includes(term) || 
        t.name.toLowerCase().includes(term) ||
        t.role.toLowerCase().includes(term)
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'newest':
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filteredData.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filteredData.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filteredData.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      default:
        break;
    }
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total: filteredData.length,
      page,
      limit,
      hasMore: endIndex < filteredData.length
    };
  }
  
  /**
   * Get a specific testimonial by ID
   * @param {string} id - Testimonial ID
   * @returns {Object} - Testimonial data
   */
  getTestimonialById(id) {
    // First check if the ID is in dynamic testimonials
    if (this.dynamicTestimonials) {
      const dynamicTestimonial = this.dynamicTestimonials.find(t => t.id === id);
      if (dynamicTestimonial) {
        return dynamicTestimonial;
      }
    }
    
    // Then check static testimonials
    if (!mockData || !mockData.testimonials) {
      throw new Error('Mock testimonial data is not available');
    }
    
    const testimonial = mockData.testimonials.find(t => t.id === id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    return testimonial;
  }
  
  /**
   * Get testimonial statistics
   * @param {Object} params - Query parameters
   * @returns {Object} - Statistics
   */
  getTestimonialStats(params = {}) {
    // For simplicity, just return the mock stats
    if (!mockData || !mockData.stats) {
      // Return default stats if mock data is not available
      return {
        totalTestimonials: this.dynamicTestimonials ? this.dynamicTestimonials.length : 0,
        averageRating: 0,
        sentimentBreakdown: {
          positive: 0,
          neutral: 0,
          negative: 0
        },
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      };
    }
    return mockData.stats;
  }
  
  /**
   * Get testimonial trends
   * @param {Object} params - Query parameters
   * @returns {Object} - Trends data
   */
  getTestimonialTrends(params = {}) {
    // For simplicity, just return the mock trends
    if (!mockData || !mockData.trends) {
      // Return default trends if mock data is not available
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Testimonials',
            data: [0, 0, 0, 0, 0, 0]
          }
        ]
      };
    }
    return mockData.trends;
  }
}

export default new MockHandler(); 