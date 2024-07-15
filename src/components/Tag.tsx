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
  small: '',
  medium: 'rounded-lg px-1.5 ring-1 ring-inset my-0.5',
}

export const TagColorStyles = {
  emerald: {
    small: 'text-emerald-500 dark:text-emerald-400',
    medium:
      'ring-emerald-300 dark:ring-emerald-400/30 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400',
  },
  sky: {
    small: 'text-sky-500',
    medium:
      'ring-sky-300 bg-sky-400/10 text-sky-500 dark:ring-sky-400/30 dark:bg-sky-400/10 dark:text-sky-400',
  },
  // for something that needs attention
  amber: {
    small: 'text-amber-500',
    medium:
      'ring-amber-300 bg-amber-400/10 text-amber-500 dark:ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400',
  },
  // for something pending or an error
  rose: {
    small: 'text-red-500 dark:text-rose-500',
    medium:
      'ring-rose-200 bg-rose-50 text-red-500 dark:ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400',
  },
  // for an info
  zinc: {
    small: 'text-zinc-400 dark:text-zinc-500',
    medium:
      'ring-zinc-200 bg-zinc-50 text-zinc-500 dark:ring-zinc-500/20 dark:bg-zinc-400/10 dark:text-zinc-400',
  },
  // for something that is ok or dispatched
  inherit: {
    small: 'text-green-400 dark:text-green-500',
    medium:
      'ring-green-200 bg-green-50 text-green-500 dark:ring-green-500/20 dark:bg-green-400/10 dark:text-green-400',
  },
  outline: {
    small: 'ring-zinc-900/5 dark:ring-white/5',
    medium:
      'ring-zinc-900/5 dark:ring-white/5',
  }
}

const valueColorMap = {
  GET: 'emerald',
  POST: 'sky',
  PUT: 'amber',
  DELETE: 'rose',
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
  color = 'inherit',
  iconFn = undefined
}: TagProps) {
  const tooltip_ = (isNotEmpty(tooltip) && localizeTooltip) ? I18n.reactiveLocalize(tooltip!) : () => tooltip;
  return (

    <span
      data-toggle="tooltip"
      data-placement="top"
      title={tooltip_()}
      class={clsx(
        'font-mono text-[0.625rem] icon-with-text copy-handle-container vlicTag',
        TagVariantStyles[variant],
        TagColorStyles[color][variant],
      )}
    >

      <Show when={iconFn}>{iconFn!()}</Show>
      {children}
      <Show when={copyFn}>
        <CopyHandle copyFn={copyFn!} />
      </Show>
    </span>
  )
}
