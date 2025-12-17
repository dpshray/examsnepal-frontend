"use client"

import { useState } from "react"
import {
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  Shield,
  Eye,
  Lock,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>("")

  const sections = [
    { id: "interpretation", title: "Interpretation and Definitions", icon: FileText },
    { id: "collecting", title: "Collecting and Using Your Personal Data", icon: Eye },
    { id: "security", title: "Security of Your Personal Data", icon: Shield },
    { id: "children", title: "Children's Privacy", icon: Users },
    { id: "contact", title: "Contact Us", icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Your Privacy Matters</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            We are committed to protecting your personal information and being transparent about how we collect, use,
            and share your data.
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: August 25, 2025</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <Link
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                          activeSection === section.id
                            ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-2">{section.title}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
              {/* Introduction */}
              <div className="prose prose-slate max-w-none mb-12">
                <p className="text-lg text-slate-700 leading-relaxed">
                  This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of
                  Your information when You use the Service and tells You about Your privacy rights and how the law
                  protects You.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  We use Your Personal data to provide and improve the Service. By using the Service, You agree to the
                  collection and use of information in accordance with this Privacy Policy.
                </p>
              </div>

              {/* Interpretation and Definitions */}
              <section id="interpretation" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Interpretation and Definitions
                </h2>

                <h3 className="text-xl font-semibold text-slate-800 mb-4">Interpretation</h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  The words of which the initial letter is capitalized have meanings defined under the following
                  conditions. The following definitions shall have the same meaning regardless of whether they appear in
                  singular or in plural.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 mb-4">Definitions</h3>
                <p className="text-slate-700 mb-4">For the purposes of this Privacy Policy:</p>

                <div className="grid gap-4">
                  {[
                    {
                      term: "Account",
                      definition:
                        "means a unique account created for You to access our Service or parts of our Service.",
                    },
                    {
                      term: "Affiliate",
                      definition:
                        'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                    },
                    {
                      term: "Company",
                      definition:
                        '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Exams Nepal Pvt. Ltd, New Baneshwor, Kathmandu, Nepal.',
                    },
                    {
                      term: "Cookies",
                      definition:
                        "are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
                    },
                    { term: "Country", definition: "refers to: Nepal" },
                    {
                      term: "Device",
                      definition:
                        "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                    },
                    {
                      term: "Personal Data",
                      definition: "is any information that relates to an identified or identifiable individual.",
                    },
                    { term: "Service", definition: "refers to the Website." },
                    { term: "Website", definition: "refers to examsnepal, accessible from https://examsnepal.com/" },
                    {
                      term: "You",
                      definition:
                        "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <dt className="font-semibold text-slate-900 mb-1">{item.term}</dt>
                      <dd className="text-slate-700">
                        {item.term === "Website" ? (
                            <>
                            refers to examsnepal, accessible from{" "}
                            <Link
                                href="https://examsnepal.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                https://examsnepal.com/
                            </Link>
                            </>
                        ) : (
                            item.definition
                        )}
                        </dd>
                    </div>
                  ))}
                </div>
              </section>

              {/* Data Collection */}
              <section id="collecting" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                  Collecting and Using Your Personal Data
                </h2>

                <h3 className="text-xl font-semibold text-slate-800 mb-4">Types of Data Collected</h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Personal Data</h4>
                  <p className="text-blue-800 mb-4">
                    While using Our Service, We may ask You to provide Us with certain personally identifiable
                    information that can be used to contact or identify You. This may include:
                  </p>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Email address
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      First name and last name
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Phone number
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Address, State, Province, ZIP/Postal code, City
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Usage Data
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-green-900 mb-3">Usage Data</h4>
                  <p className="text-green-800 mb-4">
                    Usage Data is collected automatically when using the Service and may include information such as
                    Your Device&apos;s Internet Protocol address, browser type, browser version, the pages of our Service
                    that You visit, the time and date of Your visit, and other diagnostic data.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-purple-900 mb-3">Third-Party Social Media Services</h4>
                  <p className="text-purple-800 mb-4">
                    The Company allows You to create an account and log in through:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Google", "Facebook", "Instagram", "Twitter", "LinkedIn"].map((platform) => (
                      <span key={platform} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 mb-4">Use of Your Personal Data</h3>
                <p className="text-slate-700 mb-4">The Company may use Personal Data for the following purposes:</p>

                <div className="grid gap-3">
                  {[
                    "To provide and maintain our Service",
                    "To manage Your Account and registration",
                    "For the performance of a contract",
                    "To contact You with updates and communications",
                    "To provide You with news and special offers",
                    "To manage Your requests",
                    "For business transfers",
                    "For data analysis and service improvement",
                  ].map((purpose, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{purpose}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Security */}
              <section id="security" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Security of Your Personal Data
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <p className="text-amber-800">
                    The security of Your Personal Data is important to Us, but remember that no method of transmission
                    over the Internet, or method of electronic storage is 100% secure. While We strive to use
                    commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute
                    security.
                  </p>
                </div>
              </section>

              {/* Children's Privacy */}
              <section id="children" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Children&apos;s Privacy
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-800 mb-4">
                    Our Service does not address anyone under the age of 13. We do not knowingly collect personally
                    identifiable information from anyone under the age of 13.
                  </p>
                  <p className="text-red-800">
                    If You are a parent or guardian and You are aware that Your child has provided Us with Personal
                    Data, please contact Us. If We become aware that We have collected Personal Data from anyone under
                    the age of 13 without verification of parental consent, We take steps to remove that information
                    from Our servers.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Contact Us
                </h2>
                <p className="text-slate-700 mb-6">
                  If you have any questions about this Privacy Policy, You can contact us:
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-blue-900 mb-2">Email</h4>
                    <Link
                      href="mailto:info@examsnepal.com"
                      className="text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      info@examsnepal.com
                    </Link>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-green-900 mb-2">Phone</h4>
                    <Link href="tel:9802334171" className="text-green-700 hover:text-green-800 transition-colors">
                      9802334171
                    </Link>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                    <ExternalLink className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-purple-900 mb-2">Website</h4>
                    <Link
                      href="https://examsnepal.com/contact-us"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 hover:text-purple-800 transition-colors"
                    >
                      Contact Page
                    </Link>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="border-t border-slate-200 pt-8 mt-12">
                <div className="text-center text-slate-500">
                  <p className="mb-2">© 2025 Exams Nepal Pvt. Ltd. All rights reserved.</p>
                  <p className="text-sm">This privacy policy is effective as of August 25, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
