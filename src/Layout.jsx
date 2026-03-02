import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Calendar, Users, User, MessageCircle, Bell, Menu } from "lucide-react";
import RightSidebar from "./components/layout/RightSidebar";
import DesktopHeader from "./components/layout/DesktopHeader";
import DesktopSidebar from "./components/layout/DesktopSidebar";
import { User as UserEntity } from "@/entities/User";

// Pages that NEVER need auth — render immediately with public layout
const PUBLIC_PAGES = [
  "LandingPage", "AboutUs", "TermsAndConditions", "PrivacyPolicy",
  "HelpAndReportContent", "DonationSupport",
  "MediaLibrary", "Events", "EjaraServices", "Istikhara", "FindMaulana"
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await UserEntity.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();

    // Handle window resize for responsive layout
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pages where bottom navigation should be hidden
  const hideBottomNavPages = ["Splash", "Intro", "Onboarding", "QuestionDetail", "GoLive"];
  const shouldHideBottomNav = hideBottomNavPages.includes(currentPageName);

  // Public pages accessible without login (desktop web)
  const PUBLIC_PAGES = [
    "LandingPage", "AboutUs", "TermsAndConditions", "PrivacyPolicy",
    "HelpAndReportContent", "DonationSupport",
    "MediaLibrary", "Events", "EjaraServices", "Istikhara", "FindMaulana"
  ];
  const isPublicPage = PUBLIC_PAGES.includes(currentPageName);

  // Full-screen pages (no layout)
  if (currentPageName === "Splash" || currentPageName === "Intro" || currentPageName === "Onboarding" || currentPageName === "LandingPage") {
    return children;
  }

  // Public pages wrap with PublicPageLayout (header+footer, no auth needed)
  if (isDesktop && !currentUser && isPublicPage) {
    const PublicPageLayout = React.lazy(() => import('./components/landing/PublicPageLayout'));
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="text-emerald-600 text-lg">Loading...</div></div>}>
        <PublicPageLayout showLoginBanner={true}>{children}</PublicPageLayout>
      </React.Suspense>
    );
  }

  // Redirect non-authenticated desktop users to Landing Page for protected pages
  if (isDesktop && !currentUser) {
    const LandingPage = React.lazy(() => import('./pages/LandingPage'));
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-emerald-600 text-lg">Loading Zahoor...</div>
      </div>}>
        <LandingPage />
      </React.Suspense>
    );
  }

  // Desktop Layout with Sidebar & Header (≥1024px - authenticated users only)
  if (isDesktop && currentUser) {
    return (
      <div className="min-h-screen bg-emerald-50 dark:bg-gray-900">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');
          
          .font-quranic, .font-arabic {
            font-family: 'Amiri Quran', 'Scheherazade New', serif;
            line-height: 2.2;
            letter-spacing: 0.02em;
          }

          .font-arabic-large {
            font-family: 'Amiri Quran', 'Scheherazade New', serif;
            line-height: 2.5;
            letter-spacing: 0.03em;
          }

          .font-arabic-title {
            font-family: 'Amiri Quran', 'Scheherazade New', serif;
            line-height: 1.8;
            letter-spacing: 0.01em;
          }

          :root {
            --bg-primary: #f0fdf6;
            --bg-secondary: #ffffff;
            --bg-accent: #ddfbeb;
            --text-primary: #165135;
            --text-secondary: #187d4c;
            --text-accent: #1b9e5d;
            --border-primary: #bdf5d9;
            --border-secondary: #ddfbeb;
            --heading-color: #19623f;
            --primary-emerald: #2bd27f;
            --accent-emerald: #4fd994;
            --muted-emerald: #1b9e5d;
            --light-emerald: #ddfbeb;
            --white-bg: #ffffff;
            --text-muted: #4b5563;
          }

          .dark {
            --bg-primary: #0d1a14;
            --bg-secondary: #11221c;
            --bg-accent: #1a382a;
            --text-primary: #e6f9f0;
            --text-secondary: #a7f3d0;
            --text-accent: #6ee7b7;
            --border-primary: #2d5a47;
            --border-secondary: #244838;
            --heading-color: #d1fae5;
            --primary-emerald: #34d399;
            --accent-emerald: #10b981;
            --muted-emerald: #065f46;
            --light-emerald: #1a382a;
            --white-bg: #11221c;
            --text-muted: #9ca3af;
          }
          
          body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
          }

          h1, h2, h3, h4, h5, h6 {
            color: var(--heading-color);
          }
        `}</style>

        <DesktopHeader />
        <DesktopSidebar />
        
        <main className="ml-64 mt-[73px] min-h-screen">
          <div className="max-w-[1600px] mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    );
  }

  const navItems = [
  { name: "Home", icon: Home, path: "Home" },
  { name: "Events", icon: Calendar, path: "Events" },
  { name: "Nearby", icon: Users, path: "Nearby" },
  { name: "Ask", icon: MessageCircle, path: "Questions" },
  { name: "Profile", icon: User, path: "Profile" }];


  const isActive = (path) => location.pathname === createPageUrl(path);

  // Mobile Layout (<1024px)
  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-900 dark:bg-gray-900 dark:text-emerald-100 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');
        
        .font-quranic, .font-arabic {
          font-family: 'Amiri Quran', 'Scheherazade New', serif;
          line-height: 2.2;
          letter-spacing: 0.02em;
        }

        .font-arabic-large {
          font-family: 'Amiri Quran', 'Scheherazade New', serif;
          line-height: 2.5;
          letter-spacing: 0.03em;
        }

        .font-arabic-title {
          font-family: 'Amiri Quran', 'Scheherazade New', serif;
          line-height: 1.8;
          letter-spacing: 0.01em;
        }

        @keyframes aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* --- NEW THEME VARIABLES --- */
        :root {
          /* Semantic colors for light mode */
          --bg-primary: #f0fdf6;     /* Equivalent to --color-emerald-50 */
          --bg-secondary: #ffffff;   /* Equivalent to --white-bg */
          --bg-accent: #ddfbeb;      /* Equivalent to --color-emerald-100 */
          --text-primary: #165135;   /* Equivalent to --color-emerald-900 */
          --text-secondary: #187d4c;  /* Equivalent to --color-emerald-700 */
          --text-accent: #1b9e5d;    /* Equivalent to --color-emerald-600 */
          --border-primary: #bdf5d9; /* Equivalent to --color-emerald-200 */
          --border-secondary: #ddfbeb;/* Equivalent to --color-emerald-100 */
          --heading-color: #19623f;  /* Equivalent to --color-emerald-800 */

          /* Legacy mappings for light mode (used by existing components and classes) */
          --primary-emerald: #2bd27f; /* Equivalent to --color-emerald-500 */
          --accent-emerald: #4fd994;  /* Equivalent to --color-emerald-400 */
          --muted-emerald: #1b9e5d;   /* Equivalent to --color-emerald-600 */
          --light-emerald: #ddfbeb;   /* Equivalent to --color-emerald-100 */
          --white-bg: #ffffff;
          --text-muted: #4b5563; /* From original .text-gray-300 etc. */
        }

        .dark {
          /* Semantic colors for dark mode */
          --bg-primary: #0d1a14;
          --bg-secondary: #11221c;
          --bg-accent: #1a382a;
          --text-primary: #e6f9f0;
          --text-secondary: #a7f3d0;
          --text-accent: #6ee7b7;
          --border-primary: #2d5a47;
          --border-secondary: #244838;
          --heading-color: #d1fae5;

          /* Legacy mappings for dark mode */
          --primary-emerald: #34d399; /* A vibrant emerald for dark mode */
          --accent-emerald: #10b981;  /* A slightly darker emerald */
          --muted-emerald: #065f46;   /* A darker, muted emerald */
          --light-emerald: #1a382a;   /* Similar to --bg-accent for dark */
          --white-bg: #11221c;        /* Similar to --bg-secondary for dark */
          --text-muted: #9ca3af; /* Dark gray for dark mode */
        }
        /* --- END NEW THEME VARIABLES --- */
        
        body {
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }

        .liquid-aurora-bg {
          background: var(--bg-primary); /* Updated to use semantic variable */
        }
        
        .accent-text {
          color: var(--heading-color);
          text-shadow: 0 0 8px rgba(25, 98, 63, 0.3);
        }
        
        .emerald-accent {
            color: var(--primary-emerald);
            text-shadow: 0 0 8px rgba(27, 158, 93, 0.4);
        }

        .glassmorphism {
          background: var(--bg-secondary);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-secondary);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }

        .primary-btn {
            background-image: linear-gradient(to right, var(--primary-emerald) 0%, var(--muted-emerald) 51%, var(--primary-emerald) 100%);
            background-size: 200% auto;
            color: white;
            transition: 0.5s;
            box-shadow: 0 0 15px rgba(27, 158, 93, 0.4);
            border: none;
        }
        .primary-btn:hover {
            background-position: right center;
            box-shadow: 0 0 25px rgba(27, 158, 93, 0.6);
            transform: scale(1.03);
        }

        .secondary-btn {
          background-color: var(--muted-emerald);
          color: var(--light-emerald);
        }
        
        .dialog-bg {
            background-color: var(--bg-secondary);
            border-color: var(--light-emerald);
            color: var(--text-primary);
        }
        .dialog-input {
            background-color: var(--bg-accent); /* Changed from #f9fafb */
            border-color: var(--light-emerald);
            color: var(--text-primary);
            transition: border-color 0.2s;
        }
        .dialog-input:focus {
            box-shadow: none !important;
            outline: none !important;
            border-color: var(--primary-emerald) !important;
        }

        .islamic-header {
          background: var(--heading-color); /* Changed from var(--color-emerald-800) */
        }

        .islamic-footer {
          background: var(--heading-color); /* Changed from var(--color-emerald-800) */
        }

        /* Global Heading Styles (for light backgrounds) */
        h1, h2, h3, h4, h5, h6 {
          color: var(--heading-color);
        }
        
        /* Dark Context for high contrast on dark backgrounds */
        .dark-context {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        .dark-context h1,
        .dark-context h2,
        .dark-context h3,
        .dark-context h4,
        .dark-context h5,
        .dark-context h6,
        .dark-context p,
        .dark-context .text-white {
          color: #FFFFFF !important;
        }

        .text-white {
          color: #FFFFFF !important;
        }
        
        .text-gray-300, .text-gray-400, .text-gray-500 {
          color: var(--text-muted) !important; /* Updated to use theme variable */
        }
        
        .text-cyan-300, .text-cyan-400 {
          color: var(--heading-color) !important;
        }

        .divider { border-color: var(--border-secondary); } /* Updated to use theme variable */
        
        .status-ring {
          background: linear-gradient(45deg, var(--accent-emerald), var(--muted-emerald));
        }

        .info-note { color: var(--primary-emerald); background-color: rgba(27, 158, 93, 0.05); }
        
        .bottom-nav { 
          border-top-color: var(--border-secondary); /* Updated to use theme variable */
          background-color: var(--bg-secondary); /* Updated to use theme variable */
        }
        .bottom-nav a { 
          color: var(--text-secondary); /* Updated to use theme variable */
        }
        .bottom-nav a.active { color: var(--primary-emerald); }
        
        .heading-color { color: var(--heading-color); }
        .text-muted { color: var(--text-muted); }
        .bg-light-emerald { background-color: var(--light-emerald); }
        .border-light-emerald { border-color: var(--light-emerald); }
        .text-muted-emerald { color: var(--muted-emerald); }

        /* Utility classes for story cards */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Arabic Text Highlighting Fix */
        .ayah-highlight {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.3) 100%);
          border-left: 4px solid #10b981;
          border-radius: 8px;
          padding: 12px;
          margin: 8px 0;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
        }
        
        .border-cream-beige {
            border-color: #E8D4B7;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-emerald-200 dark:border-emerald-800/30 p-3">
        <div className="flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            {/* Zahoor logo */}
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png" 
              alt="Zahoor" 
              className="w-10 h-10 rounded-lg shadow-md object-cover"
            />
            <div>
              <h1 className="text-lg font-bold leading-none text-emerald-800 dark:text-emerald-100">Zahoor</h1>
              <p className="text-xs text-emerald-700 dark:text-emerald-200">Hearts Await Zahoor</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to={createPageUrl('Notifications')}>
              <button className="relative p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-800/50">
                <Bell className="w-5 h-5 text-emerald-800 dark:text-emerald-200" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full border-2 border-white dark:border-gray-800"></span>
              </button>
            </Link>
            <RightSidebar theme={theme} setTheme={setTheme}>
              <button className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-800/50">
                <Menu className="w-5 h-5 text-emerald-800 dark:text-emerald-200" />
              </button>
            </RightSidebar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={shouldHideBottomNav ? "" : "pb-20"}>
        {children}
      </main>

      {/* Bottom Navigation - Hidden on certain pages */}
      {!shouldHideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-emerald-200/50 dark:border-emerald-800/30 rounded-t-3xl shadow-2xl">
          <div className="flex justify-around items-center h-20 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ease-out group ${
                  active ? 'transform scale-110' : 'hover:scale-105'}`
                  }>

                  {/* Active Background Glow */}
                  {active &&
                  <div className=""></div>
                  }
                  
                  {/* Icon Container */}
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                  active ?
                  'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30' :
                  'bg-transparent group-hover:bg-emerald-50 dark:group-hover:bg-emerald-800/50'}`
                  }>
                    <Icon className={`w-6 h-6 transition-all duration-300 ${
                    active ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`
                    } />
                    
                    {/* Active Indicator Dot */}
                    {active &&
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-800 shadow-md animate-pulse"></div>
                    }
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium mt-1.5 transition-all duration-300 ${
                  active ?
                  'text-emerald-700 dark:text-emerald-200 font-bold' :
                  'text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`
                  }>
                    {item.name}
                  </span>
                  
                  {/* Active Underline */}
                  {active &&
                  <div className=""></div>
                  }
                </Link>);

            })}
          </div>
          
          {/* Bottom Safe Area */}
          <div className="h-safe-bottom bg-gradient-to-t from-emerald-50/50 to-transparent dark:from-gray-900/50"></div>
        </nav>
      )}
    </div>);

}