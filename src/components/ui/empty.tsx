import { HtmlHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface EmptyPlaceholderProps 
    extends HtmlHTMLAttributes<HTMLDivElement> {}

export function EmptyPlaceholder({ className, children }: EmptyPlaceholderProps) {
    return (
        <div className={cn(
            "min-w-sm min-h-64 w-full flex justify-center items-center border border-dashed rounded-xl p-4",
            className
        )}>
            {children}
        </div>
    )
}

interface EmptyPlaceholderDescription 
    extends HtmlHTMLAttributes<HTMLParagraphElement> {}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({ children }: EmptyPlaceholderDescription) {
    return (
        <p className="text-sm font-light text-muted-foreground">
            {children}
        </p>
    )
}