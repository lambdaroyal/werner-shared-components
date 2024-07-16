export class SSRHelper {
    private static singleton: SSRHelper;
    window: any;
    navigator: any;
    private constructor(window: any, navigator: any) {
        this.window = window;
        this.navigator = navigator;
    }

    static init(window: any, navigator: any) {
        if (!this.singleton) {
            this.singleton = new SSRHelper(window, navigator);
        }
    }

    static getSingleton() {
        if (this.singleton) {
            return this.singleton;
        } else {
            throw new Error("init SSRHelper first");
        }

    }
}