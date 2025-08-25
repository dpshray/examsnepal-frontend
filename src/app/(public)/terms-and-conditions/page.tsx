"use client"

import { useState } from "react"
import {
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  Shield,
  FileText,
  AlertCircle,
  Users,
  Ban,
  Scale,
  Globe,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState<string>("")

  const sections = [
    { id: "interpretation", title: "Interpretation and Definitions", icon: FileText },
    { id: "acknowledgment", title: "Acknowledgment", icon: BookOpen },
    { id: "links", title: "Links to Other Websites", icon: ExternalLink },
    { id: "termination", title: "Termination", icon: Ban },
    { id: "disclaimer", title: "Disclaimer", icon: AlertCircle },
    { id: "governing-law", title: "Governing Law", icon: Scale },
    { id: "disputes", title: "Disputes Resolution", icon: Users },
    { id: "severability", title: "Severability and Waiver", icon: Shield },
    { id: "translation", title: "Translation Interpretation", icon: Globe },
    { id: "changes", title: "Changes to These Terms", icon: Calendar },
    { id: "contact", title: "Contact Us", icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Scale className="w-4 h-4" />
            Terms and Conditions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            Please read these Terms and Conditions carefully before using our Service. Your access and use of the
            Service is conditioned on your acceptance of these Terms.
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
                            ? "bg-green-50 text-green-700 border-l-2 border-green-500"
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
                  These Terms and Conditions (&quot;Terms&quot;, &quot;Terms and Conditions&quot;) govern Your relationship with Exams Nepal
                  website (the &quot;Service&quot;) operated by Exams Nepal Pvt. Ltd (&quot;Us&quot;, &quot;We&quot;, or &quot;Our&quot;).
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                    These Terms and Conditions outline the rules and regulations for the use of Exams Nepal Pvt. Ltd&apos;s
                    Website, located at {""}
                    <Link
                        href="https://examsnepal.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        https://examsnepal.com/
                    </Link>  
                    . By accessing this website, we assume you accept these
                    terms and conditions. Do not continue to use Exams Nepal if you do not agree to take all of the terms
                    and conditions stated on this page.
                </p>
              </div>

              {/* Interpretation and Definitions */}
              <section id="interpretation" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-600" />
                  Interpretation and Definitions
                </h2>

                <h3 className="text-xl font-semibold text-slate-800 mb-4">Interpretation</h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  The words of which the initial letter is capitalized have meanings defined under the following
                  conditions. The following definitions shall have the same meaning regardless of whether they appear in
                  singular or in plural.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 mb-4">Definitions</h3>
                <p className="text-slate-700 mb-4">For the purposes of these Terms and Conditions:</p>

                <div className="grid gap-4">
                  {[
                    {
                      term: "Affiliate",
                      definition:
                        'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                    },
                    {
                      term: "Country",
                      definition: "refers to: Nepal",
                    },
                    {
                      term: "Company",
                      definition:
                        '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Exams Nepal Pvt. Ltd, Kathmandu 44600.',
                    },
                    {
                      term: "Device",
                      definition:
                        "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                    },
                    {
                      term: "Service",
                      definition: "refers to the Website.",
                    },
                    {
                      term: "Terms and Conditions",
                      definition:
                        '(also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.',
                    },
                    {
                      term: "Third-party Social Media Service",
                      definition:
                        "means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.",
                    },
                    {
                      term: "Website",
                      definition: "refers to Exams Nepal, accessible from https://examsnepal.com/",
                    },
                    {
                      term: "You",
                      definition:
                        "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4 border-l-4 border-green-500">
                      <dt className="font-semibold text-slate-900 mb-1">{item.term}</dt>
                      <dd className="text-slate-700">
                        {item.term === "Website" ? (
                            <>
                            refers to examsnepal, accessible from{" "}
                            <Link
                                href="https://examsnepal.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:underline font-medium"
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

              {/* Acknowledgment */}
              <section id="acknowledgment" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  Acknowledgment
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-green-800 mb-4">
                    These are the Terms and Conditions governing the use of this Service and the agreement that operates
                    between You and the Company. These Terms and Conditions set out the rights and obligations of all
                    users regarding the use of the Service.
                  </p>
                  <p className="text-green-800 mb-4">
                    Your access to and use of the Service is conditioned on Your acceptance of and compliance with these
                    Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access
                    or use the Service.
                  </p>
                  <p className="text-green-800">
                    By accessing or using the Service You agree to be bound by these Terms and Conditions. If You
                    disagree with any part of these terms and conditions then You may not access the Service.
                  </p>
                </div>
              </section>

              {/* Links to Other Websites */}
              <section id="links" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <ExternalLink className="w-6 h-6 text-green-600" />
                  Links to Other Websites
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-800 mb-4">
                    Our Service may contain links to third-party web sites or services that are not owned or controlled
                    by the Company.
                  </p>
                  <p className="text-blue-800 mb-4">
                    The Company has no control over, and assumes no responsibility for, the content, privacy policies,
                    or practices of any third party web sites or services. You further acknowledge and agree that the
                    Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or
                    alleged to be caused by or in connection with the use of or reliance on any such content, goods or
                    services available on or through any such web sites or services.
                  </p>
                  <p className="text-blue-800">
                    We strongly advise You to read the terms and conditions and privacy policies of any third-party web
                    sites or services that You visit.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section id="termination" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Ban className="w-6 h-6 text-green-600" />
                  Termination
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-800 mb-4">
                    We may terminate or suspend Your access immediately, without prior notice or liability, for any
                    reason whatsoever, including without limitation if You breach the Terms and Conditions.
                  </p>
                  <p className="text-red-800">
                    Upon termination, Your right to use the Service will cease immediately.
                  </p>
                </div>
              </section>

              {/* Disclaimer */}
              <section id="disclaimer" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                  Disclaimer
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <p className="text-amber-800 mb-4">
                    The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by
                    law, this Company:
                  </p>
                  <ul className="space-y-2 text-amber-800 mb-4">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Excludes all representations and warranties relating to this website and its contents
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Excludes all liability for damages arising out of or in connection with your use of this website
                    </li>
                  </ul>
                  <p className="text-amber-800">
                    Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would
                    be unlawful to exclude or limit.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section id="governing-law" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Scale className="w-6 h-6 text-green-600" />
                  Governing Law
                </h2>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <p className="text-purple-800">
                    The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use
                    of the Service. Your use of the Application may also be subject to other local, state, national, or
                    international laws.
                  </p>
                </div>
              </section>

              {/* Disputes Resolution */}
              <section id="disputes" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-600" />
                  Disputes Resolution
                </h2>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <p className="text-indigo-800">
                    If You have any concern or dispute about the Service, You agree to first try to resolve the dispute
                    informally by contacting the Company.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                  Changes to These Terms and Conditions
                </h2>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                  <p className="text-cyan-800 mb-4">
                    We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a
                    revision is material We will make reasonable efforts to provide at least 30 days notice prior to any
                    new terms taking effect.
                  </p>
                  <p className="text-cyan-800">
                    By continuing to access or use Our Service after those revisions become effective, You agree to be
                    bound by the revised terms.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-green-600" />
                  Contact Us
                </h2>
                <p className="text-slate-700 mb-6">
                  If you have any questions about these Terms and Conditions, You can contact us:
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-green-900 mb-2">Email</h4>
                    <Link
                      href="mailto:info@examsnepal.com"
                      className="text-green-700 hover:text-green-800 transition-colors"
                    >
                      info@examsnepal.com
                    </Link>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-blue-900 mb-2">Phone</h4>
                    <Link href="tel:9802334171" className="text-blue-700 hover:text-blue-800 transition-colors">
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
                  <p className="text-sm">These terms and conditions are effective as of August 25, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
