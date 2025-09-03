import React from "react"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {AlertTriangle} from "lucide-react"
import {Button} from "@/components/ui/button"
import {AnimatePresence, motion} from "framer-motion"
import {cn} from "@/lib/utils"

interface ErrorComponentProps {
    error: string | null
    onRetry: () => void
    className?: string
}

export default function ErrorComponent({
                                           error,
                                           onRetry,
                                           className,
                                       }: ErrorComponentProps) {
    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}
                    className={cn("mb-3", className)}
                >
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertDescription className="flex items-center justify-between w-full">
                            <span>{error}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRetry}
                                className="ml-4 h-8"
                            >
                                Try Again
                            </Button>
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
