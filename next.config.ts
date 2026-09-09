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
            },

            // Exam-guide taxonomy migration (loksewa/entrance/nec-license ->
            // Medical/Paramedical/Engineering/Management/Agriculture/Law/Others).
            // Every guide that changed category gets its own redirect so
            // existing indexed URLs/backlinks don't 404. All 5 nec-license
            // guides moved to /exams/engineering/{same-slug}, so that's a
            // clean category-level redirect; loksewa and entrance guides
            // scattered across multiple new categories, so those need
            // per-guide redirects instead of one category-level rule.
            {
                source: '/exams/nec-license/:slug',
                destination: '/exams/engineering/:slug',
                permanent: true,
            },
            { source: '/exams/loksewa/kharidar', destination: '/exams/others/kharidar', permanent: true },
            { source: '/exams/loksewa/nayab-subba', destination: '/exams/others/nayab-subba', permanent: true },
            { source: '/exams/loksewa/section-officer', destination: '/exams/others/section-officer', permanent: true },
            { source: '/exams/loksewa/teacher-service-commission-primary', destination: '/exams/others/teacher-service-commission-primary', permanent: true },
            { source: '/exams/loksewa/nepal-police', destination: '/exams/others/nepal-police', permanent: true },
            { source: '/exams/loksewa/banking-loksewa', destination: '/exams/others/banking-loksewa', permanent: true },
            { source: '/exams/loksewa/assistant-sahayak', destination: '/exams/others/assistant-sahayak', permanent: true },
            { source: '/exams/loksewa/computer-operator', destination: '/exams/others/computer-operator', permanent: true },
            { source: '/exams/loksewa/nepal-army-sainya', destination: '/exams/others/nepal-army-sainya', permanent: true },
            { source: '/exams/loksewa/armed-police-force', destination: '/exams/others/armed-police-force', permanent: true },
            { source: '/exams/loksewa/nepal-health-service-staff-nurse', destination: '/exams/medical/nepal-health-service-staff-nurse', permanent: true },
            { source: '/exams/loksewa/engineering-service-loksewa', destination: '/exams/engineering/engineering-service-loksewa', permanent: true },
            { source: '/exams/loksewa/agriculture-service-loksewa', destination: '/exams/agriculture/agriculture-service-loksewa', permanent: true },
            { source: '/exams/entrance/ioe-entrance', destination: '/exams/engineering/ioe-entrance', permanent: true },
            { source: '/exams/entrance/ioe-msc-engineering', destination: '/exams/engineering/ioe-msc-engineering', permanent: true },
            { source: '/exams/entrance/mecee-bl-mbbs-bds', destination: '/exams/medical/mecee-bl-mbbs-bds', permanent: true },
            { source: '/exams/entrance/staff-nurse-licensing', destination: '/exams/medical/staff-nurse-licensing', permanent: true },
            { source: '/exams/entrance/mecee-pg-md-ms', destination: '/exams/medical/mecee-pg-md-ms', permanent: true },
            { source: '/exams/entrance/mds-dental', destination: '/exams/medical/mds-dental', permanent: true },
            { source: '/exams/entrance/cmat-management', destination: '/exams/management/cmat-management', permanent: true },
            { source: '/exams/entrance/mbs-mba-entrance', destination: '/exams/management/mbs-mba-entrance', permanent: true },
            { source: '/exams/entrance/iaas-veterinary-entrance', destination: '/exams/agriculture/iaas-veterinary-entrance', permanent: true },
            { source: '/exams/entrance/afu-agriculture-forestry-entrance', destination: '/exams/agriculture/afu-agriculture-forestry-entrance', permanent: true },
            { source: '/exams/entrance/llb-entrance', destination: '/exams/law/llb-entrance', permanent: true },
            { source: '/exams/entrance/bed-med-entrance', destination: '/exams/others/bed-med-entrance', permanent: true },
            // Old category hubs: loksewa/entrance guides scattered across
            // several new categories, so there's no single correct
            // destination - send visitors to the full directory instead.
            { source: '/exams/loksewa', destination: '/exams', permanent: true },
            { source: '/exams/entrance', destination: '/exams', permanent: true },
        ]
    },

    async rewrites() {
        return [
            // /sitemap.xml lives internally at /sitemap-index.xml (see that
            // route's comment) to avoid colliding with generateSitemaps()'s
            // own /sitemap/[__metadata_id__] routing. This keeps the public
            // URL the standard /sitemap.xml that crawlers/tools expect.
            {
                source: '/sitemap.xml',
                destination: '/sitemap-index.xml',
            },
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
                hostname: 'localhost',
                port: '8000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '192.168.100.18',
                port: '8000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '192.168.1.68',
                port: '8001',
                pathname: '/**',
            },
        ]
    },
};

export default nextConfig;
