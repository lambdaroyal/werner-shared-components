import { Motion } from "@motionone/solid";
import { OcCopy3 } from "./icons";
import { I18n } from "../lib/i18n";
import { Show, createSignal } from "solid-js";

export function CopyHandle(props: { copyFn: () => string }) {
    const label = I18n.reactiveLocalize("click to copy")
    const copied = I18n.reactiveLocalize("copied")
    const clicked = createSignal<boolean>(false);
    return <a onclick={() => {
        const content = props.copyFn!();
        navigator.clipboard.writeText(content);
        clicked[1](true);
        setTimeout(() => {
            clicked[1](false);
        }, 2000);
    }} class="copy-handle" data-toogle="tooltip" data-placement="top" title={label()}>
        <div class="flex items-center">
            <OcCopy3 />
            <Show when={clicked[0]()}>
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    exit={{ opacity: 1 }}>
                    <div class="tooltip tooltip-open tooltip-right tooltip-info" data-tip={copied()}>

                    </div>

                </Motion.div>
            </Show>
        </div>
    </a>

}