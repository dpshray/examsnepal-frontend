'use client';
import Link from 'next/link';
import Image from 'next/image';
import {logo} from '../../../public/assest';
import {Button} from '@/components/ui/button';

import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter,} from 'react-icons/fa';
import {MdEmail, MdLocationOn, MdPhone} from 'react-icons/md';
import {CREATE_EXAM_LOGIN_ROUTE} from '@/config/app-constant';

const Footer = () => {
    const contactData = [
        {icon: MdEmail, text: 'info@examsnepal.com', href: 'mailto:info@examsnepal.com'},
        {icon: MdPhone, text: '+977 9802334171', href: 'tel:+9779802334171'},
        {icon: MdLocationOn, text: 'New Baneshwor, Kathmandu, Nepal', href: '#'},
    ];

    const socialIcons = [
        {name: 'Facebook', link: process.env.NEXT_PUBLIC_FACEBOOK_LINK, icon: FaFacebookF},
        {name: 'Instagram', link: process.env.NEXT_PUBLIC_INSTAGRAM_LINK, icon: FaInstagram},
        {name: 'LinkedIn', link: process.env.NEXT_PUBLIC_LINKEDIN_LINK, icon: FaLinkedinIn},
    ];

    // Removed from the footer (see nav/footer spec) — links were all "#" placeholders
    // (no real backlinks), kept here commented out rather than deleted so this is a
    // one-line revert if needed.
    // const lokSewaAyog = ['Kathmandu', 'Bagmati', 'Lumbini', 'Panchthar', 'Janakpur', 'Dhawalagiri'];

    const practiceFormats = [
        {label: 'Free Quiz', href: '/free-quiz'},
        {label: 'Sprint Quiz', href: '/sprint-quiz'},
        {label: 'Mock Test', href: '/mock-test'},
    ];

    // [PLACEHOLDER — CONFIRM WITH OWNER] picked as a reasonable spread across all 3 exam
    // categories in the absence of traffic analytics; swap in real high-traffic pages once available.
    const popularExams = [
        {label: 'Kharidar', href: '/exams/loksewa/kharidar'},
        {label: 'Section Officer', href: '/exams/loksewa/section-officer'},
        {label: 'Nepal Police', href: '/exams/loksewa/nepal-police'},
        {label: 'Banking Loksewa', href: '/exams/loksewa/banking-loksewa'},
        {label: 'IOE Entrance Exam', href: '/exams/entrance/ioe-entrance'},
        {label: 'Staff Nurse Licensing', href: '/exams/entrance/staff-nurse-licensing'},
        {label: 'NEC Civil Engineering', href: '/exams/nec-license/civil-engineering'},
    ];

    // Privacy Policy / Terms / Sitemap already live in the bottom links row below —
    // not duplicated here.
    const companyLinks = [
        {label: 'Exam Guidebook', href: '/blog'},
        {label: 'Institute Login', href: CREATE_EXAM_LOGIN_ROUTE},
    ];

    return (
        <footer className="bg-[#264653] text-white py-6">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
                    {/* Logo & About */}
                    <div className="md:w-1/3">
                        <Link href="/" className="inline-flex items-center mb-4">
                            <Image
                                src={logo}
                                alt="Exams Nepal Logo"
                                width={100}
                                height={100}
                                className="h-14 w-auto"
                                priority
                            />
                        </Link>
                        <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
                            Exams Nepal is a digital platform for conducting online examinations for different
                            levels in Nepal. We offer reliable exam solutions for individuals and institutions.
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex mt-4 gap-3">
                            {socialIcons.map(({name, link, icon: Icon}, idx) => (
                                <a
                                    key={idx}
                                    href={link}
                                    aria-label={`Follow us on ${name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-amber-50 rounded-full hover:bg-amber-200 transition"
                                >
                                    <Icon size={20} className="text-black"/>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Columns */}
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Contact Info */}
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                            <ul>
                                {contactData.map(({icon: Icon, text, href}, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 mt-2 text-sm text-gray-300 hover:text-white transition min-w-0"
                                    >
                                        <Icon size={20} className="mt-1 shrink-0"/>
                                        <a href={href} className="hover:underline break-words min-w-0">{text}</a>
                                    </li>
                                ))}

                            </ul>
                        </div>

                        {/* Removed: Lok Sewa Ayog block (see comment near lokSewaAyog above) */}

                        {/* Practice Formats */}
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold mb-3">Practice Formats</h3>
                            <ul>
                                {practiceFormats.map(({label, href}) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="block mt-2 text-sm text-gray-300 hover:text-white hover:underline transition"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Popular Exams */}
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold mb-3">Popular Exams</h3>
                            <ul>
                                {popularExams.map(({label, href}) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="block mt-2 text-sm text-gray-300 hover:text-white hover:underline transition"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold mb-3">More</h3>
                            <ul>
                                {companyLinks.map(({label, href}) => {
                                    const isExternal = href.startsWith('http');
                                    return (
                                        <li key={label}>
                                            {isExternal ? (
                                                <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block mt-2 text-sm text-gray-300 hover:text-white hover:underline transition"
                                                >
                                                    {label}
                                                </a>
                                            ) : (
                                                <Link
                                                    href={href}
                                                    className="block mt-2 text-sm text-gray-300 hover:text-white hover:underline transition"
                                                >
                                                    {label}
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="sm:col-span-2 lg:col-span-4">
                            <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
                            <p className="text-sm text-gray-300 mb-1">Opening Days: Monday – Friday</p>
                            <p className="text-sm text-gray-300">
                                Stay informed with the latest updates and announcements. Subscribe to our newsletter
                                today!
                            </p>

                            <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                                <label htmlFor="newsletter-email" className="block text-sm text-gray-200 mb-2">
                                    Email Address
                                </label>
                                <div className="flex w-full max-w-md">
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        required
                                        placeholder="example@examsnepal.com"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <Button
                                        type="submit"
                                        variant="default"
                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-none rounded-r-md hover:bg-green-700 transition"
                                    >
                                        Subscribe
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <hr className="border-gray-600 my-6"/>

                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 text-center">
                    <p className="text-center text-sm text-gray-300">
                        &copy; {new Date().getFullYear()} Exams Nepal. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <Link
                            href="/institute-api"
                            className="text-sm text-amber-300 hover:text-white transition font-medium"
                        >
                            Institute API Docs
                        </Link>
                        <span className="text-gray-500">|</span>
                        <Link
                            href="/privacy-policy"
                            className="text-sm text-gray-300 hover:text-white transition"
                        >
                            Privacy Policy
                        </Link>
                        <span className="text-gray-500">|</span>
                        <Link
                            href="/terms-and-conditions"
                            className="text-sm text-gray-300 hover:text-white transition"
                        >
                            Terms & Conditions
                        </Link>
                        <span className="text-gray-500">|</span>
                        <a
                            href="/sitemap.xml"
                            className="text-sm text-gray-300 hover:text-white transition"
                        >
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
