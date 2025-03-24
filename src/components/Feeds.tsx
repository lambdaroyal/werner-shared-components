import { Accessor, For, JSX, Show } from "solid-js"
import { VerticalEllipsisPopover } from "./VerticalEllipsisPopover"
import { TimeAgo } from "./TimeAgo"
import { DropDownButtonMinimal, DropDownButtonMinimalItem } from "./MinimalDropDownButton"
import { I18nTag } from "./I18nTag"


export type TFeedAction<TItem> = {
    label: string,
    localize?: boolean,
    localizationDomain?: string,
    onClick: (item: TItem) => void
    icon?: JSX.Element
}

export function Feeds<TItem>(props: {
    items: Accessor<TItem[] | undefined>,
    renderItem: (item: TItem) => JSX.Element,
    timeAgo?: (item: TItem) => Date,
    actions?: (item: TItem) => TFeedAction<TItem>[]
}) {

    const Item = ({ item, last }: { item: TItem, last: boolean }) => {
        return <li class="relative flex items-start gap-x-4">
            <Show when={last}>
                <div class="absolute top-0 -bottom-6 left-0 flex w-6 justify-center">
                    <div class="w-px bg-gray-200"></div>
                </div>
            </Show>
            <div class="relative flex size-6 flex-none items-center justify-center bg-white">
                <div class="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300"></div>
            </div>
            <div class="flex-1">
                {props.renderItem(item)}
            </div>
            <Show when={props.timeAgo}>
                <time class="flex-none py-0.5 text-xs/5 text-gray-500">
                    <Show when={typeof props.timeAgo!(item) === "object"}>
                        <TimeAgo date={props.timeAgo!(item)} />
                    </Show>
                </time>
            </Show>
            <Show when={props.actions?.(item)?.length}>
                <DropDownButtonMinimal popover={(isOpen, setState) => {
                    return <button class="cursor-pointer focus:outline-none" role="button" onClick={() => setState(!isOpen())}>
                        <VerticalEllipsisPopover />
                    </button>
                }}>
                    {({ setState }) => (<For each={props.actions?.(item)}>
                        {action => <DropDownButtonMinimalItem onClick={() => {
                            setState(false);
                            action.onClick(item);
                        }}><Show when={action.icon}>{action.icon}</Show><I18nTag domain={action.localizationDomain}>{action.label}</I18nTag></DropDownButtonMinimalItem>}
                    </For>)
                    }
                </DropDownButtonMinimal>
            </Show>
        </li>
    }


    return <Show when={props.items()?.length}>

        <ul role="list" class="space-y-6">
            <For each={props.items?.()}>
                {(item, index) => <Item item={item} last={index() < props.items()!.length - 1} />}
            </For>
        </ul>

    </Show>

}