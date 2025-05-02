import mockData from './mockData/testimonialData';

/**
 * Mock API handler to intercept requests and return mock data
 */
class MockHandler {
  constructor() {
    this.setupMockInterceptor();
  }

  setupMockInterceptor() {
    // This will be called to initialize the interceptor
    console.log('Mock API handler initialized');
  }

  /**
   * Get testimonials with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Object} - Paginated testimonials
   */
  getTestimonials(params = {}) {
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
    
    // Filter testimonials
    let filteredData = [...mockData.testimonials];
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
      
      return {
        ...testimonial,
        userType: testimonial.userType || derivedUserType
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
    
    // Filter by region
    if (region && region !== 'all') {
      filteredData = filteredData.filter(t => t.region === region);
      console.log('After region filter:', filteredData.length);
    }
    
    // Filter by userType
    if (userType && userType !== 'all') {
      console.log('Filtering by userType:', userType);
      filteredData = filteredData.filter(t => t.userType === userType);
      console.log('After userType filter:', filteredData.length);
      console.log('Remaining data:', filteredData.map(t => ({ id: t.id, name: t.name, role: t.role, userType: t.userType })));
    }
    
    // Filter by category
    if (category && category !== 'all') {
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
    return mockData.stats;
  }
  
  /**
   * Get testimonial trends
   * @param {Object} params - Query parameters
   * @returns {Object} - Trends data
   */
  getTestimonialTrends(params = {}) {
    // For simplicity, just return the mock trends
    return mockData.trends;
  }
}

export default new MockHandler(); 