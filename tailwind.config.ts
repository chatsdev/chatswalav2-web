import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-global-sans)", "sans-serif"],
      rubik: ["var(--font-rubik)"],
      roboto: ["var(--font-roboto)"],
      fontAwesome: ["var(--font-awesome)"],
      montserrat: ["var(--font-global-sans)", "sans-serif"],
    },
    screens: {
      xl1800: { max: "1800px" },
      xl1700: { max: "1700px" },
      xl1660: { max: "1660px" },
      xl1600: { max: "1600px" },
      xl1580: { max: "1580px" },
      xl1500: { max: "1500px" },
      xl1470: { max: "1470px" },
      xl1400: { max: "1400px" },
      xl1366: { max: "1366px" },
      xl1299: { max: "1299px" },
      xl1280: { max: "1280px" },
      xl1200: { max: "1200px" },
      md810: { max: "810px" },
      md640: { max: "640px" },
      sm480: { max: "480px" },
      sm404: { max: "404px" },
      sm439: { max: "439px" },
      sm420: { max: "420px" },
      sm360: { max: "360px" },
      xxl: { max: "1399px" },
      xl: { max: "1199px" },
      lg: { max: "991px" },
      md: { max: "767px" },
      sm: { max: "575px" },
      // Optional: fixed range breakpoints (with min + max)
      "between1920-1200": { raw: "(max-width: 1920px) and (min-width: 1200px)" },
      "between1800-1400": { raw: "(max-width: 1800px) and (min-width: 1400px)" },
      "between1660-1200": { raw: "(max-width: 1660px) and (min-width: 1200px)" },
      "between1660-1400": { raw: "(max-width: 1660px) and (min-width: 1400px)" },
      "between1580-1200": { raw: "(max-width: 1580px) and (min-width: 1200px)" },
      "between1490-1400": { raw: "(max-width: 1490px) and (min-width: 1400px)" },
      "between1366-1200": { raw: "(max-width: 1366px) and (min-width: 1200px)" },
      "between1399-768": { raw: "(max-width: 1399px) and (min-width: 768px)" },
      "between1399-1200": { raw: "(max-width: 1399px) and (min-width: 1200px)" },
      "between1199-992": { raw: "(max-width: 1199px) and (min-width: 992px)" },
      "between991-768": { raw: "(max-width: 991px) and (min-width: 768px)" },
      only1400: { raw: "(min-width: 1400px)" },
      only1280: { raw: "(min-width: 1280px)" },
      only1200: { raw: "(min-width: 1200px)" },
      only992: { raw: "(min-width: 992px)" },
      only767: { raw: "(min-width: 767px)" },
      only641: { raw: "(min-width: 641px)" },
      only576: { raw: "(min-width: 576px)" },
      only320: { raw: "(min-width: 320px)" },
      ipad: { raw: "(width: 768px) and (height: 1024px)" },
    },
    fontSize: {
      '4xs': ['11px', {
        letterSpacing: '0.5px',
        lineHeight: '15px'
      }],

      '3xs': ['12px', {
        letterSpacing: '0.5px',
        lineHeight: '19.2px'
      }],

      '2xs': ['13px', {
        letterSpacing: '0.5px',
        lineHeight: '19.2px'
      }],

      xs: ['14px', {
        letterSpacing: '0.4px',
        lineHeight: '22.4px',
        wordSpacing: '0.8px'
      }],

      sm: ['16px', {
        letterSpacing: '0.5px',
        lineHeight: '20px'
      }],

      'sm-responsive': [
        'calc(14px + (16 - 14) * ((100vw - 320px) / (1920 - 320)))',
        {
          letterSpacing: '0.5px',
          lineHeight: '20px'
        }
      ],

      base: ['18px', {
        letterSpacing: '0.5px',
        lineHeight: '22px'
      }],

      lg: ['20px', {
        letterSpacing: '0.5px',
        lineHeight: '27px'
      }],

      xl: ['22px', {
        letterSpacing: '0.5px',
        lineHeight: '26px'
      }],

      '2xl': ['24px', {
        letterSpacing: '0.5px',
        lineHeight: '28px'
      }],

      '3xl': ['26px', '35px'],

      '3xl-responsive': [
        'calc(18px + (26 - 18) * ((100vw - 320px) / (1920 - 320)))',
        'calc(22px + (35 - 22) * ((100vw - 320px) / (1920 - 320)))'
      ],

      'fluid-xl': [
        'calc(16px + (50 - 16) * ((100vw - 320px) / (1920 - 320)))',
        {
          lineHeight: 'calc(22px + (59 - 22) * ((100vw - 320px) / (1920 - 320)))'
        }
      ],

      'xl3': 'calc(22px + (36 - 22) * ((100vw - 320px) / (1920 - 320)))',

      'landing-title':
        'calc(18px + (32 - 18) * ((100vw - 320px) / (1920 - 320)))',
    },

    extend: {
      colors: {
        primary: "var(--primary) ",
        secondary: "var(--text-light-secondary)",
        surface: "var(--light-secondary)",
        stealth: "var(--text-stealth-green)",
        'page-body-bg': 'var(--page-body-bg)',
        'card-color': 'var(--card-color)',
        test: "var(--test)",
        success: "var(--success)",
        danger: "var(--danger)",
        info: "var(--info)",
        light: "var(--light)",
        dark: "var(--dark)",
        warning: "var(--warning)",
        white: "var(--white)",
        black: "var(--black)",
        "light-primary": "var(--light-primary)",
        "card-border-color": "var(--card-border-color)",
        "dark-sidebar": "var(--dark-sidebar)",
        "table-hover": "var(--table-hover)",
        "light-border": "var(--light-border)",
        "input-color": "var(--input-color)",
        "dark-body": "var(--dark-body)",
        "light-background": "var(--light-background)",

        /* New Variables */
        "hover-card-color": "var(--hover-card-color)",
        "focus-bg-color": "var(--focus-bg-color)",
        "chat-user-bg": "var(--chat-user-bg)",
        "border-line-color": "var(--border-line-color)",
        "status-card": "var(--status-card)",
        "form-card-color": "var(--form-card-color)",
        "card-bg-color": "var(--card-bg-color)",
        "card-page-color": "var(--card-page-color)",
        "card-testimonial-color": "var(--card-testimonial-color)",
        "whatsapp-green": "var(--whatsapp-green)",
        "whatsapp-teal": "var(--whatsapp-teal)",
        "whatsapp-dark-teal": "var(--whatsapp-dark-teal)",
        "whatsapp-light": "var(--whatsapp-light)",
        "slate-900": "var(--slate-900)",
        "slate-500": "var(--slate-500)",
        "slate-450": "var(--slate-450)",
        "slate-400": "var(--slate-400)",
        "slate-350": "var(--slate-350)",
        "indigo-500": "var(--indigo-500)",
        "color-slate-800": "var(--color-slate-800)",
        "violet-500": "var(--violet-500)",
        "dark-gray": "var(--dark-gray)",
        "success-green": "var(--success-green)",
        "warning-amber": "var(--warning-amber)",
        "emerald-500": "var(--emerald-500)",
        "slate-200": "var(--slate-200)",
        "blue-500": "var(--blue-500)",
        "dark-accent": "var(--dark-accent)",
        "primary-dark": "var(--primary-dark)",
        "emerald-400": "var(--emerald-400)",
        "primary-darker": "var(--primary-darker)",
        "feature-card-border": "var(--feature-card-border)",
        "features-bg-start": "var(--features-bg-start)",
        "primary-hover": "var(--primary-hover)",
        "pink-500": "var(--pink-500)",
        "google-green": "var(--google-green)",
        "google-blue": "var(--google-blue)",
        "landing-theme-dark": "var(--landing-theme-dark)",
        "landing-card-dark": "var(--landing-card-dark)",
        "landing-body-dark": "var(--landing-body-dark)",
        "landing-accent-dark": "var(--landing-accent-dark)",
        "landing-success": "var(--landing-success)",
        "landing-warning": "var(--landing-warning)",
        "orange-500": "var(--orange-500)",
        "white-opacity-15": "var(--white-opacity-15)",
        "white-opacity-10": "var(--white-opacity-10)",
        "soft-white": "var(--soft-white)",
        "dark-bg": "var(--dark-bg)",
        "secondary-bg": "var(--secondary-bg)",
        "primary-opacity-30": "var(--primary-opacity-30)",
        "black-opacity-50": "var(--black-opacity-50)",
        "primary-opacity-20": "var(--primary-opacity-20)",
        "black-opacity-80": "var(--black-opacity-80)",
        "google-yellow": "var(--google-yellow)",
        "google-red": "var(--google-red)",
        "chatbot-bg": "var(--chatbot-bg)",
        "chatbot-text": "var(--chatbot-text)",
        "widget-fallback-1": "var(--widget-fallback-1)",
        "widget-fallback-2": "var(--widget-fallback-2)",
        "widget-fallback-3": "var(--widget-fallback-3)",
        "widget-fallback-4": "var(--widget-fallback-4)",
        "widget-fallback-5": "var(--widget-fallback-5)",
        "widget-fallback-6": "var(--widget-fallback-6)",
        "widget-fallback-7": "var(--widget-fallback-7)",
        "slate-700": "var(--slate-700)",
        "instagram": "var(--instagram)",
      },
    }
  },
  plugins: [],
};

export default config;

