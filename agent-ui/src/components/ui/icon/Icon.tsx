import { type FC } from 'react'

import { cn } from '@/lib/utils'

import { ICONS } from './constants'
import { type IconProps } from './types'

const Icon: FC<IconProps> = ({
  type,
  size = 'sm',
  className,
  color,
  disabled = false
}) => {
  const IconElement = ICONS[type]

  if (!IconElement) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Icon] Tipo de icono desconocido: "${type}"`)
    }
    return null
  }

  return (
    <IconElement
      className={cn(
        color && !disabled ? `text-${color}` : 'text-primary',
        disabled && 'text-muted/50 cursor-default',
        className,
        size === 'xxs' && 'size-3',
        size === 'xs' && 'size-4',
        size === 'sm' && 'size-6',
        size === 'md' && 'size-[42px]',
        size === 'lg' && 'size-7',
        size === 'dot' && 'size-[5.07px]',
        size === 'default' && ' '
      )}
    />
  )
}

export default Icon
