import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 font-display text-sm font-bold uppercase tracking-wide transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-alpha text-paper'
                    : 'border-transparent text-mist hover:border-steel-line hover:text-paper') +
                className
            }
        >
            {children}
        </Link>
    );
}
