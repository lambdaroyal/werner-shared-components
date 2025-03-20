import { FiBarChart } from "./icons";
import { JSXElement, Show } from "solid-js";

export function QuickLinkStat({ main, sub }: { main?: JSXElement, sub?: JSXElement }) {
    return <div class="quick-link-stat mt-2">
        <div class="flex items-center gap-2"><div class="w-4"><FiBarChart /></div><div class="quick-link-stat-value">{main}</div></div>
        <div class="flex items-center gap-2"><div class="w-4">&nbsp;</div><Show when={sub}><div class="quick-link-stat-sub detail-text">{sub}</div></Show></div>
    </div>
}
