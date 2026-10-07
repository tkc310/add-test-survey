import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'danger'

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed',
  danger: 'px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 見た目の種別。実際に使っているものだけを定義する */
  variant?: ButtonVariant
  children: ReactNode
}

/**
 * 再利用可能なボタンコンポーネント
 * type / disabled / onClick / aria-label などネイティブ属性はそのまま渡せる
 */
export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = className
    ? `${variantClassName[variant]} ${className}`
    : variantClassName[variant]

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
