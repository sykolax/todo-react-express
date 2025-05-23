import { useState } from 'react';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import FormErrorMessage from './FormErrorMessage';
import emailIcon from '@assets/email_icon.svg';
import passwordIcon from '@assets/password_icon.svg';
import api from '@/lib/axios';
import { useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm () {
     const [formData, setFormData] = useState({
        email: '',
        password: '',
     });
     const [formError, setFormError] = useState({
        email: '',
        password: '',
     });
     const [submitErrorMessage, setSubmitErrorMessage] = useState('');
     const navigate = useNavigate();
     const authContext = useAuth();

     async function loginUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (validateForm()) {
            // no errors on the form, submit
            try {
                const response = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password,
                });
                const data = response.data;
                authContext.setIsLoggedIn(true);
                authContext.setUsername(data.username);
                navigate("/projects");
                console.log(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                    setSubmitErrorMessage(error.message);
                }
            }
        }
    }

     function validateForm() {
        const newErrors = {
            email: formData.email ? '' : 'Email is required.', 
            password: formData.password ? '' : 'Password is required.',
        };        
        setFormError(newErrors);
        return !newErrors.email && !newErrors.password;
     }

    return (
        <form id="loginForm" onSubmit={loginUser} className="flex flex-col w-xs mx-auto mt-20 md:mt-50 lg:mt-60">
            <h2 className="text-3xl mt-0 mb-5">Log in to your account</h2>
            {submitErrorMessage && <p className="text-red-600 text-sm mb-3">{submitErrorMessage + "!"}</p>}
            <div className="flex flex-col gap-4 w-full">
                <FormInput inputType="email" placeholder="Email" icon={emailIcon} value={formData.email} 
                onChange={(e) => { setFormData((prev) => ({...prev, email: e.target.value})); setFormError((prev) => ({ ...prev, email: '' })); }}/>
                {formError.email && <FormErrorMessage message={formError.email}/>}

                <FormInput inputType="password" placeholder="password" icon={passwordIcon} value={formData.password} 
                onChange={(e) => { setFormData((prev) => ({...prev, password: e.target.value})); setFormError((prev) => ({ ...prev, password: ''})); }}/>
                {formError.password && <FormErrorMessage message={formError.password} />}
            </div>
            <SubmitButton text="LOG IN"/>
        </form>
    );
}