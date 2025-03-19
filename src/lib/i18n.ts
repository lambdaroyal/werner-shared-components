/**
 * contains function to translate labels and to persist the language setting of the user
 */

import { Accessor, Setter, Signal, createMemo, createSignal } from "solid-js";
import { executeAsync } from "./utils";

export type Lang = "de" | "en" | "ru" | "fr" | "pl" | "it";

// Define a type for your CSV data if you know the structure
export type Translation = {
    key: string
    domain?: string
    en?: string
    de?: string
    fr?: string
    it?: string
    pl?: string
    ru?: string
};
export type Parser = (input: string) => Promise<{ [key: string]: string }>;

async function parseTranslationCsv(lang: "de" | "en" | "ru" | "fr" | "pl" | "it" | undefined = "de", parser: Parser) {

    return fetch('/csv/i18n.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Read the CSV file as text
        })
        .then(csvFile => parser(csvFile))
}

export type TranslatedTerm = {
    [key in Lang]: string;
};
export type TranslatedTerms = { [key: string]: TranslatedTerm }

export class I18n {
    private static singleton: I18n
    private lang: Lang
    private translations: TranslatedTerms
    // undefined ... not yet loaded
    // null ... not in translation set
    private constructor(lang: Lang, translations: TranslatedTerms) {
        this.lang = lang;
        this.translations = translations;
    }


    getLanguage() {
        return this.lang;
    }

    setLanguage(lang: Lang) {
        this.lang = lang;
        localStorage.setItem("lang", lang);
    }

    static init(lang: Lang, translations: TranslatedTerms) {
        if (this.singleton) {
            throw new Error("I18n already initialized");
        }
        this.singleton = new I18n(lang, translations);
    }

    /**
     * returns the one and only
     */
    static get(): I18n {
        if (!this.singleton) {
            throw new Error("I18n not initialized");
        }
        return this.singleton;
    }

    static localize(key: string, domain?: string): string {
        if (!this.singleton) {
            return key;
        }
        return I18n.get().localize(key, domain);
    }

    static reactiveLocalize(key: string, domain?: string): Accessor<string> {
        const translation = I18n.get().localize(key, domain);
        return () => translation;
    }

    readLangFromLocalStorage() {
        const current = localStorage.getItem("lang") as Lang || "de";
        if (current != this.getLanguage()) {
            this.setLanguage(current)
        }
    }

    /**
     * creates a new memo
     * @param key 
     * @param domain 
     * @returns 
     */
    localize(key: string, domain?: string): string {
        const instance = I18n.get();
        const cache = instance.translations;
        const translatedTerm = (domain && cache[`${domain}/${key}`]) || cache[`${key}`];
        return translatedTerm?.[instance.lang] || key;

    }
}