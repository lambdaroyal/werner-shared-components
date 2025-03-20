
import clsx from "clsx";
import { Accessor, createSignal, JSX, JSXElement, Show } from "solid-js";
import { classNames, I18nTag } from "werner-shared-components";

export const VerticalEllipsisPopover = (props: { class?: string }): JSX.Element => {
    return <div class={clsx("-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900", props.class)} id="options-menu-0-button" aria-expanded="false" aria-haspopup="true">
        <span class="sr-only"><I18nTag>Open options</I18nTag></span>
        <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
        </svg>
    </div>
}


function ChevronDownIcon(props: JSX.IntrinsicElements['svg']): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
}


export function DropDownButtonMinimalItem(props: { class?: string, children: JSXElement, onClick?: () => void }) {
    return <a class={clsx("group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-hidden gap-x-2", props.class)} role="button" tabindex="-1" id="menu-item-0" onClick={props.onClick} onKeyDown={e => {
        if (e.key === "Enter") {
            props.onClick?.();
        }
    }}>{props.children}</a>

}

/**
 * more std dropdown button than the popup menu
 * @param props 
 * @returns 
 */
export function DropDownButtonMinimal({ buttonClass, buttonContent, children, popover }: {
    buttonClass?: string,
    buttonContent?: JSXElement | JSXElement[],
    popover?: (isOpen: Accessor<boolean>, setState: (state: boolean) => void) => JSXElement,
    disabled?: boolean | Accessor<boolean>
    position?: 'dropdown-end' | 'dropdown-bottom' | 'dropdown-top' | 'dropdown-left' | 'dropdown-right'

    children: ({ setState }: { setState: (state: boolean) => void }) => JSXElement | JSXElement[]
}) {


    const effectiveButtonClass = clsx("btn flex flex-nowrap items-center gap-1 cursor-pointer", buttonClass);


    const MyPopover = function (props: { children: (props: { isOpen: Accessor<boolean>, setState: (state: boolean) => void }) => JSXElement | JSXElement[], position?: 'dropdown-end' | 'dropdown-bottom' | 'dropdown-top' | 'dropdown-left' | 'dropdown-right' }) {
        const [isOpen, setState] = createSignal(false);
        return <div class={classNames(
            "dropdown relative",
            props.position || 'dropdown-end'
        )}>


            <Show when={!popover} fallback={popover!(isOpen, setState)}>
                <div role="button" class={effectiveButtonClass} onClick={() => setState(!isOpen())}>{buttonContent}
                    <ChevronDownIcon
                        class={classNames(
                            isOpen() && 'text-opacity-70',
                            'ml-2 h-5 w-5'
                        )}
                        aria-hidden="true"
                    />


                </div>
            </Show>

            {props.children({ isOpen, setState })}

        </div>

    }

    return <MyPopover>
        {({ isOpen, setState }) => (

            <Show when={isOpen()}>
                <ul tabIndex={0} class="dropdown-content z-1 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                    {children({ setState })}
                </ul>
            </Show>
        )}
    </MyPopover>
}