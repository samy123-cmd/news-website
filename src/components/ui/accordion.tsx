"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
}>({})

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        type?: "single" | "multiple"
        value?: string
        onValueChange?: (value: string) => void
        collapsible?: boolean
    }
>(({ className, type, value: controlledValue, onValueChange, ...props }, ref) => {
    const [value, setValue] = React.useState<string | undefined>(controlledValue)

    const handleValueChange = (newValue: string) => {
        const nextValue = newValue === value ? "" : newValue
        setValue(nextValue)
        onValueChange?.(nextValue)
    }

    return (
        <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div ref={ref} className={cn("", className)} {...props} />
        </AccordionContext.Provider>
    )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("border-b border-white/10", className)} {...props} />
    )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(AccordionContext)
    // This is a simplified implementation. In a real scenario, we'd need to pass the item value down.
    // For now, let's assume the parent Item passes the value or we use a different pattern.
    // Actually, to make this work with the standard API, we need the Item to provide context.

    return (
        <AccordionItemContext.Consumer>
            {({ value: itemValue }) => (
                <div className="flex">
                    <button
                        ref={ref}
                        onClick={() => onValueChange?.(itemValue)}
                        className={cn(
                            "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:text-primary [&[data-state=open]>svg]:rotate-180",
                            className
                        )}
                        data-state={value === itemValue ? "open" : "closed"}
                        {...props}
                    >
                        {children}
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </button>
                </div>
            )}
        </AccordionItemContext.Consumer>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { value } = React.useContext(AccordionContext)

    return (
        <AccordionItemContext.Consumer>
            {({ value: itemValue }) => (
                <AnimatePresence initial={false}>
                    {value === itemValue && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div ref={ref} className={cn("pb-4 pt-0 text-muted-foreground", className)} {...props}>
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </AccordionItemContext.Consumer>
    )
})
AccordionContent.displayName = "AccordionContent"

// Helper context for Item
const AccordionItemContext = React.createContext<{ value: string }>({ value: "" })

// Wrap AccordionItem to provide context
const AccordionItemWrapper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
    return (
        <AccordionItemContext.Provider value={{ value }}>
            <div ref={ref} className={cn("border-b border-white/10", className)} {...props}>
                {children}
            </div>
        </AccordionItemContext.Provider>
    )
})
AccordionItemWrapper.displayName = "AccordionItem"

export { Accordion, AccordionItemWrapper as AccordionItem, AccordionTrigger, AccordionContent }
