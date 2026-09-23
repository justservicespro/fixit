// lib/constants.ts
// Shared constants used across both the legacy SPA (app/page.tsx) and the new
// real-route pages being migrated in. Single source of truth going forward.

export const WHATSAPP   = "https://wa.me/2348079926755";
export const PHONE      = "+234 807 992 6755";
export const EMAIL      = "info@justservices.pro";
export const CAC_NAME   = "JustServicesPro Management and Consulting Ltd";
export const CAC_RC     = "7965265";
export const SUCCESS_RATE = "97%";
export const YEARS_ACTIVE = "2+";

export const C = {
  navy: "#0B1E3D",
  navyDk: "#071428",
  blue: "#1A4A8A",
  blueLt: "#2563EB",
  steel: "#3B82F6",
  accent: "#E8F0FE",
  offWht: "#F8FAFF",
  slate: "#64748B",
  slateL: "#94A3B8",
  border: "#E2E8F0",
  dark: "#0F172A",
  success: "#10B981",
  warn: "#F59E0B",
  danger: "#EF4444",
  purple: "#7C3AED",
  green: "#059669",
};

export type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  status: "completed" | "ongoing";
  url: string;
  description: string;
  year: string;
  imageUrl: string;
  testimonial: string;
};

export const BLOG_IMG: Record<string, string> = {
  "Startup Tips": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
  "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  "Business Growth": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "Grants": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
  "Corporate Insights": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
  "default": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
};

export type BlogPost = {
  id: number;
  title: string;
  category: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  published: boolean;
  image: string;
};

export type CaseStudy = {
  id: number;
  client: string;
  title: string;
  challenge: string;
  solution: string;
  result: string;
  services: string[];
  url: string;
  imageUrl: string;
};

export type Grant = {
  id: number;
  name: string;
  org: string;
  amount: string;
  deadline: string;
  eligibility: string;
  link: string;
  category: string;
  active: boolean;
  imageUrl?: string;
};

export const SERVICES_LIST = [
  { icon: "building", title: "Business Registration & Compliance", desc: "CAC Registration, TIN, SCUML, Business Licenses, and complete corporate documentation.", tags: ["CAC", "TIN", "SCUML"], basePrice: 45000 },
  { icon: "code", title: "Website & App Development", desc: "Corporate websites, mobile applications, landing pages, and scalable web applications.", tags: ["Web", "Mobile", "SaaS"], basePrice: 150000 },
  { icon: "cloud", title: "Cloud Management Services", desc: "Business email setup, Google Workspace, Microsoft 365, and enterprise cloud storage.", tags: ["Cloud", "Email", "M365"], basePrice: 35000 },
  { icon: "users", title: "Corporate Administration & Training", desc: "Office support, staff training, digital literacy, and project management programs.", tags: ["Training", "Admin", "PMT"], basePrice: 80000 },
  { icon: "lightbulb", title: "Startup & Business Consulting", desc: "Business plans, grant proposals, loan documentation, and strategic startup advisory.", tags: ["Strategy", "Grants", "Loans"], basePrice: 120000 },
  { icon: "palette", title: "Branding & Digital Services", desc: "Graphics, social media branding, digital marketing, SEO, and content creation.", tags: ["Branding", "SEO", "Marketing"], basePrice: 60000 },
  { icon: "cpu", title: "AI & Technology Solutions", desc: "AI integration, workflow automation, intelligent chatbots, and productivity systems.", tags: ["AI", "Automation", "Bots"], basePrice: 200000 },
  { icon: "calendar", title: "Event & Equipment Solutions", desc: "Projector rental, presentation equipment, and comprehensive event support.", tags: ["Events", "Equipment", "AV"], basePrice: 25000 },
  { icon: "home", title: "Real Estate & Related Services", desc: "Property solutions, documentation assistance, and real estate advisory.", tags: ["Property", "Docs", "Advisory"], basePrice: 50000 },
];

