import { JSXElement } from "solid-js";

export function ChevronDownIcon(props: any): JSXElement {
    return (<svg
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

