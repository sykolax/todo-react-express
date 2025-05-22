type submitButtonProps = {
    text: string;
}

export default function SubmitButton({ text }: submitButtonProps) {
    return (
        <button type="submit" className="mt-4 py-2 bg-black text-white rounded-4xl">{text}</button>
    );
}