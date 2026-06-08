"use client"

import type { JSX } from "react"
import { useSyncExternalStore } from "react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerIcon, Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons"

function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
}: {
  icon: JSX.Element
  value: string
  isActive?: boolean
  onClick: (value: string) => void
}) {
  return (
    <button
      data-active={isActive}
      className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color] hover:text-foreground data-[active=true]:text-foreground [&_svg]:size-4"
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value)}
    >
      {icon}

      {isActive && (
        <motion.span
          layoutId="theme-option"
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="absolute inset-0 rounded-full border border-neutral-800"
        />
      )}
    </button>
  )
}

const THEME_OPTIONS = [
  {
    icon: (
      <HugeiconsIcon icon={ComputerIcon} strokeWidth={2} />
    ),
    value: "system",
  },
  {
    icon: (
      <HugeiconsIcon icon={Sun03Icon} strokeWidth={2} />
    ),
    value: "light",
  },
  {
    icon: (
      <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} />
    ),
    value: "dark",
  },
]

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!isMounted) {
    return <div className="flex h-8 w-24" />
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-clip rounded-full bg-background inset-ring-1 inset-ring-border"
      role="radiogroup"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={setTheme}
        />
      ))}
    </motion.div>
  )
}

export { ThemeSwitcher }
