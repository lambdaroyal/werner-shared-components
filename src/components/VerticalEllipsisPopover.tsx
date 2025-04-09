import { I18nTag } from "./I18nTag";


export function VerticalEllipsisPopover() {
    return <button type="button" class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900" id="options-menu-0-button" aria-expanded="false" aria-haspopup="true">
        <span class="sr-only"><I18nTag>Open options</I18nTag></span>
        <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
        </svg>
    </button>
}
