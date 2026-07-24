export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded border border-steel-line bg-transparent px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-paper transition duration-150 ease-in-out hover:border-mist hover:text-white focus:outline-none focus:ring-2 focus:ring-alpha focus:ring-offset-2 focus:ring-offset-ink disabled:opacity-40 ${
                    disabled && 'opacity-40'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
