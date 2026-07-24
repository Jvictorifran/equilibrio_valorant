export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-semibold uppercase tracking-wider text-mist ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
