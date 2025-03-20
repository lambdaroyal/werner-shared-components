import { JSXElement, Show } from "solid-js";
import "./FormLayout.css";
import clsx from "clsx";

export function FormLayout({ children, className }: { children: JSXElement | JSXElement[], className?: string }) {
    return <div class={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
        <div class="mx-auto max-w-3xl">
            {children}
        </div>
    </div>
}


export function FormVerticalSection({ children, className }: { children: JSXElement | JSXElement[], className?: string }) {
    return <div class={clsx("form-vertical-section", className)}>
        {children}
    </div>
}

export function FormButtonBar({ children }: { children: JSXElement | JSXElement[] }) {
    return <div class="form-button-bar">
        {children}
    </div>
}

export function FormHeader({ icon, title, key }: { icon?: JSXElement, title: string, key?: string }) {
    return <div class="form-header">
        <Show when={icon}>
            {icon}
        </Show>
        <div class="w-full">{title}</div>
        <Show when={key}>
            <span class="text-gray-500 hidden md:block">{key}</span>
        </Show>
    </div>
}
