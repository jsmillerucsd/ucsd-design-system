// Vendored from the shadcn/ui registry (style: new-york-v4) by demo/vendor.mjs.
// Do not edit. If this looks wrong, fix the token bridge, not this file.
import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
