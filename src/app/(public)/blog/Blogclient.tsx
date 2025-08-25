'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import {useEffect, useState} from 'react';
import blogService from '@/services/blogService';
import {BlogCard, BlogCardSkeleton} from '@/components/card/BlogCard';

export default function BlogClient() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllBlogs = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await blogService.getAllBlogs(page);
            setBlogs(response?.data?.data || []);
            setTotalPages(Math.ceil((response?.data?.total || 0) / 10));
        } catch (error) {
            console.error('Error fetching all blogs:', error);
            setError('Failed to load blog posts');
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

    return (
        <section id="blog" className="min-h-screen bg-white font-montserrat">
            <div className="relative w-full h-72">
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
                        <p className="mt-4 text-lg text-white">See our latest blog posts</p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">Blog</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col items-center text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Explore Our Insights</h2>
                    <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl">
                        Stay updated with our latest articles and insights on various topics.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading
                        ? Array.from({length: 6}).map((_, i) => <BlogCardSkeleton key={i}/>)
                        : blogs.map((post, index) => (
                            <motion.div
                                key={`blog-card-${index}`}
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

                {totalPages > 1 && (
                    <div className="container mx-auto flex justify-center mt-10">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
