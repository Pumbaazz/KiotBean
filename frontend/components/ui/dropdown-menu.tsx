"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

type DropdownMenuContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

function useDropdownMenu() {
  const ctx = React.useContext(DropdownMenuContext)
  if (!ctx) throw new Error("DropdownMenu components must be used within DropdownMenu")
  return ctx
}

function DropdownMenu({ children, open: controlledOpen, onOpenChange }: {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = React.useCallback((value: boolean) => {
    if (!isControlled) setUncontrolledOpen(value)
    onOpenChange?.(value)
  }, [isControlled, onOpenChange])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuTrigger({ children, className, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { open, setOpen } = useDropdownMenu()
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="dropdown-menu-trigger"
      className={className}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      {...props}
    >
      {children}
    </Comp>
  )
}

function DropdownMenuContent({
  align = "start",
  side = "bottom",
  sideOffset = 4,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
  alignOffset?: number
}) {
  const { open, setOpen } = useDropdownMenu()
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open, setOpen])

  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, setOpen])

  if (!open) return null

  const sideClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
    left: "right-full mr-1",
    right: "left-full ml-1",
  }

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={ref}
      data-slot="dropdown-menu-content"
      className={cn(
        "absolute z-50 min-w-32 overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
        sideClasses[side],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuGroup({ children, ...props }: { children?: React.ReactNode; className?: string }) {
  return <div data-slot="dropdown-menu-group" {...props}>{children}</div>
}

function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  onClick,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const { setOpen } = useDropdownMenu()

  return (
    <div
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      role="menuitem"
      tabIndex={-1}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={(e) => {
        setOpen(false)
        onClick?.(e as React.MouseEvent<HTMLDivElement>)
      }}
      {...props}
    />
  )
}

const DropdownMenuSubContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function DropdownMenuSub({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenuSubContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </DropdownMenuSubContext.Provider>
  )
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  const { setOpen } = React.useContext(DropdownMenuSubContext)!

  return (
    <div
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      role="menuitem"
      tabIndex={-1}
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </div>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { open } = React.useContext(DropdownMenuSubContext)!
  if (!open) return null

  return (
    <div
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "absolute left-full top-0 z-50 min-w-32 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 ml-1",
        className
      )}
      {...props}
    />
  )
}

type RadioGroupContextType = {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null)

function DropdownMenuRadioGroup({
  children,
  value,
  onValueChange,
  ...props
}: { children?: React.ReactNode; value?: string; onValueChange?: (value: string) => void; className?: string }) {
  return (
    <RadioGroupContext.Provider value={{ value: value ?? "", onValueChange: onValueChange ?? (() => {}) }}>
      <div data-slot="dropdown-menu-radio-group" {...props}>{children}</div>
    </RadioGroupContext.Provider>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const radioCtx = React.useContext(RadioGroupContext)
  const { setOpen } = useDropdownMenu()
  const selected = radioCtx?.value === value

  return (
    <DropdownMenuItem
      className={cn("pr-8", className)}
      onClick={() => {
        radioCtx?.onValueChange(value)
        setOpen(false)
      }}
      {...props}
    >
      {children}
      {selected && (
        <span className="pointer-events-none absolute right-2 flex items-center justify-center">
          <CheckIcon className="size-4" />
        </span>
      )}
    </DropdownMenuItem>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<"div"> & { checked?: boolean; inset?: boolean }) {
  const { setOpen } = useDropdownMenu()

  return (
    <div
      data-slot="dropdown-menu-checkbox-item"
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={-1}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {checked && (
        <span className="pointer-events-none absolute right-2 flex items-center justify-center">
          <CheckIcon className="size-4" />
        </span>
      )}
      {children}
    </div>
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
