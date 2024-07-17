/**
 * Tag
 * adapted from https://tailwindui.com/templates/protocol
 */

import clsx from 'clsx'
import { JSXElement, Show } from 'solid-js'
import { I18n } from '../lib/i18n'
import { isNotEmpty } from '../lib/utils'
import { CopyHandle } from './CopyHandle'

export const TagVariantStyles = {
  small: 'rounded-lg ring-1 ring-inset py-0.5',
  medium: 'rounded-lg ring-1 ring-inset py-1 text-sm',
}

export const TagColorStyles = {
  accent: {
    small: 'text-accent-content bg-accent ring-accent',
    medium:
      'text-accent-content bg-accent ring-accent',
  },
  // for something that needs attention
  warning: {
    small: 'text-warning-content bg-warning ring-warning',
    medium:
      'text-warning-content bg-warning ring-warning',
  },
  // for something pending or an error
  error: {
    small: 'text-error-content bg-error ring-error',
    medium:
      'text-error-content bg-error ring-error',
  },
  // for an info
  info: {
    small: 'text-info-content bg-info ring-info',
    medium:
      'text-info-content bg-info ring-info',
  },
  // for something that is ok or dispatched
  success: {
    small: 'text-success-content bg-success ring-success',
    medium:
      'ring-success text-success-content bg-success ring-success',
  },
  outline: {
    small: 'ring-base-content text-base-content',
    medium:
      'ring-base-content text-base-content',
  },
  primary: {
    small: 'ring-primary-content bg-primary ring-primary-content text-primary-content',
    medium:
      'ring-primary-content bg-primary ring-primary-content text-primary-content',

  },
  secondary: {
    small: 'ring-secondary-content bg-secondary ring-secondary text-secondary-content',
    medium:
      'ring-secondary-content bg-secondary ring-secondary text-secondary-content',

  }

}

const valueColorMap = {
  GET: 'accent',
  POST: 'info',
  PUT: 'warning',
  DELETE: 'error',
} as Record<string, keyof typeof TagColorStyles>

export type TagProps = {
  children: (keyof typeof valueColorMap & (string | {})) | JSXElement | JSXElement[]
  variant?: keyof typeof TagVariantStyles
  color?: keyof typeof TagColorStyles
  iconFn?: () => JSXElement
  copyFn?: () => string
  tooltip?: string,
  localizeTooltip?: boolean
}

export function Tag({
  children,
  tooltip = undefined,
  localizeTooltip = false,
  copyFn = undefined,
  variant = 'medium',
  color = 'primary',
  iconFn = undefined
}: TagProps) {
  const tooltip_ = (isNotEmpty(tooltip) && localizeTooltip) ? I18n.reactiveLocalize(tooltip!) : () => tooltip;
  return (

    <span
      style={{ "padding-left": "0.375rem", "padding-right": "0.375rem" }}
      data-toggle="tooltip"
      data-placement="top"
      title={tooltip_()}
      class={clsx(
        'font-mono text-[0.625rem] icon-with-text copy-handle-container vlicTag inline-flex items-center gap-x-1',
        TagVariantStyles[variant],
        TagColorStyles[color][variant],
      )}
    >

      <Show when={iconFn}>{iconFn!()}</Show>
      {children}
      <Show when={copyFn}>
        <CopyHandle copyFn={copyFn!} class="font-thin" />
      </Show>
    </span>
  )
}
