import NavHeader from './components/NavHeader'
import LoginForm from './features/auth/components/LoginForm'
import RegisterForm from './features/auth/components/RegisterForm'
import ProjectPagePanel from './features/projects/components/ProjectPagePanel'
import './App.css'
import { Routes, Route } from 'react-router'

function App() {

  return (
    <>
        <NavHeader isLoggedIn={true} />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/projects" element={<ProjectPagePanel />} />
        </Routes>
    </>
  )
}

export default App
