'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#3d5a5c] text-white py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/sby-logo-new.png" alt="SoldByYou" className="h-16 w-auto" />
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-8">
          {/* Phone */}
          <div className="hidden md:block text-sm">
            <span className="text-gray-300">Questions? Call or text </span>
            <a href="tel:4802390518" className="text-yellow-400 hover:underline font-semibold">
              (480) 239-0518
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm">
            <Link href="/buyer" className="hover:text-yellow-400 transition">
              Start Your Home Search
            </Link>
            <Link href="#faq" className="hover:text-yellow-400 transition">
              FAQ
            </Link>
            <Link href="#resources" className="hover:text-yellow-400 transition">
              Resources
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-[#3d5a5c] transition text-sm font-medium">
              Log In
            </button>
            <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition text-sm font-semibold">
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
