import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import RankBadge from '@/Components/RankBadge';
import TextInput from '@/Components/TextInput';
import { RANK_LABELS, RANK_TIERS } from '@/ranks';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

const selectClass =
    'mt-1 block w-full rounded border border-steel-line bg-ink font-mono text-sm text-paper focus:border-alpha focus:ring-alpha';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            rank_tier: user.rank_tier ?? '',
            kd: user.kd ?? '',
            win_rate: user.win_rate ?? '',
            hs_percentage: user.hs_percentage ?? '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                    Seu perfil
                </h2>

                <p className="mt-1 font-mono text-sm text-mist">
                    Elo, KD, win rate e HS% entram no cálculo que equilibra
                    os times na hora do sorteio.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nome" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="rank_tier" value="Elo" />

                    <select
                        id="rank_tier"
                        className={selectClass}
                        value={data.rank_tier}
                        onChange={(e) =>
                            setData('rank_tier', e.target.value)
                        }
                        required
                    >
                        <option value="" disabled>
                            Selecione
                        </option>
                        {RANK_TIERS.map((tier) => (
                            <option key={tier} value={tier}>
                                {RANK_LABELS[tier]}
                            </option>
                        ))}
                    </select>

                    <InputError
                        className="mt-2"
                        message={errors.rank_tier}
                    />
                </div>

                {data.rank_tier && <RankBadge tier={data.rank_tier} />}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="kd" value="KD" />

                        <TextInput
                            id="kd"
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.kd}
                            onChange={(e) =>
                                setData('kd', e.target.value)
                            }
                            required
                        />

                        <InputError className="mt-2" message={errors.kd} />
                    </div>

                    <div>
                        <InputLabel htmlFor="win_rate" value="Win rate (%)" />

                        <TextInput
                            id="win_rate"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="mt-1 block w-full"
                            value={data.win_rate}
                            onChange={(e) =>
                                setData('win_rate', e.target.value)
                            }
                            required
                        />

                        <InputError
                            className="mt-2"
                            message={errors.win_rate}
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="hs_percentage" value="HS %" />

                    <TextInput
                        id="hs_percentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        className="mt-1 block w-full"
                        value={data.hs_percentage}
                        onChange={(e) =>
                            setData('hs_percentage', e.target.value)
                        }
                        required
                    />

                    <InputError
                        className="mt-2"
                        message={errors.hs_percentage}
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 font-mono text-sm text-paper">
                            Seu e-mail ainda não foi confirmado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ms-1 rounded text-alpha underline decoration-alpha/40 underline-offset-4 hover:text-paper focus:outline-none focus:ring-2 focus:ring-alpha"
                            >
                                Reenviar e-mail de confirmação.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-mono text-sm text-alpha">
                                Um novo link de confirmação foi enviado.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        Salvar
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="font-mono text-sm text-mist">
                            Salvo.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
