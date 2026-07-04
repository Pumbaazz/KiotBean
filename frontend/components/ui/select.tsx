"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

function Select({ children, value, onValueChange, ...props }: {
  children?: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}) {
  const [internalValue, setInternalValue] = React.useState(props.defaultValue ?? "")
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const handleChange = React.useCallback((v: string) => {
    if (!isControlled) setInternalValue(v)
    onValueChange?.(v)
  }, [isControlled, onValueChange])

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      {children}
    </SelectContext.Provider>
  )
}

function SelectGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="select-group" className={cn("scroll-my-1 p-1", className)} {...props} />
}

function SelectValue({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="select-value" className={cn("flex flex-1 text-left", className)} {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<"button"> & { size?: "sm" | "default" }) {
  return (
    <button
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </button>
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-content"
      className={cn(
        "relative isolate z-50 max-h-(--available-height) min-w-36 overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({ className, children, value, ...props }: React.ComponentProps<"div"> & { value: string }) {
  const ctx = React.useContext(SelectContext)

  return (
    <div
      data-slot="select-item"
      data-value={value}
      role="option"
      aria-selected={ctx?.value === value}
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={() => ctx?.onValueChange(value ?? "")}
      {...props}
    >
      {children}
      {ctx?.value === value && (
        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
      )}
    </div>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="select-scroll-up-button" className={cn("top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1", className)} {...props} />
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="select-scroll-down-button" className={cn("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1", className)} {...props} />
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
