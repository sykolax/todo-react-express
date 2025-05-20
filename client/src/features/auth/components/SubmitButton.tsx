type submitButtonProps = {
    message: string;
}

export default function SubmitButton({ buttonText }: {buttonText: string}) {
    return (
    <button className="mt-4 py-2 bg-black text-white rounded-4xl">{buttonText}</button>
    );
}