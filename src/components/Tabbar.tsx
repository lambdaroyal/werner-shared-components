
import { createSignal, For, JSXElement, Show } from "solid-js"
import { I18nTag } from "./I18nTag";
import clsx from "clsx";

export type TabbarProps = {
    tabs: { name: string, localize?: boolean, icon?: (props?: { [key: string]: any }) => JSXElement, children: JSXElement | JSXElement[] }[],
    /**
     * denotes the current component that is active
     */
    currentIndex?: number
}

export default function Tabbar(props: TabbarProps) {
    const [currentIndex, setCurrentIndex] = createSignal<number>(props.currentIndex !== undefined && props.currentIndex >= 0 && props.currentIndex < props.tabs.length ? props.currentIndex : 0);
    return (
        <Show when={props.tabs.length}>
            <div>
                <div class="sm:hidden">
                    <label for="tabs" class="sr-only">
                        <I18nTag>Select a tab</I18nTag>
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        id="tabs"
                        name="tabs"
                        value={props.tabs[currentIndex()].name}
                        class="block w-full rounded-md border-base-200 focus:border-primary focus:ring-primary"
                    >
                        <For each={props.tabs}>
                            {tab => (
                                <option><Show fallback={tab.name} when={tab.localize}><I18nTag>{tab.name}</I18nTag></Show></option>
                            )}
                        </For>
                    </select>
                </div>
                <div class="hidden sm:block">
                    <div class="border-b border-gray-200">
                        <nav aria-label="Tabs" class="-mb-px flex space-x-8">
                            <For each={props.tabs}>
                                {(tab, index) => (
                                    <a
                                        aria-current={index() == currentIndex() ? 'page' : undefined}
                                        class={clsx(
                                            index() == currentIndex()
                                                ? 'border-primary text-primary-content'
                                                : 'border-transparent text-base-content hover:border-base-300 hover:opacity-70',
                                            'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
                                        )}
                                    >
                                        <Show when={tab.icon}>
                                            {tab.icon!({ "aria-hidden": true, class: clsx(index() == currentIndex() ? "text-primary-content" : "text-base-content opacity-70 group-hover:opactity-50", '-ml-0.5 mr-2 h-5 w-5') })}
                                        </Show>
                                        <span><Show fallback={tab.name} when={tab.localize}><I18nTag>{tab.name}</I18nTag></Show></span>
                                    </a>
                                )}
                            </For>
                        </nav>
                    </div>
                </div>
            </div>
        </Show>
    )
}
