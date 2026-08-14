'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, Building2, Search } from 'lucide-react'
import instituteService from '@/services/instituteService'
import { InstituteCard, InstituteCardSkeleton } from '@/components/card/InstituteCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CustomPagination from '@/components/Pagination'

interface InstituteItem {
    slug: string
    username: string
    fullname: string
    org: string | null
    logo: string | null
    location: string | null
    students_count: number
    average_rating: number | null
}

export default function InstitutesClient() {
    const [institutes, setInstitutes] = useState<InstituteItem[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchInstitutes = async (page: number = 1, searchTerm: string = '') => {
        try {
            setLoading(true)
            setError(null)
            const response = await instituteService.getAllInstitutes({ page, search: searchTerm || undefined })
            setInstitutes(response?.data?.data || [])
            setTotalPages(response?.data?.last_page || 0)
        } catch (error: any) {
            setError(error?.message || 'Failed to load institutes')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInstitutes(currentPage, search)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        setSearch(searchInput.trim())
    }

    const handleRetry = () => {
        fetchInstitutes(currentPage, search)
    }

    return (
        <section id="institutes" className="min-h-screen bg-white font-montserrat">
            {/* ── Hero Banner ── */}
            <div className="relative w-full bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 py-16 sm:py-20">
                <div className="flex flex-col items-center text-center px-4">
                    <Building2 className="h-10 w-10 text-white/80 mb-3" />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Institutes</h1>
                    <p className="mt-3 text-sm sm:text-lg text-green-100 max-w-xl">
                        Discover institutes and coaching centers offering classes, notes, and exams on ExamsNepal.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/institute-api"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-xs transition-colors"
                        >
                            <span>Institute API &amp; Website Integration Docs</span> →
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* ── Search ── */}
                <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-8 sm:mb-10 flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search institutes by name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 shrink-0">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                {/* ── Error with no institutes ── */}
                {error && institutes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                        <Building2 className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4" />
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Institutes Found</h3>
                        <p className="text-sm sm:text-base text-gray-500 text-center max-w-md px-4">
                            We couldn&#39;t load institutes right now. Please try again.
                        </p>
                        <Button variant="outline" onClick={handleRetry} className="mt-6">
                            Refresh
                        </Button>
                    </div>
                )}

                {/* ── Inline error banner (has stale institutes) ── */}
                {error && institutes.length > 0 && (
                    <div className="mb-8">
                        <Alert variant="destructive" className="max-w-2xl mx-auto">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between w-full">
                                <span>{error}</span>
                                <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4 h-8">
                                    Try Again
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* ── Loading ── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <InstituteCardSkeleton key={`skeleton-${i}`} />
                        ))}
                    </div>
                ) : !error && institutes.length === 0 ? (
                    /* ── Empty state ── */
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                        <Building2 className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4" />
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Institutes Found</h3>
                        <p className="text-sm sm:text-base text-gray-500 text-center max-w-md px-4">
                            {search
                                ? `No institutes matched "${search}". Try a different search.`
                                : "There are no institutes available at the moment. Please check back later."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                            {institutes.map((institute, index) => (
                                <motion.div
                                    key={`institute-card-${institute.slug}`}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
                                >
                                    <InstituteCard {...institute} />
                                </motion.div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8 sm:mt-10">
                                <CustomPagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    onPageChangeAction={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}
