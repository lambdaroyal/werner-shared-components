import { Show, createMemo } from "solid-js";
import { I18n } from "../lib/i18n";
import clsx from "clsx";

export function I18nTag(props: { key?: string, domain?: string, children?: string, class?: string }) {
    const memo = createMemo(() => I18n.localize(props.key || props.children || "", props.domain))
    return <Show when={memo()}><span class={clsx(props.class)}>{memo()}</span></Show>
}
