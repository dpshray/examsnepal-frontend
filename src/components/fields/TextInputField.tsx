'use client'
import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface TextInputFieldProps {
    name?: string
    label?: string
    placeholder?: string
    type?: string
    required?: boolean
    className?: string
    icon?: React.ElementType
    error?: string
}

export default function TextInputField({
                                           name,
                                           label,
                                           placeholder,
                                           type = "text",
                                           required = false,
                                           className,
                                           icon: Icon,
                                           error,
                                           ...props
                                       }: TextInputFieldProps) {
    return (
        <div className="space-y-2">
            {label && (
                <Label
                    htmlFor={name}
                    className={cn("text-sm font-medium", error && "text-red-500")}
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </Label>
            )}

            <div className="relative">
                {Icon && (
                    <div
                        className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground",
                            error && "text-red-500"
                        )}
                    >
                        <Icon size={16} aria-hidden="true" />
                    </div>
                )}

                <Input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    className={cn(
                        'focus-visible:ring-[0px]',
                        Icon ? "pl-10" : "pl-3",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    {...props}
                    aria-invalid={error ? "true" : "false"}
                    aria-errormessage={error ? `${name}-error` : undefined}
                    aria-describedby={error ? `${name}-error` : undefined}
                    aria-required={required ? "true" : "false"}
                />

                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
        </div>
    )
}
