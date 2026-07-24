import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Entrar" />

            {status && (
                <div className="mb-4 font-mono text-sm text-alpha">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Senha" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 font-mono text-sm text-mist">
                            Continuar conectado
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded font-mono text-sm text-mist underline decoration-steel-line underline-offset-4 hover:text-paper focus:outline-none focus:ring-2 focus:ring-alpha"
                        >
                            Esqueceu a senha?
                        </Link>
                    )}

                    <PrimaryButton disabled={processing}>
                        Entrar
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-6 border-t border-steel-line pt-4 font-mono text-sm text-mist">
                Ainda não tem conta?{' '}
                <Link
                    href={route('register')}
                    className="text-alpha underline decoration-alpha/40 underline-offset-4 hover:text-paper"
                >
                    Cadastre-se
                </Link>
            </p>
        </GuestLayout>
    );
}
