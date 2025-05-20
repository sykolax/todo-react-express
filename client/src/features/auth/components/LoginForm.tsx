import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import emailIcon from '@assets/email_icon.svg';
import passwordIcon from '@assets/password_icon.svg';

export default function LoginForm () {
    return (
        <form className="flex flex-col w-xs mx-auto mt-60">
            <h2 className="text-3xl mt-0 mb-5">Log in to your account</h2>
            <div className="flex flex-col gap-4 w-full">
                <FormInput inputType="email" placeholder="Email" icon={emailIcon} />
                <FormInput inputType="password" placeholder="password" icon={passwordIcon} />
            </div>
            <SubmitButton buttonText="LOG IN"/>
        </form>
    );
}