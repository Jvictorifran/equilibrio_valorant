export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded border border-transparent bg-signal px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition duration-150 ease-in-out hover:bg-signal/90 focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2 focus:ring-offset-ink active:bg-signal/80 ${
                    disabled && 'opacity-40'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
