'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { LIST_MY_HOME_URL } from '@/lib/constants';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt to play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Autoplay was prevented:', error);
      });
    }
  }, []);

  return (
    <section className="relative text-white overflow-visible pb-48">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/sbybackground.avif"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3d5a5c]/85"></div>
      </div>

      {/* Header Navigation */}
      <div className="relative z-50">
        <div className="max-w-7xl mx-auto pt-4 md:pt-6 pb-3 px-4 md:px-6">
          <div className="flex items-start justify-between flex-wrap md:flex-nowrap gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src="/sby-logo-new.png" alt="SoldByYou" className="h-16 md:h-32 w-auto" />
            </Link>

            {/* Right Side */}
            <div className="flex flex-col items-end space-y-2 md:space-y-3">
              {/* Phone - Top Row */}
              <div className="text-xs md:text-base">
                <span className="text-white hidden md:inline">Questions? Call or text </span>
                <a href="tel:4802390518" className="text-[#FFD700] hover:underline font-semibold">
                  (480) 239-0518
                </a>
              </div>

              {/* Navigation & Buttons - Bottom Row */}
              <div className="flex items-center space-x-2 md:space-x-6">
                {/* Navigation Links - Desktop Only */}
                <nav className="hidden lg:flex items-center space-x-6 font-bold text-lg md:text-xl">
                  <Link href="/buyer" className="hover:text-[#5DD5D9] transition">
                    Start Your Home Search
                  </Link>
                  <Link href="#faq" className="hover:text-[#5DD5D9] transition">
                    FAQ
                  </Link>
                  <Link href="#resources" className="hover:text-[#5DD5D9] transition">
                    Resources
                  </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Mobile: Show Buyer Portal + Auth Buttons */}
                  <Link href="/buyer" className="lg:hidden px-2.5 py-1.5 border-2 border-[#5DD5D9] bg-[#5DD5D9] text-white rounded-lg hover:bg-[#4AC4C8] transition font-semibold text-xs whitespace-nowrap">
                    Buyer Portal
                  </Link>
                  <button className="lg:hidden px-2.5 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-[#5a7a7d] transition font-semibold text-xs">
                    Log In
                  </button>
                  <button className="lg:hidden px-2.5 py-1.5 bg-[#FFD700] text-gray-900 rounded-lg hover:bg-[#E6C200] transition font-bold text-xs">
                    Register
                  </button>

                  {/* Desktop: Show Login/Register */}
                  <button className="hidden lg:block px-3 md:px-5 py-1.5 md:py-2.5 border-2 border-white rounded-lg hover:bg-white hover:text-[#5a7a7d] transition font-semibold text-sm md:text-xl">
                    Log In
                  </button>
                  <button className="hidden lg:block px-4 md:px-6 py-1.5 md:py-2.5 bg-[#FFD700] text-gray-900 rounded-lg hover:bg-[#E6C200] transition font-bold text-sm md:text-xl">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-12 md:pb-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left Column: Headline & Content */}
          <div className="space-y-4 md:space-y-6 z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Keep the Equity on<br />
              One of the Biggest<br />
              Assets You Own
            </h1>

            <div className="space-y-3 md:space-y-4 max-w-xl">
              <p className="text-lg md:text-xl font-semibold">
                You CAN sell your own home. The entire selling process, made simple!
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                For a one-time cost of $795, get access to all the benefits of an agent without the percentage-based commission fees. Let us guide you through the home selling process.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href={LIST_MY_HOME_URL}
                className="inline-block bg-[#FFD700] text-gray-900 font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-[#E6C200] transition text-base md:text-lg"
              >
                List Your Home Now
              </a>
            </div>
          </div>

          {/* Right Column: Hero Video - Larger and scaled up */}
          <div className="hidden md:block relative z-10 mt-16 ml-8">
            <div className="relative rounded-lg shadow-2xl overflow-hidden border-4 border-white transform scale-125">
              <video
                ref={videoRef}
                src="https://pub-723cf289193a4aaf99eb07deb8d15315.r2.dev/newherovideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
