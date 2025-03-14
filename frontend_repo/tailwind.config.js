/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        banner: `url('../public/images/banner.jpg')`, // 배너 이미지 추가
      },
      colors: {
        "custom-bg": "#faf9f0", // 사용자 정의 배경 색상 추가
      },
    },
  },
  plugins: [],
};
