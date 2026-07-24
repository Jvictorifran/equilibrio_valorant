import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                ink: '#0B0F14',
                steel: {
                    DEFAULT: '#141B22',
                    line: '#232E38',
                },
                paper: '#E7EDF2',
                mist: '#7D8A96',
                alpha: {
                    DEFAULT: '#34E6C7',
                    dim: '#1C5A50',
                },
                bravo: {
                    DEFAULT: '#FF8A4C',
                    dim: '#6B3A1E',
                },
                signal: '#FF5C5C',
            },
            fontFamily: {
                sans: ['"IBM Plex Sans"', ...defaultTheme.fontFamily.sans],
                display: ['"Big Shoulders Display"', ...defaultTheme.fontFamily.sans],
                mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
            },
        },
    },

    plugins: [forms],
};
