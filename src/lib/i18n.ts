/**
 * contains function to translate labels and to persist the language setting of the user
 */

import { Accessor, Setter, Signal, createMemo, createSignal } from "solid-js";
import { executeAsync } from "./utils";

type Lang = "de" | "en" | "ru" | "fr" | "pl" | "it";

// Define a type for your CSV data if you know the structure
type Translation = {
    key: string
    domain?: string
    en?: string
    de?: string
    fr?: string
    it?: string
    pl?: string
    ru?: string
};

async function parseTranslationCsv(lang: "de" | "en" | "ru" | "fr" | "pl" | "it" | undefined = "de") {
    const Papa = await import('papaparse');

    return new Promise<{ [key: string]: string }>(function (resolve, _reject) {
        fetch('/csv/i18n.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text(); // Read the CSV file as text
            })
            .then(csvFile => {
                // Parse the CSV data
                Papa.parse<Translation>(csvFile, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        const lifted = results.data.reduce((acc, x) => {
                            const value = x[lang || "de"];
                            if (value) {
                                if (x.domain) {
                                    const key = `${x.domain}/${x.key}`;
                                    acc[key] = value;
                                } else {
                                    acc[x.key] = value;
                                }
                            }
                            return acc;
                        }, {} as { [key: string]: string });
                        console.log(`Parsed Results: count ${Object.keys(lifted).length}`);
                        resolve(lifted);
                    },
                    error: (error: Error) => {
                        console.error('Error parsing CSV:', error);
                    }
                });

            })


    })
}


export class I18n {
    private static singleton: I18n
    private lang: Accessor<Lang | undefined>
    private setLang: Setter<Lang | undefined>
    i18n: Signal<Map<string, string> | undefined>
    // undefined ... not yet loaded
    // null ... not in translation set
    private constructor() {
        [this.lang, this.setLang] = createSignal();
        this.i18n = createSignal();

    }

    /**
     * returns the one and only
     */
    static get(): I18n {
        if (!this.singleton) {
            this.singleton = new I18n();
        }
        return this.singleton;
    }

    static localize(key: string, domain?: string): string {
        return I18n.get().localize(key, domain);
    }

    static reactiveLocalize(key: string, domain?: string): Accessor<string> {
        return createMemo(() => I18n.get().localize(key, domain))
    }

    readLangFromLocalStorage() {
        const current = localStorage.getItem("lang") as Lang || "de";
        if (current != this.lang()) {
            this.setLang(current)
        }
    }



    init() {
        executeAsync<Map<string, string>>(`[I18n] lang ${this.lang()}`, () => {
            return parseTranslationCsv(this.lang())
                .then((xs: { [key: string]: string }) => {
                    const res = new Map<string, string>();
                    Object.keys(xs).map(key => {
                        res.set(key, xs[key]);
                    });
                    return res;
                })
                .then(xs => {
                    this.i18n[1](xs);
                })
                .then(() => [this.i18n[0]()!, `${this.i18n[0]()?.size} translations`])
        })

    }

    /**
     * creates a new memo
     * @param key 
     * @param domain 
     * @returns 
     */
    localize(key: string, domain?: string): string {
        const instance = I18n.get();
        const cache = instance.i18n[0]();
        const result = (domain && cache?.get(`${domain}/${key}`)) || cache?.get(`${key}`) || key
        // console.log(`[i18n.localize] key ${key} domain ${domain} result ${result}`)
        return result;

    }
}