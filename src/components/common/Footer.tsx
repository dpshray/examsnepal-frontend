'use client';
import Link from 'next/link';
import Image from 'next/image';
import {logo} from '../../../public/assest';
import {Button} from '@/components/ui/button';

import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter,} from 'react-icons/fa';
import {MdEmail, MdLocationOn, MdPhone} from 'react-icons/md';

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


    const lokSewaAyog = ['Kathmandu', 'Bagmati', 'Lumbini', 'Panchthar', 'Janakpur', 'Dhawalagiri'];

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
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                            <ul>
                                {contactData.map(({icon: Icon, text, href}, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 mt-2 text-sm text-gray-300 hover:text-white transition"
                                    >
                                        <Icon size={20} className="mt-1 shrink-0"/>
                                        <a href={href} className="hover:underline">{text}</a>
                                    </li>
                                ))}

                            </ul>
                        </div>

                        {/* Lok Sewa Ayog */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Lok Sewa Ayog</h3>
                            <ul>
                                {lokSewaAyog.map((name, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            className="block mt-2 text-sm text-gray-300 hover:text-white hover:underline transition"
                                        >
                                            {name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="col-span-2">
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
                    <div className="flex items-center gap-4">
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
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
