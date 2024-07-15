import clsx from 'clsx'
import { Accessor, Component, JSXElement, createMemo } from 'solid-js'
import { I18n } from '../lib/i18n'

function ArrowIcon(props: { [key: string]: any }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  )
}

export const ButtonVariantStyles = {
  primary:
    'btn-primary',
  secondary:
    'btn-secondary',
  outline:
    'btn-outline',
  text: 'btn-ghost',
}

export type ButtonProps = {
  variant?: keyof typeof ButtonVariantStyles,
  children?: JSXElement | JSXElement[] | string,
  href?: string,
  arrow?: 'left' | 'right'
  tooltip?: string
  dropdown?: boolean
  disabled?: boolean | Accessor<boolean>
  onclick?: () => void
} & { [key: string]: any }

export const Button: Component<{
  class?: string,
} & ButtonProps> = props => {

  const classes = clsx(
    'inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition items-center btn btn-sm',
    props.variant ? ButtonVariantStyles[props.variant] : undefined,
    props.class,
  );

  const renderArrowIcon = () => <ArrowIcon class={clsx(
    'mt-0.5 h-5 w-5',
    props.variant === 'text' && 'relative top-px',
    props.arrow === 'left' && '-ml-1 rotate-180',
    props.arrow === 'right' && '-mr-1',
  )}
  />

  const renderDropdownIcon = () => <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
  </svg>

  let inner = (
    <>
      {props.arrow === 'left' ? renderArrowIcon() : undefined}
      {props.children}
      {props.arrow === 'right' ? renderArrowIcon() : undefined}
      {props.dropdown ? renderDropdownIcon() : undefined}
    </>
  )

  const title = createMemo(() => props.tooltip ? I18n.localize(props.tooltip) : undefined)

  const disabled = createMemo(() => {
    return props.disabled !== undefined ?
      typeof props.disabled === 'function' ?
        props.disabled() :
        props.disabled :
      false
  })

  if (typeof props.href === 'undefined') {
    return <button onclick={props.onclick} class={classes} {...props} disabled={disabled()} title={title()} data-toggle="tooltip" data-placement="top">{inner}</button>
  }

  return (
    <a onclick={props.onclick} class={classes} {...props} title={title()} data-toggle="tooltip" data-placement="top">{inner}</a>
  )
}
