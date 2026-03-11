import * as React from "react"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({
  className,
  variant = "default",
  style,
  ...props
}: BadgeProps) {
  const variants = {
    default: {
      background: 'var(--accent-primary)',
      color: '#fff',
      border: '1px solid transparent',
    },
    secondary: {
      background: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid transparent',
    },
    destructive: {
      background: '#EF4444',
      color: '#fff',
      border: '1px solid transparent',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-default)',
    },
  }

  const v = variants[variant]

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${className}`}
      style={{ ...v, ...style }}
      {...props}
    />
  )
}

export { Badge }
