'use client';

import { useState } from 'react';
import { FLAT_FEE } from '@/lib/constants';

export default function SavingsCalculator() {
  const [homePrice, setHomePrice] = useState(561513);
  const [commissionPercent, setCommissionPercent] = useState(3);

  const agentFee = (homePrice * commissionPercent) / 100;
  const savings = agentFee - FLAT_FEE;

  return (
    <section className="relative -mt-48 z-30 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#3d5156] rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Main Message */}
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                The average seller agent's commission fee is{' '}
                <span className="inline-block bg-[#5DD5D9]/20 px-4 py-2 rounded-full">
                  <span className="text-[#5DD5D9]">$17,000</span>
                </span>
                <span className="text-[#5DD5D9]">*</span>
              </h2>
              <p className="text-sm text-gray-300">
                *Based on the average Phoenix home sale cost of $561,513 and a 3% seller agent fee as per 2024 ARMLS data.
              </p>
            </div>

            {/* Right: Calculator Section */}
            <div className="bg-[#4a6669] rounded-xl p-4 md:p-6">
              <div className="text-white mb-4 text-xs md:text-sm">
                <p className="mb-2">Calculate what you could be paying in fees to sell your home with an agent:</p>
                <p className="text-[#5DD5D9] font-semibold">
                  Only pay $795 when you sell with SBY
                </p>
              </div>

              {/* Desktop: Horizontal Line Calculator */}
              <div className="hidden md:flex items-center justify-center gap-3 text-base">
                {/* Home Sale Price */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-300 mb-1.5">Home sale price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-sm">$</span>
                    <input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Math.max(0, Number(e.target.value)))}
                      className="w-32 pl-6 pr-2 py-2.5 bg-white text-gray-900 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#5DD5D9]"
                      step="10000"
                    />
                  </div>
                </div>

                <div className="text-white font-bold text-xl mt-5">×</div>

                {/* Commission % */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-300 mb-1.5">Commission</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={commissionPercent}
                      onChange={(e) => setCommissionPercent(Math.max(0, Math.min(10, Number(e.target.value))))}
                      className="w-20 pr-6 pl-2 py-2.5 bg-white text-gray-900 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#5DD5D9]"
                      step="0.5"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-900 text-sm">%</span>
                  </div>
                </div>

                <div className="text-white font-bold text-xl mt-5">=</div>

                {/* Agent Fee */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-300 mb-1.5">Agent fee</label>
                  <div className="bg-white rounded px-4 py-2.5 text-center">
                    <div className="text-base font-bold text-gray-900">${agentFee.toLocaleString()}</div>
                  </div>
                </div>

                {/* SBY Savings */}
                <div className="flex flex-col">
                  <label className="text-xs text-[#FFD700] font-semibold mb-1.5">SBY Savings</label>
                  <div className="bg-[#FFD700] rounded px-4 py-2.5 text-center">
                    <div className="text-base font-bold text-gray-900">${savings.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Mobile: Vertical Stack Calculator */}
              <div className="md:hidden space-y-4">
                {/* Input Row */}
                <div className="flex items-center gap-3 justify-center">
                  {/* Home Sale Price */}
                  <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-300 mb-1.5">Home sale price</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-900 text-xs">$</span>
                      <input
                        type="number"
                        value={homePrice}
                        onChange={(e) => setHomePrice(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-5 pr-2 py-2 bg-white text-gray-900 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#5DD5D9]"
                        step="10000"
                      />
                    </div>
                  </div>

                  <div className="text-white font-bold text-lg mt-5">×</div>

                  {/* Commission % */}
                  <div className="flex flex-col" style={{width: '80px'}}>
                    <label className="text-xs text-gray-300 mb-1.5">Commission</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={commissionPercent}
                        onChange={(e) => setCommissionPercent(Math.max(0, Math.min(10, Number(e.target.value))))}
                        className="w-full pr-5 pl-2 py-2 bg-white text-gray-900 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#5DD5D9]"
                        step="0.5"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-900 text-xs">%</span>
                    </div>
                  </div>
                </div>

                {/* Results Row */}
                <div className="flex gap-3">
                  {/* Agent Fee */}
                  <div className="flex-1">
                    <label className="text-xs text-gray-300 mb-1.5 block">Agent fee</label>
                    <div className="bg-white rounded px-3 py-2.5 text-center">
                      <div className="text-sm font-bold text-gray-900">${agentFee.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* SBY Savings */}
                  <div className="flex-1">
                    <label className="text-xs text-[#FFD700] font-semibold mb-1.5 block">SBY Savings</label>
                    <div className="bg-[#FFD700] rounded px-3 py-2.5 text-center">
                      <div className="text-sm font-bold text-gray-900">${savings.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
