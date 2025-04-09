/**
 * This component implements a singleton pattern and resides on a static/fixed position. The state of the instance consists of a store. The store is a sequence
 * of Notification, each Notification can be updated, dismissed, undone and is identified by a unique id
 */

import { Accessor, createSignal, For, JSXElement, Match, onMount, Setter, Show, Switch } from "solid-js"
import { Dynamic } from "solid-js/web"
import { AiOutlineUndo, BiRegularError, IoCheckmarkDone } from "./icons"
import { makeId } from "../lib/utils"
import { I18n } from "../lib/i18n"
import { TailwindModal } from "./modal/ModalDialog"
import { DescriptionList, DescriptionProps } from "./DescriptionList"
import { I18nTag } from "./I18nTag"

export enum NotificationState {
    QUEUED = 1,
    PROGRESS,
    DONE,
    UNDONE,
    FAILED
}

export interface Notification {
    caption: string
    localizeCaption?: boolean
    description?: string
    localizeDescription?: boolean
    timeout?: number
    dismiss?: boolean
    children?: JSXElement | JSXElement[]
    undo?: () => Promise<NotificationState>
    do: () => Promise<NotificationState>
}

interface QueuedNotification extends Notification {
    id: string
    state: NotificationState
    error?: Error
    // this is an optional decoration component giving some more details on a task
}

export class Notifications {
    private static singleton: Notifications;
    private notifications: Accessor<QueuedNotification[]>;
    private setNotifications: Setter<QueuedNotification[]>;
    private constructor() {
        [this.notifications, this.setNotifications] = createSignal<QueuedNotification[]>([]);
    }

    /**
     * std error handler, use this in the catch clause of any get, post
     * @param err 
     */
    static handleException(err: Error, rethrow: boolean = true): void {
        console.error(err);
        Notifications.getSingleon().addNotification({
            caption: "error",
            localizeCaption: true,
            description: err.message || (err as any)["statusText"] || (err as any)["statusMessage"] || "unknown error",
            localizeDescription: true,

            do: () => Promise.resolve(NotificationState.FAILED)
        })
        if (rethrow) {
            throw err;
        }
    }

    static getSingleon(): Notifications {
        if (!this.singleton) {
            this.singleton = new Notifications();
        }
        return this.singleton;
    }

    setNotificationDecorator(notificationId: string, decorator: () => JSXElement) {
        this.setNotifications(prev => prev.map(v => {

            if (v.id == notificationId) {
                const v2 = { ...v, decorator }
                return v2;
            }
            return v;
        }))

    }

    updateNotification(notification: QueuedNotification, state: NotificationState, error?: Error) {
        this.setNotifications(prev => prev.map(v => {

            if (v.id == notification.id) {
                const v2 = { ...v }
                v2.state = state;
                if (error) {
                    v2.error = error;
                }


                if (state == NotificationState.DONE || state == NotificationState.UNDONE || notification.dismiss) {
                    setTimeout(() => {
                        this.dismissNotification(v2);
                    }, notification.timeout || 7000);
                }
                return v2;

            }
            return v;
        }))

    }

    addNotification(notification: Notification): string {
        const x: QueuedNotification = { ...notification, state: NotificationState.PROGRESS, id: makeId() }
        this.setNotifications(state => [...state, x]);
        notification.do()
            .then(state => {
                this.updateNotification(x, state)
            })
            .catch((err: Error) => {
                this.updateNotification(x, NotificationState.FAILED, err)
            })
        return x.id;
    }

    dismissNotification(notification: QueuedNotification) {
        this.setNotifications(state => state.filter(x => (x as QueuedNotification).id != notification.id));
    }

