import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Confirme seu e-mail" />

            <div className="mb-4 font-mono text-sm text-mist">
                Obrigado por se cadastrar! Antes de continuar, confirme seu
                e-mail clicando no link que acabamos de enviar. Se não
                recebeu, podemos enviar outro.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 font-mono text-sm text-alpha">
                    Um novo link de confirmação foi enviado para o e-mail
                    informado no cadastro.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Reenviar e-mail
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded font-mono text-sm text-mist underline decoration-steel-line underline-offset-4 hover:text-paper focus:outline-none focus:ring-2 focus:ring-alpha"
                    >
                        Sair
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
