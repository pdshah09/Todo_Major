// Define the exact props this component accepts
type EntryFieldProps = {
    name: string;
    placeholder: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    type: 'dob' | 'email' | 'text' | 'password' | 'tel';
    pattern?: string;
    onInput?: React.FormEventHandler<HTMLInputElement>;
};

export default function EntryField({
    name,
    placeholder,
    required = false,
    minLength,
    maxLength,
    type,
    onInput,
    pattern
}: EntryFieldProps) {
    const htmlType = type === 'dob' ? 'date' : type;
    
    return(
        <input
            id={name}
            name={name}
            type={htmlType}
            placeholder={placeholder}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            pattern={type === 'tel' ? pattern ?? '[0-9]{10}' : pattern}
            inputMode={type === 'tel' ? 'numeric' : undefined}
            // onInput={
            //     type === 'tel'
            //         ? (e) => {
            //               e.currentTarget.value = e.currentTarget.value
            //                   .replace(/\D/g, '')
            //                   .slice(0, maxLength ?? 10);
            //           }
            //         : undefined
            // }
            onInput={onInput}
            className="w-full px-4 py-3 border-primary rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-700"
        />
    );
}