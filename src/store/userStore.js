import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock user data for development
const mockUsers = [
  {
    id: 'user1',
    name: 'Hafiz',
    email: 'hafiz@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    department: 'Pendidikan Agama Islam',
    semester: 6,
    gender: 'male'
  },
  {
    id: 'user2',
    name: 'Muhamad Arianoor, S.Tr, Kom.',
    email: 'ariganteng@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    department: 'Pendidikan Agama Islam',
    position: 'Dosen Tetap',
    gender: 'male'
  },
  {
    id: 'user3',
    name: 'Handy Hartono Setiawan',
    email: 'handy@uin-antasari.ac.id',
    role: 'staff',
    avatar: null,
    department: 'UTIPD',
    position: 'Admin TI',
    gender: 'male'
  },
  {
    id: 'user4',
    name: 'Fadiyah Nur',
    email: 'fadiyah@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Ekonomi dan Bisnis Islam',
    department: 'Ekonomi Syariah',
    semester: 6,
    gender: 'female'
  },
  {
    id: 'user5',
    name: 'Nurul Hasanah',
    email: 'nurul@calon.uin-antasari.ac.id',
    role: 'prospective',
    avatar: null,
    gender: 'female'
  },
  {
    id: 'user6',
    name: 'Muhammad Rizki',
    email: 'rizki@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Syariah',
    department: 'Hukum Ekonomi Syariah',
    semester: 4,
    gender: 'male'
  },
  
  // New students (Mahasiswa)
  {
    id: 'user7',
    name: 'Ahmad Fauzi',
    email: 'ahmadfauzi@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    department: 'Pendidikan Agama Islam',
    semester: 6,
    gender: 'male'
  },
  {
    id: 'user8',
    name: 'Siti Nurhaliza',
    email: 'sitinurhaliza@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    department: 'Pendidikan Bahasa Arab',
    semester: 4,
    gender: 'female'
  },
  {
    id: 'user9',
    name: 'Rizky Pratama',
    email: 'rizkypratama@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Ekonomi dan Bisnis Islam',
    department: 'Perbankan Syariah',
    semester: 6,
    gender: 'male'
  },
  {
    id: 'user10',
    name: 'Indah Lestari',
    email: 'indahlestari@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Dakwah dan Ilmu Komunikasi',
    department: 'Komunikasi dan Penyiaran Islam',
    semester: 4,
    gender: 'female'
  },
  {
    id: 'user11',
    name: 'Muhammad Arif',
    email: 'muhammadarif@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Syariah',
    department: 'Hukum Keluarga Islam',
    semester: 6,
    gender: 'male'
  },
  {
    id: 'user12',
    name: 'Fitriani Rahma',
    email: 'fitrianirahma@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Ushuluddin dan Humaniora',
    department: 'Ilmu Al-Quran dan Tafsir',
    semester: 4,
    gender: 'female'
  },
  
  // Lecturers (Dosen)
  {
    id: 'user13',
    name: 'Dr. H. Mahfudz Bahri',
    email: 'mahfudzbahri@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    department: 'Pendidikan Agama Islam',
    position: 'Dosen Tetap',
    gender: 'male'
  },
  {
    id: 'user14',
    name: 'Dr. Hj. Nurhayati Idris',
    email: 'nurhayatiidris@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Syariah',
    department: 'Hukum Ekonomi Syariah',
    position: 'Dosen Tetap',
    gender: 'female'
  },
  {
    id: 'user15',
    name: 'M. Zainuddin, M.Ag',
    email: 'zainuddin@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Ushuluddin dan Humaniora',
    department: 'Ilmu Al-Quran dan Tafsir',
    position: 'Dosen Tetap',
    gender: 'male'
  },
  {
    id: 'user16',
    name: 'Siti Rahmawati, M.Hum',
    email: 'sitirahmawati@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Dakwah dan Ilmu Komunikasi',
    department: 'Komunikasi dan Penyiaran Islam',
    position: 'Dosen Tetap',
    gender: 'female'
  },
  
  // Senior Professors (Guru Besar)
  {
    id: 'user17',
    name: 'Prof. Dr. H. Jalaluddin, M.Ag',
    email: 'jalaluddin@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    department: 'Pendidikan Agama Islam',
    position: 'Guru Besar',
    gender: 'male'
  },
  {
    id: 'user18',
    name: 'Prof. Dr. Hj. Saodah Nasution, M.Si',
    email: 'saodahnasution@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Ekonomi dan Bisnis Islam',
    department: 'Ekonomi Syariah',
    position: 'Guru Besar',
    gender: 'female'
  },
  {
    id: 'user19',
    name: 'Prof. Dr. Muhammad Thahir, M.Ed',
    email: 'muhammadthahir@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Ushuluddin dan Humaniora',
    department: 'Ilmu Al-Quran dan Tafsir',
    position: 'Guru Besar',
    gender: 'male'
  },
  
  // Campus Staff (Staf Kampus)
  {
    id: 'user20',
    name: 'Riko Saputra',
    email: 'rikosaputra@uin-antasari.ac.id',
    role: 'staff',
    avatar: null,
    department: 'UTIPD',
    position: 'Staf TI',
    gender: 'male'
  },
  {
    id: 'user21',
    name: 'Endah Lestari',
    email: 'endahlestari@uin-antasari.ac.id',
    role: 'staff',
    avatar: null,
    department: 'Keuangan',
    position: 'Staf Administrasi',
    gender: 'female'
  },
  {
    id: 'user22',
    name: 'Bagas Nurjaman',
    email: 'bagasnurjaman@uin-antasari.ac.id',
    role: 'staff',
    avatar: null,
    department: 'Perpustakaan',
    position: 'Pustakawan',
    gender: 'male'
  },
  
  // Public (Masyarakat Umum)
  {
    id: 'user23',
    name: 'Bambang Santoso',
    email: 'bambangsantoso@gmail.com',
    role: 'public',
    avatar: null,
    gender: 'male'
  },
  {
    id: 'user24',
    name: 'Rukiah Anwar',
    email: 'rukiahanwar@gmail.com',
    role: 'public',
    avatar: null,
    gender: 'female'
  },
  {
    id: 'user25',
    name: 'H. Mulyadi',
    email: 'hmulyadi@gmail.com',
    role: 'public',
    avatar: null,
    gender: 'male'
  }
];

