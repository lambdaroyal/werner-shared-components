// refer to https://tailwindui.com/components/application-ui/lists/grid-lists

import clsx from "clsx";

import { For, useContext } from "solid-js";
import { QuickLink, QuickLinkProps } from "./QuickLink";

export const iconClassList = ["bg-teal-50 text-teal-700", "bg-purple-50 text-purple-700", "bg-sky-50 text-sky-700", "bg-yellow-50 text-yellow-700", "bg-rose-50 text-rose-700", "bg-indigo-50 text-indigo-700"]


export function QuickLinkList({ className, items }: { className?: string, items: QuickLinkProps[] }) {
    return <div class={clsx("overflow-hidden grid sm:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-4", className)}>
        <For each={items}>
            {(item, index) => <QuickLink {...item} iconClass={iconClassList[index() % iconClassList.length]} />}
        </For>
    </div>
}
