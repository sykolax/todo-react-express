import './LoginForm.css';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';

export default function LoginForm () {
    return (
        <form className="flex flex-col w-xs mx-auto">
            <h2 className="text-3xl mt-0 mb-5">Log in to your account</h2>
            <div className="flex flex-col gap-4 w-full">
                <FormInput inputType="email" placeholder="Email" />
                <FormInput inputType="password" placeholder="password" />
            </div>
            <SubmitButton buttonText="LOG IN"/>
        </form>
    );
}