"use client"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"hr"> & { orientation?: "horizontal" | "vertical" }) {
  if (orientation === "vertical") {
    return (
      <div
        data-slot="separator"
        role="separator"
        aria-orientation="vertical"
        className={cn("shrink-0 w-px self-stretch bg-border", className)}
        {...props}
      />
    )
  }
  return (
    <hr
      data-slot="separator"
      className={cn("shrink-0 h-px w-full bg-border border-none", className)}
      {...props}
    />
  )
}

export { Separator }
