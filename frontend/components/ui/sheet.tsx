"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const SheetContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function Sheet({ children, open: controlledOpen, onOpenChange }: {
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
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

function useSheet() {
  const ctx = React.useContext(SheetContext)
  if (!ctx) throw new Error("Sheet components must be used within Sheet")
  return ctx
}

function SheetTrigger({ children, ...props }: React.ComponentProps<"button">) {
  const { setOpen } = useSheet()
  return <button onClick={() => setOpen(true)} {...props}>{children}</button>
}

function SheetClose({ children, ...props }: React.ComponentProps<"button">) {
  const { setOpen } = useSheet()
  return <button onClick={() => setOpen(false)} {...props}>{children}</button>
}

function SheetPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function SheetOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  const { open, setOpen } = useSheet()
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  React.useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    const handler = () => setOpen(false)
    d.addEventListener("close", handler)
    return () => d.removeEventListener("close", handler)
  }, [setOpen])

  if (!open) return null

  return (
    <SheetPortal>
      <SheetOverlay />
      <dialog
        ref={dialogRef}
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover text-sm text-popover-foreground shadow-lg",
          "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          className
        )}
        {...(props as React.ComponentPropsWithoutRef<"dialog">)}
      >
        {children}
      </dialog>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h2">>(
  function SheetTitle({ className, ...props }, ref) {
    return (
      <h2
        ref={ref}
        data-slot="sheet-title"
        className={cn("font-heading text-base font-medium text-foreground", className)}
        {...props}
      />
    )
  }
)

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  function SheetDescription({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        data-slot="sheet-description"
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    )
  }
)

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
