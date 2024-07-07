/**
 * contains function to translate labels and to persist the language setting of the user
 */
import Papa from 'papaparse';
import { createMemo, createSignal } from "solid-js";
import { executeAsync } from "./utils";
function parseTranslationCsv(lang = "de") {
    return new Promise(function (resolve, _reject) {
        fetch('/csv/i18n.csv')
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Read the CSV file as text
        })
            .then(csvFile => {
            // Parse the CSV data
            Papa.parse(csvFile, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    const lifted = results.data.reduce((acc, x) => {
                        const value = x[lang || "de"];
                        if (value) {
                            if (x.domain) {
                                const key = `${x.domain}/${x.key}`;
                                acc[key] = value;
                            }
                            else {
                                acc[x.key] = value;
                            }
                        }
                        return acc;
                    }, {});
                    console.log(`Parsed Results: count ${Object.keys(lifted).length}`);
                    resolve(lifted);
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                }
            });
        });
    });
}
export class I18n {
    static singleton;
    lang;
    setLang;
    i18n;
    // undefined ... not yet loaded
    // null ... not in translation set
    constructor() {
        [this.lang, this.setLang] = createSignal();
        this.i18n = createSignal();
    }
    /**
     * returns the one and only
     */
    static get() {
        if (!this.singleton) {
            this.singleton = new I18n();
        }
        return this.singleton;
    }
    static localize(key, domain) {
        return I18n.get().localize(key, domain);
    }
    static reactiveLocalize(key, domain) {
        return createMemo(() => I18n.get().localize(key, domain));
    }
    readLangFromLocalStorage() {
        const current = localStorage.getItem("lang") || "de";
        if (current != this.lang()) {
            this.setLang(current);
        }
    }
    init() {
        executeAsync(`[I18n] lang ${this.lang()}`, () => {
            return parseTranslationCsv(this.lang())
                .then((xs) => {
                const res = new Map();
                Object.keys(xs).map(key => {
                    res.set(key, xs[key]);
                });
                return res;
            })
                .then(xs => {
                this.i18n[1](xs);
            })
                .then(() => [this.i18n[0](), `${this.i18n[0]()?.size} translations`]);
        });
    }
    /**
     * creates a new memo
     * @param key
     * @param domain
     * @returns
     */
    localize(key, domain) {
        const instance = I18n.get();
        const cache = instance.i18n[0]();
        const result = (domain && cache?.get(`${domain}/${key}`)) || cache?.get(`${key}`) || key;
        // console.log(`[i18n.localize] key ${key} domain ${domain} result ${result}`)
        return result;
    }
}
