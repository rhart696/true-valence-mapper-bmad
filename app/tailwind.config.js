/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ProActive Brand Colors (Placeholders until confirmed)
                proactive: {
                    blue: "#005696", // Standard corporate blue
                    green: "#78BE20", // Standard corporate green
                    dark: "#1A1A1A",
                    light: "#F5F5F5",
                }
            }
        },
    },
    plugins: [],
}
