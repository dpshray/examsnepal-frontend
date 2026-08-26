"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  FileCode2,
  GraduationCap,
  Globe,
  HelpCircle,
  Key,
  Layers,
  Link2,
  Lock,
  MessageSquare,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "https://api.examsnepal.dworklabs.com/api";
const PORTAL_BASE_URL = "https://create.examsnepal.com/institute";
const SHOWCASE_BASE_URL = "https://www.examsnepal.com/institute";
const SANDBOX_TEST_KEY = "en_test_sandbox_demo_key";

export default function InstituteApiDocsClient() {
  const [instituteSlug, setInstituteSlug] = useState("examsnepal");
  const [activeLang, setActiveLang] = useState<"curl" | "javascript" | "react" | "php" | "python">("javascript");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const cleanSlug = instituteSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") || "examsnepal";

  const portalLink = `${PORTAL_BASE_URL}/${cleanSlug}`;
  const registerLink = `${PORTAL_BASE_URL}/${cleanSlug}?tab=register`;
  const profileApiUrl = `${API_BASE_URL}/institute/${cleanSlug}`;
  const reviewsApiUrl = `${API_BASE_URL}/institute/${cleanSlug}/reviews`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Sample JSON responses
  const sampleProfileResponse = JSON.stringify(
    {
      status: true,
      message: "Institute profile",
      data: {
        profile: {
          id: 1,
          fullname: "ExamsNepal Academy",
          org: "ExamsNepal Premier Institute",
          username: cleanSlug,
          slug: cleanSlug,
          email: "info@examsnepal.com",
          phone: "+977 9801234567",
          location: "Kathmandu, Nepal",
          logo: "https://api.examsnepal.dworklabs.com/storage/logos/examsnepal.png",
          banner_image: "https://api.examsnepal.dworklabs.com/storage/banners/examsnepal_banner.png",
          about: "Premier institute offering Lok Sewa, Banking, and Engineering competitive exam preparation with expert faculty.",
          facebook: "https://facebook.com/examsnepal",
          linkedin: "https://linkedin.com/company/examsnepal"
        },
        insights: {
          students_count: 340,
          published_exams_count: 48,
          average_rating: 4.8,
          reviews_count: 92
        },
        classes: [
          {
            id: 101,
            name: "Lok Sewa Section Officer (Kharidar / Nayab Subba) Regular Batch",
            slug: "lok-sewa-officer-batch-2026",
            target: "Lok Sewa Aayog",
            bio: "Complete syllabus coverage with live audio-video classes, daily test series, and comprehensive PDF study materials.",
            syllabus: "1. General Knowledge & Current Affairs\n2. Public Administration\n3. Governance & Constitution",
            price: 5500,
            duration_days: 90,
            exams_count: 24,
            notes_count: 42,
            meeting_links_count: 18,
            students_count: 125
          },
          {
            id: 102,
            name: "Nepal Rastra Bank (NRB Assistant Level 4) Fast Track",
            slug: "nrb-assistant-fast-track",
            target: "Banking Preparation",
            bio: "Targeted crash course with mock test simulations and doubt resolution sessions.",
            syllabus: "1. Financial Accounting\n2. Mathematics & IT\n3. General Banking Principles",
            price: 4500,
            duration_days: 60,
            exams_count: 16,
            notes_count: 28,
            meeting_links_count: 12,
            students_count: 89
          }
        ],
        sandbox_mode: false
      }
    },
    null,
    2
  );

  // Code snippets by language
  const codeSnippets = {
    curl: `# 1. Fetch institute profile, live classes & insights (Using Production Secret Key)
curl -X GET "${profileApiUrl}" \\
  -H "X-Institute-API-Key: en_sec_YOUR_PRODUCTION_SECRET_KEY" \\
  -H "Accept: application/json"

# 2. Or test immediately using the Developer Sandbox Key:
curl -X GET "${profileApiUrl}" \\
  -H "X-Institute-API-Key: ${SANDBOX_TEST_KEY}" \\
  -H "Accept: application/json"

# 3. Fetch student reviews & ratings
curl -X GET "${reviewsApiUrl}?page=1" \\
  -H "X-Institute-API-Key: en_sec_YOUR_PRODUCTION_SECRET_KEY" \\
  -H "Accept: application/json"`,

    javascript: `// Fetch your institute's live classes with API Secret Key authentication
async function loadInstituteData() {
  try {
    // Replace with your institute's secret key (from Institute Dashboard)
    // or use '${SANDBOX_TEST_KEY}' for sandbox testing.
    const API_KEY = 'en_sec_YOUR_PRODUCTION_SECRET_KEY';

    const response = await fetch('${profileApiUrl}', {
      headers: {
        'Accept': 'application/json',
        'X-Institute-API-Key': API_KEY
      }
    });
    
    const result = await response.json();
    if (!result.status) throw new Error(result.message || 'Failed to load institute data');
    
    const { profile, insights, classes, sandbox_mode } = result.data;
    
    console.log('Institute Name:', profile.org || profile.fullname);
    console.log('Total Enrolled Students:', insights.students_count);
    console.log('Available Classes:', classes);
    
    // Example: Render classes into an HTML element
    const listHtml = classes.map(c => \`
      <div class="class-card">
        <h3>\${c.name}</h3>
        <span class="badge">\${c.target}</span>
        <p>\${c.bio || ''}</p>
        <p><strong>Fee:</strong> \${c.price ? 'Rs. ' + c.price : 'Free'}</p>
        <a href="${portalLink}" target="_blank" rel="noopener noreferrer">Enroll Now →</a>
      </div>
    \`).join('');
    
    document.getElementById('classes-container').innerHTML = listHtml;
  } catch (error) {
    console.error('Error fetching institute classes:', error);
  }
}

loadInstituteData();`,

    react: `import React, { useEffect, useState } from 'react';

export function InstituteClassesWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set your production secret key from your environment or config
  const API_KEY = process.env.NEXT_PUBLIC_INSTITUTE_API_KEY || '${SANDBOX_TEST_KEY}';

  useEffect(() => {
    fetch('${profileApiUrl}', {
      headers: {
        'Accept': 'application/json',
        'X-Institute-API-Key': API_KEY
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.status) setData(json.data);
        else setError(json.message || 'Institute not found');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [API_KEY]);

  if (loading) return <div>Loading classes from ExamsNepal...</div>;
  if (error) return <div className="text-red-500">Failed to load: {error}</div>;

  return (
    <div className="examsnepal-classes-grid">
      <div className="institute-header">
        <h2>{data.profile.org || data.profile.fullname}</h2>
        <p>⭐ {data.insights.average_rating} ({data.insights.reviews_count} reviews) • {data.insights.students_count} Active Students</p>
      </div>

      <div className="classes-list">
        {data.classes.map((cls) => (
          <div key={cls.id} className="class-card">
            <span className="badge">{cls.target}</span>
            <h3>{cls.name}</h3>
            <p>{cls.bio}</p>
            <div className="class-meta">
              <span>📚 {cls.notes_count} Notes</span>
              <span>📝 {cls.exams_count} Exams</span>
              <span>💵 {cls.price ? \`Rs. \${cls.price.toLocaleString()}\` : 'Free'}</span>
            </div>
            <a 
              href="${portalLink}" 
              target="_blank" 
              rel="noopener noreferrer"
              className="enroll-btn"
            >
              Enroll & Take Tests →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}`,

    php: `<?php
// WordPress Shortcode or Plain PHP to display classes with API Secret Key

function get_examsnepal_institute_classes() {
    $url = '${profileApiUrl}';
    $api_key = 'en_sec_YOUR_PRODUCTION_SECRET_KEY'; // Or '${SANDBOX_TEST_KEY}' for testing
    
    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "Accept: application/json\r\n" .
                        "X-Institute-API-Key: " . $api_key . "\r\n"
        ]
    ];
    
    $context = stream_context_create($opts);
    $response = @file_get_contents($url, false, $context);
    
    if ($response === FALSE) {
        return '<p>Unable to load classes at the moment. Please verify your API key.</p>';
    }
    
    $data = json_decode($response, true);
    if (!isset($data['status']) || !$data['status']) {
        return '<p>Error: ' . htmlspecialchars($data['message'] ?? 'Unable to fetch classes') . '</p>';
    }
    
    $profile = $data['data']['profile'];
    $classes = $data['data']['classes'];
    
    $html = '<div class="examsnepal-widget">';
    $html .= '<h2>' . htmlspecialchars($profile['org'] ?? $profile['fullname']) . ' - Available Courses</h2>';
    $html .= '<div class="classes-row">';
    
    foreach ($classes as $class) {
        $html .= '<div class="class-item" style="border:1px solid #ddd; padding:16px; margin-bottom:12px; border-radius:8px;">';
        $html .= '<h3>' . htmlspecialchars($class['name']) . '</h3>';
        $html .= '<p>' . htmlspecialchars($class['bio'] ?? '') . '</p>';
        $html .= '<p><strong>Exams:</strong> ' . intval($class['exams_count']) . ' | <strong>Notes:</strong> ' . intval($class['notes_count']) . '</p>';
        $html .= '<a href="${portalLink}" target="_blank" rel="noopener noreferrer" style="background:#15803d; color:#fff; padding:8px 16px; text-decoration:none; border-radius:4px; display:inline-block;">Join Class & Take Tests</a>';
        $html .= '</div>';
    }
    
    $html .= '</div></div>';
    return $html;
}

// In WordPress functions.php:
// add_shortcode('examsnepal_classes', 'get_examsnepal_institute_classes');
?>`,

    python: `import requests

# Set your API Secret Key from Institute Dashboard
API_KEY = "en_sec_YOUR_PRODUCTION_SECRET_KEY"  # Or "${SANDBOX_TEST_KEY}"

headers = {
    "Accept": "application/json",
    "X-Institute-API-Key": API_KEY,
}

response = requests.get("${profileApiUrl}", headers=headers)
data = response.json()

if data.get("status"):
    profile = data["data"]["profile"]
    classes = data["data"]["classes"]
    print(f"Institute: {profile.get('org') or profile.get('fullname')}")
    print(f"Loaded {len(classes)} classes:")
    for cls in classes:
        print(f"- {cls['name']} (Fee: Rs. {cls.get('price', 0)})")
else:
    print(f"Error: {data.get('message')}")`
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-montserrat text-slate-900 dark:text-zinc-100">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-green-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-400/30 text-green-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Key size={14} className="text-amber-400" />
            <span>Secure API &amp; Website Integration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Integrate Your Classes &amp; Exams on <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-amber-200">Your Own Website</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            Display your live classes, mock tests, lecture notes, and student sign-up portal directly inside your custom website with end-to-end secret key validation.
          </p>

          {/* Dynamic Institute Slug Bar */}
          <div className="mt-10 max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-200 uppercase tracking-wide shrink-0">
              <Sparkles size={16} className="text-amber-300" />
              <span>Your Institute Slug:</span>
            </div>
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={instituteSlug}
                onChange={(e) => setInstituteSlug(e.target.value)}
                placeholder="e.g. examsnepal"
                className="w-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl text-sm font-mono border-0 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder:text-slate-400 shadow-inner"
              />
            </div>
            <div className="text-[11px] text-emerald-200 px-3 shrink-0 hidden md:block">
              Type your username to personalize all URLs &amp; code below
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Container ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ── Section 1: Authentication & Secret Key Layer ── */}
        <section id="authentication" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Key size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">1. API Secret Key Authentication Layer</h2>
              <p className="text-sm text-muted-foreground">
                All external API calls require your institute's secret key in the request header to prevent unauthorized access.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Live Production Secret Key Info */}
            <Card className="border border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/20 dark:to-zinc-900 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Lock size={16} className="text-green-600" />
                    Production API Secret Key
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-xs font-semibold">
                    Live Data
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Obtained only from your authenticated Institute Dashboard.
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
                <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 font-mono space-y-1">
                  <div className="text-[11px] text-muted-foreground">Header format:</div>
                  <div className="text-green-700 dark:text-green-400 font-semibold select-all">
                    X-Institute-API-Key: en_sec_YOUR_ACTIVE_SECRET_KEY
                  </div>
                </div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Generated uniquely per institute with 256-bit entropy.</li>
                  <li>
                    <strong>Rotatable on demand:</strong> You can regenerate your secret key anytime from your dashboard.
                  </li>
                  <li>
                    <strong>Instant invalidation:</strong> Old keys stop working immediately when regenerated.
                  </li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://create.examsnepal.com/api-settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 dark:text-green-400 hover:underline"
                  >
                    <span>Get or regenerate your key in Institute Dashboard</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Universal Sandbox Test Key */}
            <Card className="border border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-zinc-900 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Server size={16} className="text-blue-600" />
                    Developer Sandbox Test Key
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold">
                    Test Mode
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Universal key for developers to build &amp; test before production deployment.
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
                <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 font-mono space-y-1">
                  <div className="text-[11px] text-muted-foreground">Universal test key:</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-blue-700 dark:text-blue-400 font-bold select-all">
                      {SANDBOX_TEST_KEY}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(SANDBOX_TEST_KEY, "test-key")}
                      className="h-6 px-2 text-[11px]"
                    >
                      {copiedKey === "test-key" ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    </Button>
                  </div>
                </div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>No dashboard login required to start developing or prototyping.</li>
                  <li>Simulates real API structures with <code className="font-mono bg-blue-50 dark:bg-blue-950 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300">"sandbox_mode": true</code>.</li>
                  <li>Allows your external web agency or freelancer to build widgets without seeing your private key.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Section 2: Direct Website Links (Zero Code Required) ── */}
        <section id="direct-links" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600/10 text-green-700 dark:text-green-400">
              <Link2 size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">2. Direct Website Links (Zero Code Required)</h2>
              <p className="text-sm text-muted-foreground">
                Add ready-to-use buttons and navigation links on your website to direct your students seamlessly.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Portal Hub */}
            <Card className="border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300">
                    Main Student Portal
                  </Badge>
                  <a href={portalLink} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline flex items-center gap-1">
                    Open <ExternalLink size={12} />
                  </a>
                </div>
                <CardTitle className="text-lg font-bold mt-2">Institute Student Hub</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Branded landing page showing all your institute's classes, exams, reviews, and login/register tabs.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800">
                  <code className="text-xs font-mono text-slate-800 dark:text-zinc-200 truncate flex-1 select-all">
                    {portalLink}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(portalLink, "portal-link")}
                    className="shrink-0 h-8 px-2.5 text-xs flex items-center gap-1 font-semibold text-slate-800 dark:text-zinc-200 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50"
                  >
                    {copiedKey === "portal-link" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span>{copiedKey === "portal-link" ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Direct Register Link */}
            <Card className="border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
                    Instant Sign Up
                  </Badge>
                  <a href={registerLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline flex items-center gap-1">
                    Open <ExternalLink size={12} />
                  </a>
                </div>
                <CardTitle className="text-lg font-bold mt-2">Direct Registration Link</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Directs students straight to the registration form pre-selected for your institute.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800">
                  <code className="text-xs font-mono text-slate-800 dark:text-zinc-200 truncate flex-1 select-all">
                    {registerLink}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(registerLink, "reg-link")}
                    className="shrink-0 h-8 px-2.5 text-xs flex items-center gap-1 font-semibold text-slate-800 dark:text-zinc-200 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50"
                  >
                    {copiedKey === "reg-link" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span>{copiedKey === "reg-link" ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Section 3: REST API Reference (For Custom Sites & Apps) ── */}
        <section id="rest-api" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 dark:text-blue-400">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">3. REST API Endpoints (Live Classes &amp; Exams)</h2>
              <p className="text-sm text-muted-foreground">
                Fetch and render live classes, mock tests, fee structures, and reviews directly on your custom web application.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Endpoint 1: Profile & Classes */}
            <Card className="border border-slate-200/80 dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-green-600 text-white font-mono font-bold text-xs">
                    GET
                  </span>
                  <code className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-100">
                    /api/institute/{cleanSlug}
                  </code>
                  <Badge variant="outline" className="text-[11px] bg-amber-50 text-amber-800 border-amber-200">
                    Requires API Key
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Returns institute metadata, total students, average rating, and active class batches with exam counts and syllabi.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Required Headers:</div>
                  <div className="bg-slate-100 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-mono space-y-1">
                    <div><span className="text-purple-600 font-semibold">X-Institute-API-Key:</span> &lt;your_secret_key_or_test_key&gt;</div>
                    <div><span className="text-purple-600 font-semibold">Accept:</span> application/json</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Sample JSON Response:</div>
                  <div className="relative bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(sampleProfileResponse, "sample-json")}
                      className="absolute right-2 top-2 h-7 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      {copiedKey === "sample-json" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      <span className="ml-1 text-[10px]">{copiedKey === "sample-json" ? "Copied" : "Copy"}</span>
                    </Button>
                    <pre>{sampleProfileResponse}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endpoint 2: Reviews */}
            <Card className="border border-slate-200/80 dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-green-600 text-white font-mono font-bold text-xs">
                    GET
                  </span>
                  <code className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-100">
                    /api/institute/{cleanSlug}/reviews?page=1
                  </code>
                  <Badge variant="outline" className="text-[11px] bg-amber-50 text-amber-800 border-amber-200">
                    Requires API Key
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Returns paginated verified student ratings and feedback for your institute.
                </p>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* ── Section 4: Multi-Language Code Snippets ── */}
        <section id="code-samples" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/10 text-purple-700 dark:text-purple-400">
                <Code2 size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">4. Multi-Language Code Samples</h2>
                <p className="text-sm text-muted-foreground">
                  Copy and paste into your project. All URLs dynamically reflect your institute: <code className="font-mono font-bold text-green-700 dark:text-green-400">{cleanSlug}</code>.
                </p>
              </div>
            </div>

            {/* Language tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-zinc-900 rounded-xl border border-slate-300/60 dark:border-zinc-800 text-xs font-semibold">
              {(["javascript", "react", "php", "python", "curl"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeLang === lang
                      ? "bg-white dark:bg-zinc-800 text-green-700 dark:text-green-400 shadow-sm font-bold"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {lang === "curl" ? "cURL" : lang === "javascript" ? "JavaScript" : lang === "react" ? "React / Next.js" : lang === "php" ? "PHP / WordPress" : "Python"}
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Box */}
          <div className="relative rounded-2xl bg-slate-900 text-slate-100 p-5 font-mono text-xs border border-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 font-mono text-slate-300">
                  {activeLang === "curl" ? "terminal.sh" : activeLang === "javascript" ? "classes.js" : activeLang === "react" ? "InstituteClassesWidget.tsx" : activeLang === "php" ? "functions.php" : "fetch_classes.py"}
                </span>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(codeSnippets[activeLang], "code-sample")}
                className="h-7 px-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
              >
                {copiedKey === "code-sample" ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                <span>{copiedKey === "code-sample" ? "Copied" : "Copy Code"}</span>
              </Button>
            </div>

            <pre className="overflow-x-auto max-h-[420px] leading-relaxed text-emerald-300">
              {codeSnippets[activeLang]}
            </pre>
          </div>
        </section>

        {/* ── Section 5: Security Architecture & Anti-Hacking Guard ── */}
        <section id="security" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">5. Security Architecture &amp; Anti-Hacking Guard</h2>
              <p className="text-sm text-muted-foreground">
                How ExamsNepal safeguards your institute's data, student credentials, and test papers.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-slate-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
              <CardHeader className="pb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 mb-2">
                  <Key size={16} />
                </div>
                <CardTitle className="text-sm font-bold">API Key Validation</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Requests are authenticated with your active secret key. You can rotate keys anytime if compromised.
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
              <CardHeader className="pb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 mb-2">
                  <Lock size={16} />
                </div>
                <CardTitle className="text-sm font-bold">Zero Password Handling</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Your external website never touches or stores passwords. Students authenticate via secure JWT sessions on ExamsNepal.
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
              <CardHeader className="pb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 mb-2">
                  <Zap size={16} />
                </div>
                <CardTitle className="text-sm font-bold">Server Rate Limiting</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Enforced rate limits (60 requests/minute per IP) stop DDoS attacks, web scraping bots, and brute force attempts.
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
              <CardHeader className="pb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 mb-2">
                  <Shield size={16} />
                </div>
                <CardTitle className="text-sm font-bold">Read-Only Sanitization</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Only public course names, fees, and syllabi are exposed. Unpublished exam questions and student rosters remain strictly private.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Section 6: Need Assistance / Support ── */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-green-800 to-emerald-950 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
            <GraduationCap size={300} />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <h3 className="text-2xl font-bold">Need Help Integrating on Your Website?</h3>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Our technical team can help connect your website, configure WordPress shortcodes, or build custom widgets for your coaching center.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/contact-us">
                <Button className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs h-10 px-5 shadow-sm">
                  Contact Developer Support
                </Button>
              </Link>
              <a
                href="https://create.examsnepal.com/api-settings"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-emerald-800 hover:bg-emerald-700 text-white border border-white/40 font-semibold text-xs h-10 px-4 shadow-sm">
                  Open Institute Dashboard Key Settings
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
