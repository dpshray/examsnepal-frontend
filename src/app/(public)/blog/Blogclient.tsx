'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import blogService from '@/services/blogService';
import {BlogCard, BlogCardSkeleton} from '@/components/card/BlogCard';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {AlertTriangle, FileX} from 'lucide-react';
import {Button} from '@/components/ui/button';
import CustomPagination from '@/components/Pagination';

export default function BlogClient() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllBlogs = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await blogService.getAllBlogs(page);
            setBlogs(response?.data?.data || []);
            setTotalPages(Math.ceil((response?.data?.total || 0) / 10));
        } catch (error: any) {
            setError(error?.message || 'Failed to load blog posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBlogs(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRetry = () => {
        fetchAllBlogs(currentPage);
    };

    return (
        <section id="blog" className="min-h-screen bg-white font-montserrat">
            <div className="relative w-full h-64 sm:h-72">
                <Image
                    src="/banner.png"
                    alt="Featured blog header with digital solutions background"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 opacity-40"/>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center text-center px-4">
                        <p className="mt-4 text-sm sm:text-lg text-white">See our latest blog posts</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">Blog</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Explore Our Insights</h2>
                    <p className="mt-2 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl px-4">
                        Stay updated with our latest articles and insights on various topics.
                    </p>
                </div>

                {error && blogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                        <FileX className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4"/>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Blogs Found</h3>
                        <p className="text-sm sm:text-base text-gray-500 text-center max-w-md px-4">
                            We don&#39;t have any blog posts available at the moment. Please check back later.
                        </p>
                        <Button variant="outline" onClick={handleRetry} className="mt-6">
                            Refresh
                        </Button>
                    </div>
                )}

                {error && blogs.length > 0 && (
                    <div className="mb-8">
                        <Alert variant="destructive" className="max-w-2xl mx-auto">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertDescription className="flex items-center justify-between w-full">
                                <span>{error}</span>
                                <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4 h-8">
                                    Try Again
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {Array.from({length: 6}).map((_, i) => (
                            <BlogCardSkeleton key={`skeleton-${i}`}/>
                        ))}
                    </div>
                ) : !error && blogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                        <FileX className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4"/>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Blogs Found</h3>
                        <p className="text-sm sm:text-base text-gray-500 text-center max-w-md px-4">
                            We don&#39;t have any blog posts available at the moment. Please check back later.
                        </p>
                        <Button variant="outline" onClick={handleRetry} className="mt-6">
                            Refresh
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {blogs.map((post, index) => (
                                <motion.div
                                    key={`blog-card-${post.id || index}`}
                                    initial={{opacity: 0, y: 40}}
                                    whileInView={{opacity: 1, y: 0}}
                                    viewport={{once: true, amount: 0.3}}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <BlogCard
                                        title={post.title}
                                        description={post.excerpt || post.description || ''}
                                        imageUrl={post.imageUrl || '/blog-image.png'}
                                        author={{
                                            id: post.author?.id || 0,
                                            name: post.author?.username || 'Unknown',
                                            avatar: post.author?.avatar || '/avatar.png',
                                        }}
                                        publishedDate={post.publishedDate || 'N/A'}
                                        readTime={post.readTime || '1 min'}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8 sm:mt-10">
                            <CustomPagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChangeAction={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
