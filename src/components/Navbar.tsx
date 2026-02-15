"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const menuItems = [
    { label: 'CHI SIAMO', href: '/chi-siamo' },
    { label: 'COSA FACCIAMO', href: '/cosa-facciamo' },
    { label: 'LE CER(S)', href: '/le-cer' },
    { label: 'NOTIZIE', href: '/notizie' },
    { label: 'CONTATTACI', href: '/#contatti' },
    { label: 'DIVENTA SOCIO', href: '/diventa-socio' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[2000] bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image src="/assets/logo.png" alt="Sun-Fai Logo" width={150} height={48} className="h-12 w-auto" />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-brush-link text-sm font-bold text-black transition ${pathname === item.href ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu} 
                className="text-black focus:outline-none p-2"
                aria-label="Open Menu"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div id="mobile-menu-overlay" className={isMobileMenuOpen ? 'open' : ''}>
        <button 
          onClick={closeMobileMenu} 
          className="absolute top-6 right-6 text-sunfai-yellow focus:outline-none"
          aria-label="Close Menu"
        >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center w-full">
            {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="mobile-menu-item"
                >
                  {item.label}
                </Link>
            ))}
        </div>

        <div className="mt-12">
            <Image src="/assets/logo.png" alt="Sun-Fai Logo" width={200} height={64} className="h-16 w-auto" />
        </div>
      </div>
    </>
  );
}
