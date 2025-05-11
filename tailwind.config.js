// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        smoothBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        smoothBounce: "smoothBounce 2s ease-in-out infinite",
      },
    },
  },
};