// Form options
export const ageOptions = [
  { value: 'below18', label: 'Di bawah 18 Tahun' },
  { value: '18to28', label: '18 – 28 Tahun' },
  { value: '28to39', label: '28 – 39 Tahun' },
  { value: '40to49', label: '40 - 49 Tahun' },
  { value: '50to59', label: '50 – 59 Tahun' },
  { value: '60to69', label: '60 – 69 Tahun' },
  { value: 'above70', label: 'Diatas 70 Tahun' },
];

export const genderOptions = [
  { value: 'male', label: 'Laki-Laki' },
  { value: 'female', label: 'Perempuan' },
];

export const regionOptions = [
  { value: 'banjarmasin', label: 'Banjarmasin' },
  { value: 'martapura', label: 'Martapura' },
  { value: 'banjarbaru', label: 'Banjarbaru' },
  { value: 'kapuas', label: 'Kapuas' },
  { value: 'other', label: 'Lainnya' },
];

export const originOptions = [
  { value: 'fuh', label: 'Fakultas Ushuluddin dan Humaniora' },
  { value: 'fdik', label: 'Fakultas Dakwah dan Ilmu Komunikasi' },
  { value: 'febi', label: 'Fakultas Ekonomi dan Bisnis Islam' },
  { value: 'fs', label: 'Fakultas Syariah' },
  { value: 'ftk', label: 'Fakultas Tarbiyah dan Keguruan' },
  { value: 'pasca', label: 'Pascasarjana' },
  { value: 'rektorat', label: 'Kantor Pusat' },
  { value: 'public', label: 'Masyarakat Umum' },
  { value: 'stakeholder', label: 'Mitra Kerjasama/Stakeholder' },
];

