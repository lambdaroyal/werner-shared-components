/////////////////////////////////////////////////////
// use this for decorating buttons that invoke
// probably long running tasks. Use
// let foo = new LongRunnningBusinessIndicator();
// use foo.onStart and foo.onStop as callbacks
// for IPC calls. Refer to SnapinComponents::
// SnapinReserveStockOrder for an example
/////////////////////////////////////////////////////

import { Accessor, JSXElement, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

// https://solid-icons.vercel.app/search/refresh
export const longRunningBusyIndicator = function ({ timeOut = 500, message }: { timeOut: number, message?: Accessor<string | undefined> }) {
    const [_space, setSpace] = createSignal("0px")
    const [state, setState] = createStore({ running: false, busyIndicating: false });
    let timeout = 0;
    return {
        state,
        onStart: function () {
            setState({ running: true });
            timeout = window.setTimeout(() => {
                if (state.running) {
                    setTimeout(() => setState({ busyIndicating: true }), 1000)
                    setSpace("20px");
                }
            }, timeOut);
        },
        onStop: function () {
            setState({ running: false, busyIndicating: false });
            setSpace("0px")
            clearTimeout(timeout);
        },
        Component: function ({ children }: { children?: JSXElement | JSXElement[] }) {
            return <div class="flex relative items-center">
                <Show when={state.running && state.busyIndicating}>
                    <div class="absolute flex centered gap-x-4">
                        <span class="loading loading-ring loading-sm"></span>


                        {message && message() ? <span>{message()}</span> : undefined}
                    </div>
                </Show>
                {children}
            </div>;
        }
    };
};

