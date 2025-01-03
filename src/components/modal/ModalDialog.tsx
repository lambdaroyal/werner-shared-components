import { JSXElement, Match, Show, Switch } from "solid-js";
import { render } from "solid-js/web";
import { remove } from "../../lib/utils";
import { I18nTag } from "../I18nTag";
import { BiRegularCheckCircle, BiRegularInfoCircle, RiSystemErrorWarningLine } from "../icons";
import { OverLay } from "./Overlay";

export interface TailwindModalProps {
    title: string;
    localizeTitle?: boolean;
    description: () => JSXElement;
    onSubmit?: () => void;
    onCancel?: () => void;
    children?: JSXElement | JSXElement;
    submitButtonLabel?: string;
    // modal dialog is visible
    open?: boolean;
    // set this to true for pure error confirmation dialogs that should throw on cancel button click
    hideSubmitButton?: boolean;
    hideCancelButton?: boolean;
    severity: "info" | "warning" | "error" | "success";
    noOverlay?: boolean;
}

// https://tailwindui.com/components/application-ui/overlays/modals#component-e6087a40f754bcbc9443a805d7376218

export const TailwindModal = (props: TailwindModalProps) => {

    return (
        <Show when={props.open === true || props.open === undefined}>
            <OverLay visible={!props.noOverlay} />
            <div class="z-50 fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
                aria-modal="true">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                    {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <div
                        class="overflow-visible	relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                        <div class="sm:flex sm:items-start">
                            <Switch>
                                <Match when={props.severity === "info"}>
                                    <div
                                        class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-info text-info-content sm:mx-0 sm:h-10 sm:w-10">
                                        <BiRegularInfoCircle />
                                    </div>
                                </Match>
                                <Match when={props.severity === "success"}>
                                    <div
                                        class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-success bg-success-content text-success-content sm:mx-0 sm:h-10 sm:w-10">
                                        <BiRegularCheckCircle />
                                    </div>
                                </Match>
                                <Match when={props.severity === "warning"}>
                                    <div
                                        class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-warning text-warning-content sm:mx-0 sm:h-10 sm:w-10">
                                        <RiSystemErrorWarningLine />
                                    </div>
                                </Match>
                                <Match when={props.severity === "error"}>
                                    <div
                                        class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error text-error-content sm:mx-0 sm:h-10 sm:w-10">
                                        <RiSystemErrorWarningLine />
                                    </div>
                                </Match>
                            </Switch>

                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium" id="modal-title">
                                    <Show when={props.localizeTitle} fallback={props.title}><I18nTag>{props.title}</I18nTag></Show>
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm">{props.description?.()}</p>
                                </div>
                            </div>
                        </div>
                        {props.children}
                        <div class="mt-5 sm:mt-4 flex gap-2 justify-end">
                            <Show when={props.onSubmit && !!props.submitButtonLabel && !props.hideSubmitButton}>
                                <button
                                    class={`btn btn-primary`}
                                    onClick={props.onSubmit}>
                                    {props.submitButtonLabel}
                                </button>
                            </Show>
                            <Show when={props.onCancel && !props.hideCancelButton}>
                                <button
                                    onclick={props.onCancel}
                                    class="btn btn-secondary">
                                    <I18nTag key="cancel" />
                                </button>
                            </Show>
                        </div>
                    </div>
                </div>
            </div>

        </Show>
    );
};

interface ModalDispatchProps extends Omit<TailwindModalProps, "submitButtonLabel"> {
    contribute: () => any;
    submitButtonLabel?: string;
}

export const modalDispatch = (modalProps: ModalDispatchProps) => {
    return new Promise((resolve, reject) => {
        const div = document.createElement("div");
        div.classList.add("tailwind");
        document.getElementById("werner-layout")?.appendChild(div)
        const { submitButtonLabel, contribute, onCancel, ...customProps } = modalProps;
        const dispose = render(() => <TailwindModal
            submitButtonLabel={submitButtonLabel || "OK"}
            onSubmit={() => {
                // we need to call dispose explicitly because its given by render() function and not available to the modal
                dispose();
                remove(div);
                resolve(contribute());
            }
            }
            onCancel={() => {
                dispose();
                remove(div);
                if (onCancel) {
                    onCancel();
                } else {
                    reject("canceled by the user");
                }
            }}
            {...customProps}
        />, div);
    });
};

export function fetchErrorModalDispatch(e: any, extra?: Partial<ModalDispatchProps>) {
    return modalDispatch({
        // this is a mess
        description: () => <I18nTag>{e.msg || e.message || e.statusText || e.statusMessage || "unknown error"}</I18nTag>,
        severity: "error",
        title: "Error",
        contribute: () => {
        },
        ...(extra || {})
        // children: ()=>{return <>{appState.i18nFallback(e.message || e.statusText)}</>}
    });
}