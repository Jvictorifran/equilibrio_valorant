import BalanceBeam from '@/Components/BalanceBeam';
import PrimaryButton from '@/Components/PrimaryButton';
import RankBadge from '@/Components/RankBadge';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function PlayerRow({ position, player, accent }) {
    return (
        <li className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="flex items-center gap-3">
                <span className="w-6 font-mono text-xs text-mist">
                    {String(position).padStart(2, '0')}
                </span>
                <span className="font-mono text-sm text-paper">
                    {player.name}
                </span>
                {!player.hasCompleteProfile && (
                    <span className="rounded border border-signal/50 bg-signal/10 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-signal">
                        perfil incompleto
                    </span>
                )}
            </span>
            <span className="flex items-center gap-3">
                {player.hasCompleteProfile && (
                    <RankBadge tier={player.rankTier} />
                )}
                {accent && (
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: accent }}
                        aria-hidden="true"
                    />
                )}
            </span>
        </li>
    );
}

export default function Show({ room }) {
    const user = usePage().props.auth.user;
    const drawForm = useForm({});
    const leaveForm = useForm({});
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (room.status === 'drawn') return;

        const interval = setInterval(() => {
            router.reload({ only: ['room'] });
        }, 3000);

        return () => clearInterval(interval);
    }, [room.status]);

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(room.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard unavailable — the code is already visible on screen.
        }
    };

    const draw = () => {
        drawForm.post(route('rooms.draw', room.code));
    };

    const leave = () => {
        leaveForm.post(route('rooms.leave', room.code));
    };

    const isWaiting = room.status === 'waiting';
    const teamA = room.players.filter((p) => p.team === 'A');
    const teamB = room.players.filter((p) => p.team === 'B');
    const totalA = teamA.reduce((sum, p) => sum + (p.balanceScore ?? 0), 0);
    const totalB = teamB.reduce((sum, p) => sum + (p.balanceScore ?? 0), 0);

    const canDraw =
        room.isHost &&
        room.players.length === room.capacity &&
        room.players.every((p) => p.hasCompleteProfile);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-paper">
                        Sala
                    </h2>
                    <button
                        onClick={copyCode}
                        className="flex items-center gap-2 rounded border border-steel-line bg-ink px-3 py-1.5 font-mono text-lg tracking-[0.3em] text-paper transition hover:border-alpha focus:outline-none focus-visible:ring-2 focus-visible:ring-alpha"
                        title="Copiar código da sala"
                    >
                        {room.code}
                        <span className="font-mono text-xs text-mist">
                            {copied ? 'copiado!' : 'copiar'}
                        </span>
                    </button>
                </div>
            }
        >
            <Head title={`Sala ${room.code}`} />

            <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded border border-steel-line bg-steel p-6">
                    <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-mist">
                        Equilíbrio dos times
                    </p>
                    <div className="mt-4">
                        <BalanceBeam
                            leftTotal={totalA}
                            rightTotal={totalB}
                            leftLabel="Time Alfa"
                            rightLabel="Time Bravo"
                            resolved={room.status === 'drawn'}
                        />
                    </div>
                </div>

                {room.status === 'drawn' ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded border border-alpha/40 bg-steel">
                            <div className="border-b border-alpha/30 bg-alpha/10 px-4 py-2">
                                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-alpha">
                                    Time Alfa
                                </h3>
                            </div>
                            <ul className="divide-y divide-steel-line">
                                {teamA.map((player, i) => (
                                    <PlayerRow
                                        key={player.id}
                                        position={i + 1}
                                        player={player}
                                    />
                                ))}
                            </ul>
                        </div>

                        <div className="rounded border border-bravo/40 bg-steel">
                            <div className="border-b border-bravo/30 bg-bravo/10 px-4 py-2">
                                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-bravo">
                                    Time Bravo
                                </h3>
                            </div>
                            <ul className="divide-y divide-steel-line">
                                {teamB.map((player, i) => (
                                    <PlayerRow
                                        key={player.id}
                                        position={i + 1}
                                        player={player}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="rounded border border-steel-line bg-steel">
                        <div className="flex items-center justify-between border-b border-steel-line px-4 py-3">
                            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-paper">
                                Jogadores
                            </h3>
                            <span className="font-mono text-xs text-mist">
                                {room.players.length}/{room.capacity}
                            </span>
                        </div>
                        <ul className="divide-y divide-steel-line">
                            {room.players.map((player, i) => (
                                <PlayerRow
                                    key={player.id}
                                    position={i + 1}
                                    player={player}
                                />
                            ))}
                            {Array.from({
                                length: room.capacity - room.players.length,
                            }).map((_, i) => (
                                <li
                                    key={`empty-${i}`}
                                    className="flex items-center gap-3 px-4 py-3 font-mono text-sm text-mist/50"
                                >
                                    <span className="w-6 text-xs">
                                        {String(
                                            room.players.length + i + 1,
                                        ).padStart(2, '0')}
                                    </span>
                                    aguardando jogador...
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {isWaiting && (
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <SecondaryButton
                            onClick={leave}
                            disabled={leaveForm.processing}
                        >
                            Sair da sala
                        </SecondaryButton>

                        {room.isHost && (
                            <div className="text-right">
                                <PrimaryButton
                                    onClick={draw}
                                    disabled={!canDraw || drawForm.processing}
                                >
                                    Sortear times
                                </PrimaryButton>
                                {!canDraw && (
                                    <p className="mt-2 font-mono text-xs text-mist">
                                        Precisa de {room.capacity}/
                                        {room.capacity} jogadores com perfil
                                        completo.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
