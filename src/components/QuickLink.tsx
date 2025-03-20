import clsx from "clsx";
import { JSXElement, Show } from "solid-js";
import { I18nTag } from "./I18nTag";

export interface QuickLinkProps {
    icon?: JSXElement;
    title: string;
    titleLocalizationDomain?: string;
    localizeTitle?: boolean
    description?: string;
    descriptionLocalizationDomain?: string;
    localizeDescription?: boolean;
    children?: JSXElement | JSXElement[]
    onClick: () => void;
    hidden?: boolean | (() => boolean)
    iconClass?: string
}

export function QuickLink(props: QuickLinkProps) {
    const visible = !props.hidden || (typeof props.hidden === "function" ? !props.hidden() : true);
    return <Show when={visible}>
        <div class="group relative space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-2xs hover:border-gray-400"
            onClick={props.onClick}
        >
            <Show when={props.icon}>
                <div>
                    <span class={clsx("inline-flex rounded-lg p-3 ring-4 ring-white", props.iconClass)}>
                        {props.icon}
                    </span>
                </div>
            </Show>
            <div class="mt-8">
                <h3 class="text-base font-semibold text-gray-900">
                    <a href="#" class="focus:outline-hidden">
                        <span class="absolute inset-0" aria-hidden="true"></span>
                        <Show when={props.localizeTitle} fallback={props.title}>
                            <I18nTag domain={props.titleLocalizationDomain}>{props.title}</I18nTag>
                        </Show>
                    </a>
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                    <Show when={props.localizeDescription} fallback={props.description}>
                        <I18nTag domain={props.descriptionLocalizationDomain}>{props.description}</I18nTag>
                    </Show>
                </p>
                <p class="empty:hidden">
                    {props.children}
                </p>
            </div>
            <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                <svg class="size-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
            </span>
        </div>
    </Show>

}
