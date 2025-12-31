"use client"

import {memo, useCallback, useId, useMemo} from "react"
import DOMPurify from "dompurify"

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import {cn} from "@/lib/utils"

export interface QuestionOption {
    id: number
    question_id: number
    option: string
}

export interface ExamQuestionCardProps {
    questionNumber: number
    questionText: string
    options: QuestionOption[]
    selectedValue?: number
    user_choosed?: number | null
    onSelectAction: (value: number) => void
    disabled?: boolean
    className?: string
    variant?: "default" | "compact"
}

const ExamQuestionCard = memo(function ExamQuestionCard({
                                                            questionNumber,
                                                            questionText,
                                                            options,
                                                            selectedValue,
                                                            user_choosed,
                                                            onSelectAction,
                                                            disabled = false,
                                                            className,
                                                            variant = "default",
                                                        }: ExamQuestionCardProps) {
    const reactId = useId()
    const questionId = `question-${reactId}`

    const effectiveSelectedValue = user_choosed ?? selectedValue

    const sanitizedQuestionText = useMemo(
        () =>
            DOMPurify.sanitize(questionText, {
                ALLOWED_TAGS: ["b", "i", "u", "em", "strong", "sup", "sub"],
            }),
        [questionText]
    )

    const sanitizedOptions = useMemo(
        () =>
            options.map((opt) => ({
                id: opt.id,
                sanitized: DOMPurify.sanitize(opt.option, {
                    ALLOWED_TAGS: ["b", "i", "u", "em", "strong", "sup", "sub"],
                }),
            })),
        [options]
    )

    const handleValueChange = useCallback(
        (value: string) => {
            const numericValue = Number(value)
            if (!isNaN(numericValue)) onSelectAction(numericValue)
        },
        [onSelectAction]
    )

    const isCompact = variant === "compact"

    return (
        <article
            className={cn(
                "w-full bg-card rounded-lg border border-gray-200 shadow-sm transition-all",
                isCompact ? "p-2" : "p-3",
                disabled && "opacity-60 pointer-events-none cursor-not-allowed",
                className
            )}
        >
            <div className={cn("flex items-start gap-2", isCompact ? "mb-1.5" : "mb-2")}>
                <div
                    className={cn(
                        "shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm",
                        isCompact ? "w-6 h-6" : "w-7 h-7"
                    )}
                    aria-hidden="true"
                >
          <span className={cn("text-white font-bold", isCompact ? "text-xs" : "text-sm")}>
            {questionNumber}
          </span>
                </div>
                <h2
                    id={`${questionId}-heading`}
                    className={cn(
                        "flex-1 font-semibold leading-snug text-gray-900",
                        isCompact ? "text-sm" : "text-base"
                    )}
                    dangerouslySetInnerHTML={{__html: sanitizedQuestionText}}
                />
            </div>

            <RadioGroup
                value={
                    effectiveSelectedValue !== undefined && effectiveSelectedValue !== null
                        ? String(effectiveSelectedValue)
                        : ""
                }
                onValueChange={handleValueChange}
                aria-labelledby={`${questionId}-heading`}
                disabled={disabled}
                className={cn("space-y-1.5", isCompact ? "mt-1.5" : "mt-2")}
            >
                {sanitizedOptions.map((option, index) => {
                    const value = String(option.id)
                    const isSelected = effectiveSelectedValue === option.id
                    const label = String.fromCharCode(65 + index)
                    const optionId = `${questionId}-option-${value}`

                    return (
                        <div
                            key={option.id}
                            className={cn(
                                "group flex items-start gap-2 rounded-lg border-2 transition-all duration-200",
                                isCompact ? "p-1.5" : "p-2",
                                "focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-1",
                                isSelected
                                    ? "border-green-500 bg-green-50 shadow-sm"
                                    : "border-gray-200 hover:border-green-300 hover:bg-gray-50 hover:shadow-sm",
                                disabled && "hover:border-gray-200 hover:bg-transparent hover:shadow-none"
                            )}
                        >
                            <RadioGroupItem
                                value={value}
                                id={optionId}
                                className={cn("mt-0.5 shrink-0", isSelected && "border-green-600")}
                                aria-label={`Option ${label}`}
                            />
                            <Label
                                htmlFor={optionId}
                                className={cn(
                                    "cursor-pointer flex-1 leading-snug",
                                    isCompact ? "text-xs" : "text-sm",
                                    disabled && "cursor-not-allowed"
                                )}
                            >
                <span
                    className={cn(
                        "font-semibold mr-1",
                        isSelected ? "text-green-700" : "text-gray-900"
                    )}
                >
                  {label}.
                </span>
                                <span
                                    className={cn(isSelected ? "text-gray-900" : "text-gray-700")}
                                    dangerouslySetInnerHTML={{__html: option.sanitized}}
                                />
                            </Label>
                        </div>
                    )
                })}
            </RadioGroup>
        </article>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.questionNumber === nextProps.questionNumber &&
        prevProps.questionText === nextProps.questionText &&
        prevProps.selectedValue === nextProps.selectedValue &&
        prevProps.user_choosed === nextProps.user_choosed &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.variant === nextProps.variant &&
        prevProps.options === nextProps.options &&
        prevProps.className === nextProps.className
    )
})

ExamQuestionCard.displayName = "ExamQuestionCard"

export default ExamQuestionCard