    renderNotification(notification: QueuedNotification) {
        const [errorDetailsVisible, setErrorDetailsVisible] = createSignal<boolean>(false);
        const [el, setEl] = createSignal<HTMLElement>()
        onMount(async () => {
            //el.classList.add(..."translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2".split(" "));
            const a = el()!.animate([{ opacity: 0, transform: "translateX(0.5rem)" }, { opacity: 1, transform: "translateX(0rem)" }], {
                duration: 300
            });
            a.finished.then(() => {
                //el()!.classList.remove(..."translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2".split(" "));
                //el()!.classList.add(..."translate-y-0 opacity-100 sm:translate-x-0".split(" "));
            });
        })
        const dismiss = async () => {
            const a = el()!.animate([{ opacity: 1, transform: "translateX(0rem)" }, { opacity: 0, transform: "translateX(0.5rem)" }], {
                duration: 300
            });
            a.finished.then(() => {
                this.dismissNotification(notification as QueuedNotification)
            })
        }

        const errorTitle = I18n.reactiveLocalize("error");

        const description = notification.error ? I18n.reactiveLocalize(notification.error.message) : undefined;
        return <div ref={setEl}
            class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-neutral-300 ring-opacity-5">
            <div class="ml-3 w-full p-4 pt-0.5">
                <div class="flex items-center gap-x-2">
                    <div class="shrink-0">
                        <Switch>
                            <Match when={notification.state == NotificationState.PROGRESS}>
                                <div class="animate-spin shrink-0">
                                    <svg class="ah-6 w-6 text-gray-400" fill="none" stroke-width="3" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24" stroke-dasharray="20">
                                        <circle cx="12" cy="12" r="8" stroke-width="0.5" stroke-dasharray="0" />
                                        <g fill="none" stroke-width="2"><path d="M 4 12 A 8 8 0 0 1 20 12"></path></g>
                                    </svg>
                                </div>
                            </Match>
                            <Match when={notification.state == NotificationState.DONE}>
                                <IoCheckmarkDone />
                            </Match>
                            <Match when={notification.state == NotificationState.UNDONE}>
                                <AiOutlineUndo />
                            </Match>
                            <Match when={notification.state == NotificationState.FAILED}>
                                <BiRegularError />
                            </Match>

                        </Switch>
                    </div><p class="text-sm font-medium text-gray-900 break-words"><Show when={notification.localizeCaption} fallback={notification.caption}><I18nTag>{notification.caption}</I18nTag></Show></p>
                </div>


                <Show when={notification.description}><p class="mt-1 text-sm text-gray-500"><I18nTag>{notification.description}</I18nTag></p></Show>
                <Show when={notification.children}>{notification.children!}</Show>
                <Show when={notification.error}>
                    <>
                        <a onclick={() => setErrorDetailsVisible(true)}>
                            <p class="mt-1 text-sm text-red-500"><I18nTag>{notification.error!.message}</I18nTag></p>
                        </a>
                        <Show when={errorDetailsVisible()}>
                            <TailwindModal
                                localizeTitle={true}
                                title={errorTitle()}
                                description={() => description!()}
                                onCancel={() => setErrorDetailsVisible(false)}
                                open={true}
                                hideSubmitButton
                                severity="error"
                            >
                                <DescriptionList xs={Object.keys(notification.error!)
                                    .reduce((acc, x) => {
                                        if (x == "msg" || x == "message") return acc;
                                        acc.push({ key: x, translateKey: true, value: (notification.error as any)[x] } as DescriptionProps)
                                        return acc;
                                    }, [] as Array<DescriptionProps>)} />


                            </TailwindModal>
                        </Show>
                    </>
                </Show>
                <div class="mt-3 flex space-x-7">
                    <Show when={notification.undo}>
                        <button type="button" class="rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><I18nTag>undo</I18nTag></button>
                    </Show>
                    <button onclick={() => dismiss()} type="button" class="rounded-md bg-white text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><I18nTag>dismiss</I18nTag></button>
                </div>
            </div>
        </div>
    }

    render() {
        return <div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-60" style="z-index: 60">
            <div class="flex w-full flex-col items-end space-y-4">
                <For each={this.notifications()}>
                    {(item, i) => <Dynamic component={() => this.renderNotification(item)} />}
                </For>
            </div>
        </div>

    }
}

export const renderNotificationsSingleton = () => {
    return <Dynamic component={() => Notifications.getSingleon().render()} />
}

