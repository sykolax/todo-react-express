import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import userIcon from '@assets/user_icon.svg';
import emailIcon from '@assets/email_icon.svg';
import passwordIcon from '@assets/password_icon.svg';
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormErrorMessage from './FormErrorMessage';
import api from '@/lib/axios';

type PasswordWarningProps = {
    metCriteria: boolean,
    message: string,
};

function PasswordWarning({ metCriteria, message }: PasswordWarningProps) {
    return (
        <p className={`${metCriteria ? 'text-lime-500' : 'text-red-500'}`}>✓ { message }</p>
    );
}

export default function RegisterForm() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [formError, setFormError] = useState({
        username: '',
        email: '',
        password: '',
     });
    const [isPasswordStrong, setIsPasswordStrong] = useState({
        long: false,
        number: false,
        upperLower: false,
    });
    const [hasBeenChecked, setHasBeenChecked] = useState(false);
    const numberRegex = /\d/;
    const upperRegex = /[A-Z]/;
    const lowerRegex = /[a-z]/;

    const [submitError, setSubmitError] = useState(false);
    const submitErrorMessage = 'Something went wrong. Try again.';

    const navigate = useNavigate();
    const authContext = useAuth();
    
     useEffect(() => {
        if (authContext.isLoggedIn && !authContext.isLoading) {
            navigate('/projects');
        }
     }, [authContext.isLoggedIn, authContext.isLoading]);

    async function registerUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        authContext.setIsLoading(true);
        if (!validateForm()) {
            authContext.setIsLoading(false);
            return;
        }
        try {
            const response = await api.post('auth/register/', {
            email: formData.email,
            name: formData.username,
            password: formData.password,
        }); 
            const data = response.data;
            authContext.setUsername(data.username);
            authContext.setIsLoggedIn(true);
        } catch (error) {
            console.error(error);
            setSubmitError(true);
            authContext.setIsLoggedIn(false);
            authContext.setUsername('');

        } finally {
            authContext.setIsLoading(false);
        }
    }

     function validateForm() {
        const newErrors = {
            username: formData.username ? '' : 'Username is required.',
            email: formData.email ? '' : 'Email is required.', 
            password: formData.password ? '' : 'Password is required.',
        };
        setFormError(newErrors);
        return !newErrors.username && !newErrors.email && !newErrors.password;
     }

    function checkPassword(password: string) {
        // onchange on the password 
        setFormData((prev) => ({...prev, password: password}));
        setHasBeenChecked(true);
        // 1. At least 8 characters long
        if (password.length >= 8) {
            setIsPasswordStrong((prev) => ({...prev, long: true}));
        } else {
            setIsPasswordStrong((prev) => ({...prev, long: false}));
        }
        // 2. Includes a number
        if (numberRegex.test(password)) {
            setIsPasswordStrong((prev) => ({...prev, number: true}));
        } else {
            setIsPasswordStrong((prev) => ({...prev, number: false}));
        }
        // 3. Includes uppercase and lowercase 
        if (lowerRegex.test(password) && upperRegex.test(password)) {
            setIsPasswordStrong((prev) => ({...prev, upperLower: true}));
        } else {
            setIsPasswordStrong((prev) => ({...prev, upperLower: false}));
        }
    }

    return (
        <form onSubmit={registerUser} className="flex flex-col w-xs mx-auto mt-30 md:mt-40">
            <h2 className="text-3xl mt-0 mb-5">Create your account</h2>
            <div className="flex flex-col gap-4 w-full">
                { submitError && <FormErrorMessage message={submitErrorMessage} /> }
                { formError.username && <FormErrorMessage message={formError.username}/>}
                <FormInput inputType="text" placeholder="Username" icon={userIcon} value={formData.username} onChange={(e) => setFormData((prev) => ({...prev, username: e.target.value}))}/>
                { formError.email && <FormErrorMessage message={formError.email}/>}
                <FormInput inputType="email" placeholder="Email" icon={emailIcon} value={formData.email} onChange={(e) => setFormData((prev) => ({...prev, email: e.target.value}))}/>
                { formError.password && <FormErrorMessage message={formError.password}/>}
                <FormInput inputType="password" placeholder="Password" icon={passwordIcon} value={formData.password} onChange={(e) => checkPassword(e.target.value)}/>
            </div>
            <div className={`mt-3 text-left text-xs ${hasBeenChecked ? 'block': 'hidden'}`}>
                <PasswordWarning message="At least 8 characters long" metCriteria={isPasswordStrong.long}/>
                <PasswordWarning message="Includes a number" metCriteria={isPasswordStrong.number}/>
                <PasswordWarning message="Includes uppercase and lowercase letters" metCriteria={isPasswordStrong.upperLower}/>
            </div>
            <SubmitButton text="SUBMIT" />
        </form>
    );
}