/**
 * a description list displays a seq of key-value pairs
 * 
 * refer to https://tailwindui.com/components/application-ui/data-display/description-lists for an example
 * 
 * @author christian.meichsner@rocklog.ch
 */

import { For, JSXElement, Match, Switch } from "solid-js"
import { I18nTag } from "./I18nTag"


export interface DescriptionProps {
    key: string, translateKey?: boolean,
    translateValue?: boolean,
    value: string | (() => JSXElement)
}

export interface DescriptionListProps {
    header?: {
        title: string,
        description: string
    }
    xs: Array<DescriptionProps>
}


export const DescriptionList = (props: DescriptionListProps): JSXElement => {
    return <div class="descriptionList mt-6 border-t border-neutral-200">
        <dl class="divide-y divide-neutral-200">
            <For each={props.xs}>
                {item => <div class="descriptionListItem px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm/6 font-medium text-gray-900">{item.translateKey ? <I18nTag>{item.key}</I18nTag> : item.key}</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <Switch>
                            <Match when={typeof item.value === 'string'}>
                                {item.translateValue ? <I18nTag>{item.value as string}</I18nTag> : item.value}
                            </Match>
                            <Match when={typeof item.value === 'function'}>
                                {(item.value as () => JSXElement)()}
                            </Match>
                        </Switch>
                    </dd>
                </div>
                }
            </For>
        </dl>
    </div>
}


