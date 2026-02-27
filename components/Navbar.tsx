"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Fingerprint,
  Handshake,
  Wheat,
  Factory,
  ScrollText,
  Map,
  Coins,
  AlertTriangle,
  BarChart3,
  Info,
  Trophy,
  Radio,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Image from "next/image";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DropdownItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
}

interface NavGroup {
  label: string;
  items: DropdownItem[];
}

// ---------------------------------------------------------------------------
// DropdownMenu — desktop hover dropdown
// ---------------------------------------------------------------------------
function DropdownMenu({
  label,
  items,
  isOpen,
  onOpen,
  onClose,
}: {
  label: string;
  items: DropdownItem[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    onOpen();
  };
  const handleLeave = () => {
    timeout.current = setTimeout(onClose, 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button className="flex items-center gap-1 text-cream/80 hover:text-gold transition-colors font-medium text-sm">
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
          >
            <div className="w-64 rounded-xl border border-gold/15 bg-black/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {items.map((item) => {
                const Icon = item.icon;
                const isExternal = item.href.startsWith("http");

                const inner = (
                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-gold/5 transition-colors cursor-pointer group">
                    <Icon className="w-4 h-4 text-gold/60 group-hover:text-gold mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-cream/90 text-sm font-medium group-hover:text-gold transition-colors">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              item.badgeColor || "bg-gold/10 text-gold"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-cream/35 text-[11px] mt-0.5 leading-tight">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );

                return isExternal ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                ) : item.href.startsWith("#") || item.href.startsWith("/#") ? (
                  <a key={item.href} href={item.href}>
                    {inner}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MobileAccordion — mobile expandable section
// ---------------------------------------------------------------------------
function MobileAccordion({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: DropdownItem[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-lg font-cinzel text-cream/80"
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 text-gold/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-3 space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isPage =
                  !item.href.startsWith("#") &&
                  !item.href.startsWith("/#") &&
                  !item.href.startsWith("http");

                const inner = (
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gold/5 transition-colors"
                    onClick={onNavigate}
                  >
                    <Icon className="w-4 h-4 text-gold/50" />
                    <span className="text-cream/70 text-sm">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto ${
                          item.badgeColor || "bg-gold/10 text-gold"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                );

                return isPage ? (
                  <Link key={item.href} href={item.href}>
                    {inner}
                  </Link>
                ) : (
                  <a key={item.href} href={item.href}>
                    {inner}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { t } = useLanguage();

  // Navigation structure — grouped
  const navGroups: NavGroup[] = [
    {
      label: "Protocol",
      items: [
        {
          icon: AlertTriangle,
          label: t("nav.problem"),
          href: "/#problem",
          description: "Digital feudalism & why we build",
        },
        {
          icon: ScrollText,
          label: t("nav.manifesto"),
          href: "/#manifesto",
          description: "The philosophy behind SOUR",
        },
        {
          icon: Coins,
          label: "Tokenomics",
          href: "/#value",
          description: "Revenue model & $SOUR token",
        },
        {
          icon: Map,
          label: t("nav.roadmap"),
          href: "/#roadmap",
          description: "Where we are & where we're going",
        },
      ],
    },
    {
      label: "Build",
      items: [
        {
          icon: Fingerprint,
          label: "Crust",
          href: "/crust",
          badge: "LIVE",
          badgeColor: "bg-emerald-500/20 text-emerald-400",
          description: "On-chain reputation system",
        },
        {
          icon: Handshake,
          label: "Handshake",
          href: "/handshake",
          badge: "BETA",
          badgeColor: "bg-cyan-500/20 text-cyan-400",
          description: "P2P escrow agreements",
        },
        {
          icon: Wheat,
          label: "Harvest",
          href: "/#value",
          badge: "SOON",
          badgeColor: "bg-amber-500/20 text-amber-400",
          description: "Keeper rewards & treasury",
        },
        {
          icon: Factory,
          label: "Mill",
          href: "/#protocol",
          badge: "SOON",
          badgeColor: "bg-violet-500/20 text-violet-400",
          description: "AI workflow marketplace",
        },
      ],
    },
    {
      label: "Community",
      items: [
        {
          icon: Info,
          label: t("nav.about"),
          href: "/about",
          description: "About SOUR Protocol",
        },
        {
          icon: Trophy,
          label: "Leaderboard",
          href: "/crust/leaderboard",
          description: "Top Bakers by Crust score",
        },
        {
          icon: Radio,
          label: t("nav.liveFeed"),
          href: "/#community",
          description: "Live protocol activity",
        },
        {
          icon: BarChart3,
          label: "Whitepaper",
          href: "/whitepaper",
          description: "Full technical documentation",
        },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-2.5 bg-black/85 backdrop-blur-xl border-b border-gold/15"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/sour-logo.png"
                alt="SOUR"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <span className="font-cinzel font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber">
              SOUR
            </span>
          </motion.a>

          {/* Desktop — Dropdown Groups */}
          <div className="hidden lg:flex items-center gap-7">
            {navGroups.map((group) => (
              <DropdownMenu
                key={group.label}
                label={group.label}
                items={group.items}
                isOpen={openDropdown === group.label}
                onOpen={() => setOpenDropdown(group.label)}
                onClose={() => setOpenDropdown(null)}
              />
            ))}
          </div>

          {/* Desktop — Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/crust"
              className="text-cream/60 hover:text-gold transition-colors font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-gold/5"
            >
              My Crust
            </Link>
            <motion.a
              href="https://pump.fun/coin/2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-gold to-amber text-black font-bold text-sm"
            >
              {t("nav.buy")}
            </motion.a>
          </div>

          {/* Mobile — Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/crust"
              className="text-gold/70 text-sm font-medium px-3 py-1.5 border border-gold/20 rounded-lg"
            >
              Crust
            </Link>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gold"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full screen overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl lg:hidden"
          >
            <div className="pt-20 px-6 pb-8 h-full overflow-y-auto">
              {/* Mobile grouped accordions */}
              <div className="divide-y divide-cream/5">
                {navGroups.map((group) => (
                  <MobileAccordion
                    key={group.label}
                    label={group.label}
                    items={group.items}
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>

              {/* Direct links at bottom */}
              <div className="mt-8 space-y-3">
                <Link
                  href="/handshake"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gold/30 text-gold font-cinzel font-bold"
                >
                  <Handshake className="w-4 h-4" />
                  Handshake
                </Link>
                <motion.a
                  href="https://pump.fun/coin/2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-lg"
                >
                  {t("nav.buy")}
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
