import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: "DataRush",
    tagline: "Изучите основы анализа данных здесь!",
    favicon: "https://datarush.itqdev.xyz/dr.svg",

    url: "https://datarush.itqdev.xyz",
    baseUrl: "/docs/",

    organizationName: "megazord",
    projectName: "megazord",

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    i18n: {
        defaultLocale: "ru",
        locales: ["ru"],
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    routeBasePath: "/",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: "https://datarush.itqdev.xyz/dr.svg",
        navbar: {
            title: "DataRush",
            logo: {
                alt: "DataRush",
                src: "https://datarush.itqdev.xyz/dr.svg",
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "defaultSidebar",
                    position: "left",
                    label: "Документация",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Документация",
                    items: [
                        {
                            label: "Начало",
                            to: "/intro",
                        },
                    ],
                },
            ],
            copyright: `Создано для Megazord ♥`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,

    staticDirectories: ["static"],
};

export default config;
