type formInputProps = {
    inputType: string;
    placeholder: string;
    icon: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({ inputType, placeholder, icon, value, onChange }: formInputProps) {
    return (
        <div className="flex gap-3 bg-stone-100 px-4 py-3 w-xs mx-auto rounded-sm">
            <img src={icon} />
            <input autoComplete="on" type={inputType} name={inputType} className="" placeholder={placeholder} value={value} onChange={onChange}/>
        </div>
    );
}