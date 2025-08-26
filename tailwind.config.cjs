// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mb: {
          ink: "#2B2723",
          ink2: "#463F38",
          parchment: "#F3EADF",
          sand: {
            200: "#EFE6DA",
            300: "#E6DCCF",
            400: "#DDD3C6",
          },
          wheat: {
            500: "#CDBFAE",
            600: "#AD9F8C",
          },
          champagne: "#C1A36B",
          midnight: "#0F1A24",
          racing: "#0E3B2E",
          bordeaux: "#5E2A2B",
          slate: "#2A2F36",
          ivory: "#F6F1E9",
        },
      },
    },
  },
  plugins: [],
}
