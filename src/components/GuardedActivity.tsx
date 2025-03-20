import { JSX, JSXElement, Show, createSignal, splitProps } from "solid-js";
import { Button, ButtonProps } from "./Button";
import { IoCheckmarkDone } from "./icons";
import { longRunningBusyIndicator } from "./LongRunningBusyIndicator";
import { fetchErrorModalDispatch } from "./modal/ModalDialog";
import { overlayDispatch } from "./modal/Overlay";
import { Tag } from "./Tag";

interface GuardedActivityProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
    class?: string
    children: JSXElement | JSXElement[]
    worker: () => Promise<any>;
    title?: string;
    confirmationNeeded?: boolean;
    iconFn?: () => JSXElement;
}

export const GuardedActivity = (props: GuardedActivityProps & Pick<ButtonProps, "variant" | "arrow" | "tooltip" | "disabled">) => {
    const [buttonProperties, _] = splitProps(props, ["class", "arrow", "tooltip", "disabled", "variant"])
    const { Component: SpinnerComponent, onStart, onStop } = longRunningBusyIndicator({ timeOut: 600 });
    const [confirmState, setConfirmState] = createSignal({ confirmed: false, showConfirm: false });

    function handleClick(event: MouseEvent) {
        if (props.confirmationNeeded && !confirmState().confirmed) {
            if (!confirmState().showConfirm) {
                setConfirmState({ confirmed: false, showConfirm: true });
                setTimeout(() => {
                    setConfirmState(prev => ({ ...prev, confirmed: true }));
                }, 500);
            } else {
                if (confirmState().confirmed) {
                    onClick()
                }
            }
        } else {
            onClick()
        }
    }

    const onClick = () => {
        const overlayDispose = overlayDispatch()
        onStart();
        props
            .worker()
            .then((data) => {
                overlayDispose();
                onStop();
                return data;
            })
            .catch((e) => {
                console.error(e)
                onStop();
                overlayDispose();
                fetchErrorModalDispatch(e);
            });
    };
    return (
        <Button {...buttonProperties} onBlur={() => { setConfirmState({ confirmed: false, showConfirm: false }) }}
            onClick={handleClick}
        >
            <SpinnerComponent>
                {props.children}
                <Show when={props.confirmationNeeded && confirmState().showConfirm}>
                    <div class="ml-2"><Tag localizeTooltip={true} tooltip='This critical operation needs to be confirmed by a second click' color='warning' iconFn={() => <IoCheckmarkDone />}>2x</Tag></div>
                </Show>

            </SpinnerComponent>
        </Button>
    );
};