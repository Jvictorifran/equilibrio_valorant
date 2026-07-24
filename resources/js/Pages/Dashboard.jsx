import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

function StatusPill({ status, playersCount, capacity }) {
    if (status === 'drawn') {
        return (
            <span className="rounded border border-alpha/40 bg-alpha/10 px-2 py-1 font-mono text-xs uppercase tracking-wide text-alpha">
                Sorteado
            </span>
        );
    }

    return (
        <span className="rounded border border-steel-line px-2 py-1 font-mono text-xs uppercase tracking-wide text-mist">
            {playersCount}/{capacity} na sala
        </span>
    );
}

export default function Dashboard({ rooms, hasCompleteProfile }) {
    const createForm = useForm({});
    const joinForm = useForm({ code: '' });

    const createRoom = (e) => {
        e.preventDefault();
        createForm.post(route('rooms.store'));
    };

    const joinRoom = (e) => {
        e.preventDefault();
        joinForm.post(route('rooms.join'), {
            onSuccess: () => joinForm.reset('code'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-paper">
                    Salas
                </h2>
            }
        >
            <Head title="Salas" />

            <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
                {!hasCompleteProfile && (
                    <div className="rounded border border-bravo/50 bg-bravo/10 px-4 py-3 font-mono text-sm text-bravo">
                        Complete seu{' '}
                        <Link
                            href={route('profile.edit')}
                            className="underline decoration-bravo/50 underline-offset-4 hover:text-paper"
                        >
                            perfil (elo, KD, win rate e HS%)
                        </Link>{' '}
                        antes de entrar numa sala — o sorteio só roda com
                        todo mundo com perfil completo.
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded border border-steel-line bg-steel p-6">
                        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                            Criar sala
                        </h3>
                        <p className="mt-1 font-mono text-sm text-mist">
                            Você vira o host e recebe um código pra
                            compartilhar.
                        </p>
                        <form onSubmit={createRoom} className="mt-4">
                            <PrimaryButton
                                className="w-full"
                                disabled={createForm.processing}
                            >
                                Criar sala
                            </PrimaryButton>
                        </form>
                    </div>

                    <div className="rounded border border-steel-line bg-steel p-6">
                        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                            Entrar com código
                        </h3>
                        <p className="mt-1 font-mono text-sm text-mist">
                            Peça o código de 6 caracteres pra quem criou a
                            sala.
                        </p>
                        <form
                            onSubmit={joinRoom}
                            className="mt-4 flex gap-2"
                        >
                            <TextInput
                                value={joinForm.data.code}
                                onChange={(e) =>
                                    joinForm.setData(
                                        'code',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="AB12CD"
                                maxLength={6}
                                className="w-full uppercase tracking-widest"
                            />
                            <SecondaryButton disabled={joinForm.processing}>
                                Entrar
                            </SecondaryButton>
                        </form>
                        {joinForm.errors.code && (
                            <p className="mt-2 font-mono text-sm text-signal">
                                {joinForm.errors.code}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                        Minhas salas
                    </h3>

                    {rooms.length === 0 ? (
                        <p className="mt-3 font-mono text-sm text-mist">
                            Nenhuma sala ainda. Crie uma ou entre com um
                            código.
                        </p>
                    ) : (
                        <ul className="mt-3 divide-y divide-steel-line rounded border border-steel-line bg-steel">
                            {rooms.map((room) => (
                                <li key={room.code}>
                                    <button
                                        onClick={() =>
                                            router.get(
                                                route('rooms.show', room.code),
                                            )
                                        }
                                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-alpha"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="font-mono text-base tracking-widest text-paper">
                                                {room.code}
                                            </span>
                                            {room.isHost && (
                                                <span className="font-mono text-xs uppercase tracking-wide text-bravo">
                                                    host
                                                </span>
                                            )}
                                        </span>
                                        <StatusPill
                                            status={room.status}
                                            playersCount={room.playersCount}
                                            capacity={room.capacity}
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
