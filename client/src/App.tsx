import NavHeader from './components/NavHeader';
import LoginForm from './features/auth/components/LoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import ProjectPagePanel from './features/projects/components/ProjectPagePanel';
import './App.css';
import { Routes, Route } from 'react-router';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import api from '@/lib/axios';
import axios from 'axios';

function App() {

  const authContext = useAuth();
  useEffect(() => {
    const verifyStatus = async () => {
      try {
          const response = await api.get('/auth/status', {
            withCredentials: true,
          });
          const data = response.data;
          console.log(data);
          authContext.setIsLoggedIn(true);
          authContext.setUsername(data.username);
          console.log(authContext);
      } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            authContext.setIsLoggedIn(false);
            authContext.setUsername('');
          } else {
            console.error(error);
          }
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