export const typeOptions = [
  { value: 'lecturer', label: 'Dosen' },
  { value: 'staff', label: 'Staff' },
  { value: 'student', label: 'Mahasiswa' },
  { value: 'prospective', label: 'Calon Mahasiswa' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'public', label: 'Masyarakat Umum' },
  { value: 'partner', label: 'Mitra Kerjasama' },
];

export const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,
      
      // User profile data
      userData: {
        fullName: '',
        age: '',
        gender: '',
        respondentOrigin: '',
        respondentType: '',
      },
      
      // Form options for components
      originOptions,
      typeOptions,
      regionOptions,
      
      // Survey history
      surveyHistory: [],
      
      // Authentication actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(u => u.email === email);
          
          if (user && password === 'password') {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ error: 'Email atau password salah', isLoading: false });
            return false;
          }
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      // Get user info by ID or other criteria
      getUserByName: (name) => {
        if (!name) return null;
        return mockUsers.find(u => u.name.toLowerCase().includes(name.toLowerCase()));
      },
      
      getUsersByFaculty: (faculty) => {
        if (!faculty) return [];
        return mockUsers.filter(u => u.faculty && u.faculty.toLowerCase().includes(faculty.toLowerCase()));
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Check if user already exists
          const existingUser = mockUsers.find(u => u.email === userData.email);
          
          if (existingUser) {
            set({ error: 'Email sudah terdaftar', isLoading: false });
            return false;
          }
          
          // Create new user
          const newUser = {
            id: `user${mockUsers.length + 1}`,
            ...userData,
            avatar: null,
          };
          
          mockUsers.push(newUser);
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        // Reset user authentication state
        set({ 
          user: null, 
          isAuthenticated: false,
          userData: {
            fullName: '',
            age: '',
            gender: '',
            respondentOrigin: '',
            respondentType: '',
          },
          surveyHistory: []
        });
        
        // Clear ALL localStorage data to ensure complete cleanup
        try {
          // Option 1: Clear everything in localStorage (most secure approach)
          localStorage.clear();
          
          // Option 2: If selective clearing is needed, use this instead:
          // const keys = Object.keys(localStorage);
          // for (const key of keys) {
          //   // Preserve only critical app settings if needed
          //   if (!key.includes('app-theme') && !key.includes('language-preference')) {
          //     localStorage.removeItem(key);
          //   }
          // }
          
          // Clear persisted Zustand stores
          localStorage.removeItem('survey-store');
          localStorage.removeItem('user-store');
          localStorage.removeItem('directory-store');
          
          console.log('All user data cleared successfully');
        } catch (err) {
          console.error('Error clearing user data:', err);
        }
        
        // Force redirect to login page
        window.location.href = '/login';
      },
      
      // Profile management actions
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const currentUser = get().user;
          const updatedUser = { ...currentUser, ...userData };
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser;
          }
          
          set({ 
            user: updatedUser, 
            isLoading: false,
            userData: { ...get().userData, ...userData },
          });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      updateAvatar: async (avatarUrl) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const updatedUser = { ...get().user, avatar: avatarUrl };
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser;
          }
          
          set({ user: updatedUser, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists
          const user = mockUsers.find(u => u.email === email);
          
          if (!user) {
            set({ error: 'Email tidak terdaftar', isLoading: false });
            return false;
          }
          
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      // User data management
      updateUserData: (data) => set((state) => ({
        userData: { ...state.userData, ...data },
      })),
      
      setLoggedIn: (status) => set({ isAuthenticated: status }),
      
      addCompletedSurvey: (surveyData) => set((state) => ({
        surveyHistory: [...state.surveyHistory, {
          ...surveyData,
          timestamp: new Date().toISOString(),
        }],
      })),
      
      clearSurveyHistory: () => set({ surveyHistory: [] }),
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'user-store'
    }
  )
); 