export type Booking = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: "pending" | "confirmed" | "completed";
};

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidNGPhone = (phone: string): boolean => {
  if (!phone || !phone.trim()) return true; // phone often optional
  const cleaned = phone.replace(/[\s\-()]/g, "");
  const re = /^(\+?234|0)[789][01]\d{8}$/;
  return re.test(cleaned);
};
export const PRODUCTS_DATA=[
  {
    id:"certtrack",name:"CertTrack",tagline:"Cohort & Certificate Management for Training Providers",
    description:"CertTrack helps training providers run cohorts, track attendance, and issue QR-verified certificates that employers can confirm in seconds. Built for IT academies, corporate L&D, vocational schools, and bootcamps across Nigeria.",
    features:["Bulk cohort enrollment via CSV","One-click attendance tracking","QR-verified certificates — instant employer verification","Quiz builder with server-side auto-grading","Live session scheduling (Zoom/Meet)","Student self-service portal"],
    url:"https://certtrack.justservices.pro/",color:"#059669",gradient:"linear-gradient(135deg,#064E3B,#059669)",icon:"award",badge:"Certification Platform",
    img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",cta:"Launch CertTrack",
  },
  {
    id:"orgnexus",name:"OrgNexus",tagline:"Your Organization. Your Community. One Platform.",
    description:"OrgNexus gives churches, alumni networks, gyms, and nonprofits their own branded social space — members sign up, post, message, and belong, all under your own name and colors, with OrgNexus invisible underneath.",
    features:["Your brand, logo & accent color — not ours","One invite link brings every member in","Live feed with posts, comments & reactions","Direct one-to-one messaging between members","Admin dashboard — approve, moderate, remove","File sharing with previews, right on a post"],
    url:"https://orgnexus.justservices.pro/",color:"#6366F1",gradient:"linear-gradient(135deg,#1E1B4B,#6366F1)",icon:"users",badge:"Community Platform",
    img:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",cta:"Launch OrgNexus",
  },
  {
    id:"devtrac",name:"DevTrac",tagline:"Find It. Lock It. Get It Back.",
    description:"DevTrac tracks stolen phones in real time, locks them remotely, and files the paperwork — turning a lost device into a setback, not a loss. Live location, remote lock & wipe, and SIM-swap alerts on one console.",
    features:["Live tracking on a real-time map","Remote lock, alarm & wipe","One-click police incident report with IMEI","SIM-swap alerts before you're locked out","Free 7-day trial, no card required","Family plans covering up to 15 devices"],
    url:"https://devtrac.justservices.pro/",color:"#16A34A",gradient:"linear-gradient(135deg,#052e16,#16A34A)",icon:"shield",badge:"Device Recovery Console",
    img:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",cta:"Launch DevTrac",
  },
  {
    id:"prodoc",name:"ProDoc",tagline:"Professional Business Documents in Minutes",
    description:"ProDoc is Nigeria's professional business document generator. Create MoUs, NDAs, offer letters, invoices, board resolutions, and other corporate documents in minutes — properly formatted and ready to send.",
    features:["MoUs, NDAs & offer letters","Invoices & board resolutions","Nigerian business document formatting","Generated in minutes, ready to send","Reusable templates","Professional formatting throughout"],
    url:"https://prodoc.justservices.pro/",color:"#7C3AED",gradient:"linear-gradient(135deg,#4C1D95,#7C3AED)",icon:"filetext",badge:"Document Platform",
    img:"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",cta:"Launch ProDoc",
  },
  {
    id:"processa",name:"Processa",tagline:"Process Anything. Instantly.",
    description:"Processa is a free online toolkit for file conversion, PDF processing, image editing, QR codes, password generation, and developer utilities. No sign-up needed — upload, process, and download. Files are deleted within 1 hour.",
    features:["File conversion, PDF & image tools","QR code & password generators","JSON formatter, hash & encode tools","No account needed for free tools","Files auto-deleted within 1 hour","API access on paid plans"],
    url:"https://processa.justservices.pro/",color:"#059669",gradient:"linear-gradient(135deg,#064E3B,#059669)",icon:"zap",badge:"Free Online Toolkit",
    img:"https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=800&q=80",cta:"Launch Processa",
  },
  {
    id:"webman",name:"WebMan",tagline:"Your Business Website, Live in Minutes",
    description:"WebMan is Nigeria's fastest way to launch, host, and manage a professional business website — priced entirely in naira. Connect your code repository and WebMan handles building, SSL, domain connection, and deployment automatically. No developer or DevOps team required.",
    features:["Live in under 5 minutes — no DevOps needed","Free SSL certificate on every site, auto-renewed","Nigerian domains (.com, .ng, .com.ng) priced in naira","Auto-deploy on every update, instant rollbacks","Every site includes a secure Postgres database","99.9% uptime SLA across 70+ global edge locations"],
    url:"https://webman.justservices.pro/",color:"#1A4A8A",gradient:"linear-gradient(135deg,#071428,#1A4A8A)",icon:"globe",badge:"Web Hosting Platform",
    img:"https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",cta:"Launch WebMan",
  },
  {
    id:"appaholic",name:"Appaholic",tagline:"Mobile App Development Studio",
    description:"Appaholic is JustServicesPro's mobile app development studio. From native Android and iOS apps to cross-platform solutions — we design, build, and deploy professional mobile applications for Nigerian businesses, startups, and enterprises.",
    features:["Custom Android & iOS development","Cross-platform React Native/Flutter","App Store & Play Store publishing","Push notifications & real-time features","Payment integration (Paystack/Flutterwave)","Ongoing maintenance & updates"],
    url:"https://appaholic.justservices.pro/",color:"#7C3AED",gradient:"linear-gradient(135deg,#4C1D95,#7C3AED)",icon:"cpu",badge:"App Studio",
    img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",cta:"Launch Appaholic",
  },
  {
    id:"justbuys",name:"JustBuys",tagline:"Nigeria's Smart Marketplace",
    description:"JustBuys is Nigeria's smart marketplace for gadgets, digital products, and verified property deals — with pay-on-delivery in Abuja and free international shipping on AliExpress items.",
    features:["Gadgets, digital products & property deals","Pay on Delivery within Abuja","Free international shipping (AliExpress)","Verified property listings","Affiliate program — earn up to 25%","Instant digital product delivery"],
    url:"https://justbuys.deals",color:"#D97706",gradient:"linear-gradient(135deg,#78350F,#D97706)",icon:"cart",badge:"Marketplace",
    img:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",cta:"Visit JustBuys",
  },
  {
    id:"fixit",name:"FixIt Abuja",tagline:"Generator, Printer & Laptop Repair — Same Day",
    description:"FixIt Abuja dispatches vetted technicians to your home or office for generator, printer/photocopier, laptop, AC, and appliance repairs across the FCT — with a fair quote before any work begins.",
    features:["30–90 minute response time across Abuja FCT","6,200+ jobs completed, 4.8★ average rating","Generator, printer/photocopier & laptop repair","AC, fridge, inverter, UPS & CCTV repair","Fair quote before dispatch — no hidden charges","Service warranty on parts and labour"],
    url:"https://fixit.justservices.pro/",color:"#DC2626",gradient:"linear-gradient(135deg,#7F1D1D,#DC2626)",icon:"wrench",badge:"Repair Platform",
    img:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",cta:"Launch FixIt",
  },
  {
    id:"leadflo",name:"Leadflo",tagline:"Never Let a Lead Go Cold Again",isNew:true,
    description:"Leadflo is a lead capture and follow-up engine built for busy Nigerian sales teams. Pull leads from your website, WhatsApp, and social ads into one pipeline, score them automatically, and let scheduled follow-ups do the chasing — so no enquiry sits untouched for days.",
    features:["Capture leads from web forms, WhatsApp & ad platforms","Visual pipeline — drag leads through your own stages","Automatic lead scoring, hottest leads surface first","Scheduled WhatsApp & email follow-up sequences","Reminders before a lead goes cold","Team inboxes with assignment & activity history"],
    url:"https://leadflo.justservices.pro/",color:"#EC4899",gradient:"linear-gradient(135deg,#831843,#EC4899)",icon:"trendingUp",badge:"Lead Management Platform",
    img:"https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",cta:"Launch Leadflo",
  },
];
