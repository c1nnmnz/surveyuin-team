# Survey Layanan UIN Antasari Banjarmasin
# Front-End App (Still Under Developing)
# Deadline deploying to public (End of June 2025)

This repository contains the frontend codebase for the UIN Antasari Survey Web Project. The frontend is built with React.js and is designed to connect with a CodeIgniter 4 PHP backend.

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- CodeIgniter 4 backend running

### Installation
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd frontend-uinantasari
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Connecting with CodeIgniter 4 Backend
This frontend application uses Axios to communicate with the CodeIgniter 4 backend. The connection is configured to work with RESTful API endpoints provided by the backend.

### API Client Setup
Create an API client configuration file at `src/api/client.js`:

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to attach the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Environment Variables
Create a `.env` file in the root of your project:

```
VITE_API_BASE_URL=http://your-backend-url/api
```

Replace `http://your-backend-url/api` with the actual URL of your CodeIgniter 4 backend API.

### API Services
Create service files for different API endpoints. For example:

**Authentication Service (`src/api/auth.js`):**

```javascript
import apiClient from './client';

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
    return response.data;
  },
  
  getProfile: async () => {
    return await apiClient.get('/auth/me');
  }
};
```

**Survey Service (`src/api/survey.js`):**

```javascript
import apiClient from './client';

export const surveyApi = {
  getAllSurveys: async () => {
    return await apiClient.get('/surveys');
  },
  
  getSurveyById: async (id) => {
    return await apiClient.get(`/surveys/${id}`);
  },
  
  createSurvey: async (surveyData) => {
    return await apiClient.post('/surveys', surveyData);
  },
  
  updateSurvey: async (id, surveyData) => {
    return await apiClient.put(`/surveys/${id}`, surveyData);
  },
  
  deleteSurvey: async (id) => {
    return await apiClient.delete(`/surveys/${id}`);
  }
};
```

## CodeIgniter 4 Backend Requirements
Your CodeIgniter 4 backend should:

1. Have CORS enabled to allow requests from your frontend domain
2. Implement JWT or session-based authentication
3. Provide RESTful API endpoints that match the frontend expectations

### Example CodeIgniter 4 CORS Configuration
In your CodeIgniter 4 project, modify the `app/Config/Filters.php` file:

```php
public $globals = [
    'before' => [
        'cors' => ['except' => ['login*', 'register*']],
        // ... other filters
    ],
    // ... after filters
];
```

And create a CORS filter in `app/Filters/Cors.php`:

```php
<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method == 'OPTIONS') {
            die();
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing
    }
}
```

Register this filter in `app/Config/Filters.php`:

```php
public $aliases = [
    // ... other filters
    'cors' => \App\Filters\Cors::class,
];
```

## Usage Example
```jsx
import { useState } from 'react';
import { authApi } from '../api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await authApi.login(email, password);
      console.log('Login successful', userData);
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;
## Troubleshooting
### Common Issues
1. **CORS errors**: Ensure your CodeIgniter backend has proper CORS headers configured.
2. **Authentication errors**: Check if your tokens are properly sent and processed.
3. **API endpoint mismatches**: Verify that your frontend API calls match the backend routes.

### Debugging Tips
- Use browser developer tools to inspect network requests
- Check your backend logs for errors
- Verify that your API base URL is correctly set in the `.env` file
- Test your API endpoints using tools like Postman before integrating with the frontend

## License
[Hafiz]

## Contact
[https://github.com/c1nnmnz]
