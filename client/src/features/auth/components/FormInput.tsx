type formInputProps = {
    inputType: string;
    placeholder: string;
}

export default function FormInput({ inputType, placeholder }: formInputProps) {
    return (
        <input type={inputType} className="bg-stone-100 px-4 py-3 w-xs mx-auto rounded-sm" placeholder={placeholder} />
    );
}