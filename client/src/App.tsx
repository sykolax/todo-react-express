import NavHeader from './components/NavHeader';
import LoginForm from './features/auth/components/LoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import ProjectPagePanel from './features/projects/components/ProjectPagePanel';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import api from '@/lib/axios';
import axios from 'axios';

function App() {

  const authContext = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyStatus = async () => {
      authContext.setIsLoading(true);
      try {
          const response = await api.get('/auth/status', {
            withCredentials: true,
          });
          console.log('verifying status');
          const data = response.data;
          authContext.setUsername(data.username);
          authContext.setIsLoggedIn(true);
      } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            authContext.setUsername('');
            authContext.setIsLoggedIn(false);
          } else {
            console.error(error);
          }
          navigate('/login');
      } finally {
        authContext.setIsLoading(false);
      }
    }
    verifyStatus();
  }, []);

  return (
    <>
      <NavHeader />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/projects" element={<ProjectPagePanel />} />
      </Routes>
    </>
  )
}

export default App
