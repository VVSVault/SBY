export default function ValueProps() {
  return (
    <section className="pt-20 pb-0 px-4 bg-[#738286]">
      <div className="max-w-7xl mx-auto">
        {/* Video Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Sell Your Home on Your Terms.
          </h2>
          <div className="max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <video
              src="https://pub-723cf289193a4aaf99eb07deb8d15315.r2.dev/sold_by_you.mp4"
              controls
              className="w-full h-auto"
            />
          </div>
          <p className="text-3xl text-[#5DD5D9] max-w-3xl mx-auto font-bold">
            Skip the agent fees. Get the most value for your home.
          </p>
          <p className="text-white text-xl mt-2 mb-8">For a one-time cost of $795, get the following benefits:</p>
        </div>

        <div className="relative max-w-6xl mx-auto h-[650px] flex items-center justify-center -mt-8">
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Outer circle */}
              <div className="w-72 h-72 rounded-full bg-gray-600 flex items-center justify-center">
                {/* Inner circle */}
                <div className="w-56 h-56 rounded-full bg-gray-700 flex flex-col items-center justify-center">
                  <p className="text-white text-sm mb-2">SBY Cost</p>
                  <p className="text-[#FFD700] text-5xl font-bold">$795</p>
                </div>
              </div>

              {/* Seller Agent Fee label - positioned on top left edge of outer circle */}
              <div className="absolute top-4 -left-2 text-center">
                <p className="text-cyan-400 text-xs">Seller Agent Fee</p>
                <p className="text-white text-xl font-bold relative inline-block">
                  $16,800
                  <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-cyan-400 transform -rotate-12"></span>
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Cards - LARGE cards positioned CLOSE to circle */}
          <div className="w-full">
            {/* Benefit 1 - Top Left */}
            <div className="absolute top-12 left-0 w-96 h-64 bg-white/80 hover:bg-white rounded-2xl p-8 text-left shadow-lg flex flex-col transition-all duration-300">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-3xl text-black">⊗</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                No agent commission fee
              </h3>
              <p className="text-gray-700 flex-1" style={{ fontSize: '15px' }}>
                No expensive percentage-based agent commission, just a one-time flat fee no matter what your house sells for.
              </p>
            </div>

            {/* Benefit 2 - Top Right */}
            <div className="absolute top-12 right-0 w-96 h-64 bg-white/80 hover:bg-white rounded-2xl p-8 text-left shadow-lg flex flex-col transition-all duration-300">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-3xl">📷</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                Professional photos and yard sign
              </h3>
              <p className="text-gray-700 flex-1" style={{ fontSize: '15px' }}>
                Have beautiful photos of your home taken by a professional photographer and a yard sign provided at no additional cost.
              </p>
            </div>

            {/* Benefit 3 - Bottom Left */}
            <div className="absolute bottom-12 left-0 w-96 h-64 bg-white/80 hover:bg-white rounded-2xl p-8 text-left shadow-lg flex flex-col transition-all duration-300">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                Listing added to real estate websites
              </h3>
              <p className="text-gray-700 flex-1" style={{ fontSize: '15px' }}>
                Your listing will be added to the MLS so your home will be listed on websites like Zillow, Trulia, Redfin, and much more.
              </p>
            </div>

            {/* Benefit 4 - Bottom Right */}
            <div className="absolute bottom-12 right-0 w-96 h-64 bg-white/80 hover:bg-white rounded-2xl p-8 text-left shadow-lg flex flex-col transition-all duration-300">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                Full Escrow Guidance
              </h3>
              <p className="text-gray-700 flex-1" style={{ fontSize: '15px' }}>
                Our User Portals will guide you through the entire real estate transaction with needed forms, contacts and 3rd parties, everything you need from beginning to the closing table.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
