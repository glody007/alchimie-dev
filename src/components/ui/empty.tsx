import type { HtmlHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export function EmptyPlaceholder({ className, children }: HtmlHTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn(
            "min-w-sm min-h-64 w-full flex justify-center items-center border border-dashed rounded-xl p-4",
            className
        )}>
            {children}
        </div>
    )
}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({ children }: HtmlHTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className="text-sm font-light text-muted-foreground">
            {children}
        </p>
    )
}