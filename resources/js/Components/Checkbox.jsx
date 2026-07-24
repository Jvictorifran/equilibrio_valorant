export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-steel-line bg-ink text-alpha shadow-none focus:ring-alpha focus:ring-offset-ink ' +
                className
            }
        />
    );
}
