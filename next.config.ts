import type {NextConfig} from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
    /* config options here */
    async redirects() {
        return [
            {
                source: '/student',
                destination: '/student/dashboard',
                permanent: true,
            },
            {
                source: '/student/exams',
                destination: '/student/exams/mock-tests',
                permanent: true,
            }

        ]
    },

    experimental: {
        optimizePackageImports: ['icon-library'],
    },
    images: {
        dangerouslyAllowLocalIP : isDev,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.examsnepal.dworklabs.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: "https",
                hostname: "flowbite.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "flowbite.s3.amazonaws.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.dummyjson.com",
                pathname: "/**",
            },
            {
                protocol: 'http',
                hostname: '192.168.100.18',
                port: '8000',
                pathname: '/**',
            },
        ]
    },
};

export default nextConfig;
