export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-signal ' + className}
        >
            {message}
        </p>
    ) : null;
}
