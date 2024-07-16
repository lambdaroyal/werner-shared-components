import { Show, JSX, splitProps, onMount, onCleanup } from "solid-js";
import { disableScrolling, enableScrolling } from "./LockBodyScroll";
import { render } from "solid-js/web";
import { remove } from "./../../lib/utils";
import { SSRHelper } from "../../lib/ssrHelper";

interface OverLayProps extends JSX.InputHTMLAttributes<HTMLSpanElement> {
    visible: boolean;
    disableScrolling?: boolean;
}

export const OverLay = (props: OverLayProps) => {
    const [p, customProps] = splitProps(props, ["visible"]);

    onMount(() => {
        if (props.disableScrolling) disableScrolling();
    })

    onCleanup(() => {
        if (props.disableScrolling) enableScrolling();
    })

    return <Show when={p.visible}>
        <span style={{ "z-index": 10, width: "100vw", height: "100vh" }} classList={{ "fixed inset-0 w-full h-full bg-black/[.1]": p.visible }} {...customProps} />
    </Show>;
};

/**
 * a modal overlay is used to prevent any clicks to the ui from the user while async actions are pending in order to prevent inconsistent UI states
 * calling overlayDispatch will return a function that - once called - disposes the overlay
 */
export const overlayDispatch = (disableScrolling: boolean = false): () => void => {
    const div = SSRHelper.getSingleton()?.window?.document.createElement("div");
    div.classList.add("tailwind");
    SSRHelper.getSingleton()?.window?.document.body.appendChild(div);
    const dispose = render(() => <OverLay visible={true} disableScrolling={disableScrolling} />, div);
    return () => {
        dispose();
        remove(div);
    };
};