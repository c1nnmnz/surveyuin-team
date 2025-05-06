import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Use SWC minify
      minify: true,
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true      
    })    
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Define environment variables directly in the config
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3000/api/v1'),
    'import.meta.env.VITE_USE_MOCK_DATA': JSON.stringify('true'),
  },
  build: {
    chunkSizeWarningLimit: 600,
    // Enable source maps for production builds
    sourcemap: true,
    // Enable minification optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.* in production
        drop_debugger: true, // Remove debugger statements
      },
    },
    // Split chunks intelligently
    rollupOptions: {
      output: {
        // Better caching with content hashing
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Intelligently group chunks
        manualChunks: {
          // Core framework
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // UI components by framework
          'ui-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          
          // Style utilities
          'ui-utils': [
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
          
          // Icons
          'icons': ['lucide-react', '@heroicons/react'],
          
          // Animation libraries
          'animations': ['framer-motion'],
          
          // Form libraries
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Data management
          'data-management': ['@tanstack/react-query', 'zustand', 'axios'],
          
          // Charts and visualization
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          
          // Date handling
          'date-utils': ['date-fns'],
        }
      }
    },
    // Optimize output
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4kb - assets smaller than this will be inlined
    // Compress resulting output
    reportCompressedSize: true,
  },
  // Enable image optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
      '@tanstack/react-query'
    ],
    // Exclude large dependencies that don't need optimization
    exclude: [
      'canvas-confetti'
    ]
  },
  // Better dev server performance
  server: {
    hmr: {
      overlay: true,
    },
    open: true,
    // Add compression for dev server
    compress: true
  },
})
