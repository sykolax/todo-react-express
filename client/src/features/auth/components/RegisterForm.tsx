import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import userIcon from '@assets/user_icon.svg';
import emailIcon from '@assets/email_icon.svg';
import passwordIcon from '@assets/password_icon.svg';

function PasswordWarning({ message }: { message: string}) {
    return (
        <p>✓ {message}</p>
    );
}

export default function RegisterForm() {
    return (
        <form className="flex flex-col w-xs mx-auto mt-60">
            <h2 className="text-3xl mt-0 mb-5">Create your account</h2>
            <div className="flex flex-col gap-4 w-full">
                <FormInput inputType="text" placeholder="Username" icon={userIcon} />
                <FormInput inputType="email" placeholder="Email" icon={emailIcon} />
                <FormInput inputType="password" placeholder="Password" icon={passwordIcon} />
            </div>
            <div className="mt-3 text-left text-xs">
                <p>✓ At least 8 characters long</p>
                <p>✓ Includes a number</p>
                <p>✓ Includes uppercase and lowercase letters</p>
            </div>
            <SubmitButton buttonText="SUBMIT"/>
        </form>
    );
}