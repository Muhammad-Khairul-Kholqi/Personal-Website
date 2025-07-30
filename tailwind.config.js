module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sora: ['var(--font-sora)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};