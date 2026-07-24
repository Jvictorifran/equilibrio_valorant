import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-ink px-4 pt-10 sm:justify-center sm:pt-0">
            <Link
                href="/"
                className="flex items-center gap-3 text-paper"
            >
                <ApplicationLogo className="h-9 w-9" />
                <span className="font-display text-xl font-bold uppercase tracking-wide">
                    Sorteio Equilibrado
                </span>
            </Link>

            <div className="mt-8 w-full overflow-hidden rounded border border-steel-line bg-steel px-6 py-6 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
