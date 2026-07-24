import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-alpha bg-steel text-paper'
                    : 'border-transparent text-mist hover:border-steel-line hover:bg-steel hover:text-paper'
            } font-display text-sm font-bold uppercase tracking-wide transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
