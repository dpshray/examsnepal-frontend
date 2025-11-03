'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface SearchBarProps {
    onSearchAction: (query: string) => void
    placeholder?: string
    loading?: boolean
    disabled?: boolean
    ariaLabel?: string
}

export function SearchBar({
                              onSearchAction,
                              placeholder = "Search by keyword or topic",
                              loading = false,
                              disabled = false,
                              ariaLabel = "Search input",
                          }: SearchBarProps) {
    const [query, setQuery] = useState("")

    const handleSearch = () => {
        const trimmed = query.trim()
        if (trimmed.length >= 3) {
            onSearchAction(trimmed)
        } else {
            toast.error("Please enter at least 3 characters")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSearch()
        }
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSearch()
            }}
            className="w-full max-w-xl mx-auto mt-6"
        >
            <div className="flex h-10 bg-white rounded-md shadow-md overflow-hidden">
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    aria-label={ariaLabel}
                    disabled={disabled || loading}
                    className="border-none h-10 focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow"
                />
                <Button
                    type="submit"
                    disabled={disabled || loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 h-10"
                >
                    {loading ? "Searching..." : "Search"}
                </Button>
            </div>
        </form>
    )
}
