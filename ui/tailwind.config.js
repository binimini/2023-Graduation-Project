module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx,vue,html}"],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          accent: "#00adb5",
          warning: "#B73E3E",
          neutral: "#1b2128",
          code: "#1E1E1E",
          "base-100": "#222831",
          "base-200": "#29303b",
          "base-300": "#4d5663",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
