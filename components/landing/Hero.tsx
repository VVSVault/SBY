'use client';

import Link from 'next/link';
import { LIST_MY_HOME_URL } from '@/lib/constants';

export default function Hero() {
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
        <div className="max-w-7xl mx-auto pt-6 pb-3 pl-6" style={{ paddingRight: '0px' }}>
          <div className="flex items-start justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center pt-2">
              <img src="/sby-logo-new.png" alt="SoldByYou" className="h-32 w-auto" />
            </Link>

            {/* Right Side */}
            <div className="flex flex-col items-end space-y-3">
              {/* Phone - Top Row */}
              <div className="text-base">
                <span className="text-white">Questions? Call or text </span>
                <a href="tel:4802390518" className="text-[#FFD700] hover:underline font-semibold">
                  (480) 239-0518
                </a>
              </div>

              {/* Navigation & Buttons - Bottom Row */}
              <div className="flex items-center space-x-6">
                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-6 font-bold" style={{ fontSize: '21px' }}>
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
                  <button className="px-5 py-2.5 border-2 border-white rounded-lg hover:bg-white hover:text-[#5a7a7d] transition font-semibold" style={{ fontSize: '21px' }}>
                    Log In
                  </button>
                  <button className="px-6 py-2.5 bg-[#FFD700] text-gray-900 rounded-lg hover:bg-[#E6C200] transition font-bold" style={{ fontSize: '21px' }}>
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column: Headline & Content */}
          <div className="space-y-6 z-10">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Keep the Equity on<br />
              One of the Biggest<br />
              Assets You Own
            </h1>

            <div className="space-y-4 max-w-xl">
              <p className="text-xl font-semibold">
                You CAN sell your own home. The entire selling process, made simple!
              </p>

              <p className="text-lg leading-relaxed">
                For a one-time cost of $795, get access to all the benefits of an agent without the percentage-based commission fees. Let us guide you through the home selling process.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href={LIST_MY_HOME_URL}
                className="inline-block bg-[#FFD700] text-gray-900 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-[#E6C200] transition text-lg"
              >
                List Your Home Now
              </a>
            </div>
          </div>

          {/* Right Column: Hero Video - Larger and scaled up */}
          <div className="hidden md:block relative z-10 mt-16 ml-8">
            <div className="relative rounded-lg shadow-2xl overflow-hidden border-4 border-white transform scale-125">
              <video
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
