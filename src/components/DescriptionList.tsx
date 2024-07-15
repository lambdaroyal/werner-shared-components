/**
 * a description list displays a seq of key-value pairs
 * 
 * refer to https://tailwindui.com/components/application-ui/data-display/description-lists for an example
 * 
 * @author christian.meichsner@rocklog.ch
 */

import { For, JSXElement } from "solid-js"
import { I18nTag } from "./I18nTag"


export interface DescriptionProps {
    key: string, translateKey?: boolean, value: string, translateValue?: boolean
}

export interface DescriptionListProps {
    xs: Array<DescriptionProps>
}

export const DescriptionList = (props: DescriptionListProps): JSXElement => {
    return <div class="descriptionList">
        <dl>
            <For each={props.xs}>
                {item => <div class="descriptionListItem">
                    <dt>{item.translateKey ? <I18nTag>item.key</I18nTag> : item.key}</dt>
                    <dd>{item.translateValue ? <I18nTag>item.value</I18nTag> : item.value}</dd>
                </div>
                }
            </For>
        </dl>
    </div>
}

