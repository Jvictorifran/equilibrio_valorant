import ApplicationLogo from '@/Components/ApplicationLogo';
import BalanceBeam from '@/Components/BalanceBeam';
import { Head, Link } from '@inertiajs/react';

const steps = [
    {
        n: '01',
        title: 'Crie a sala',
        body: 'Você vira o host e recebe um código de 6 caracteres pra mandar no Discord.',
    },
    {
        n: '02',
        title: 'Todo mundo entra',
        body: 'Cada jogador entra com o código e preenche elo, KD, win rate e HS%.',
    },
    {
        n: '03',
        title: 'Sorteie os times',
        body: 'Com 10/10 na sala, o host sorteia — e o algoritmo distribui pra ninguém levar vantagem.',
    },
];

export default function Welcome({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Sorteio Equilibrado" />
            <div className="min-h-screen bg-ink text-paper">
                <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="h-8 w-8" />
                        <span className="font-display text-lg font-bold uppercase tracking-wide">
                            Sorteio Equilibrado
                        </span>
                    </div>
                    <nav className="flex items-center gap-6 font-mono text-sm">
                        {canLogin && (
                            <Link
                                href={route('login')}
                                className="text-mist hover:text-paper"
                            >
                                Entrar
                            </Link>
                        )}
                        {canRegister && (
                            <Link
                                href={route('register')}
                                className="rounded border border-alpha px-3 py-1.5 text-alpha hover:bg-alpha hover:text-ink"
                            >
                                Criar conta
                            </Link>
                        )}
                    </nav>
                </header>

                <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
                    <section className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <p className="font-mono text-sm uppercase tracking-[0.3em] text-bravo">
                                Custom 5x5
                            </p>
                            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
                                Ninguém
                                <br />
                                fica no
                                <br />
                                time fraco.
                            </h1>
                            <p className="mt-6 max-w-md font-mono text-base text-mist">
                                Cria a sala, chama o pessoal, todo mundo
                                informa elo, KD, win rate e HS% — o sorteio
                                divide os 10 jogadores em dois times o mais
                                parelhos possível. Sem stack escondida,
                                sem time saco.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="rounded bg-alpha px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-ink hover:bg-alpha/90"
                                    >
                                        Criar minha sala
                                    </Link>
                                )}
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="rounded border border-steel-line px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper hover:border-mist"
                                    >
                                        Já tenho conta
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="rounded border border-steel-line bg-steel p-8">
                            <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-mist">
                                Time Alfa vs. Time Bravo
                            </p>
                            <div className="mt-6">
                                <BalanceBeam
                                    leftTotal={412}
                                    rightTotal={408}
                                    leftLabel="Alfa"
                                    rightLabel="Bravo"
                                    resolved={true}
                                />
                            </div>
                            <p className="mt-6 text-center font-mono text-xs text-mist">
                                Diferença de 4 pontos em 10 jogadores —
                                isso é equilíbrio.
                            </p>
                        </div>
                    </section>

                    <section className="mt-24">
                        <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
                            Como funciona
                        </h2>
                        <div className="mt-6 grid gap-6 sm:grid-cols-3">
                            {steps.map((step) => (
                                <div
                                    key={step.n}
                                    className="rounded border border-steel-line bg-steel p-6"
                                >
                                    <span className="font-mono text-sm text-bravo">
                                        {step.n}
                                    </span>
                                    <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-wide">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 font-mono text-sm text-mist">
                                        {step.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
