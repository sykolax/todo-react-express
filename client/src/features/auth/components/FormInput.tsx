type formInputProps = {
    inputType: string;
    placeholder: string;
    icon: string;
}

export default function FormInput({ inputType, placeholder, icon }: formInputProps) {
    return (
        <div className="flex gap-3 bg-stone-100 px-4 py-3 w-xs mx-auto rounded-sm">
            <img src={icon} />
            <input type={inputType} className="" placeholder={placeholder} />
        </div>
    );
}