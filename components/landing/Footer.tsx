export default function Footer() {
  return (
    <footer className="bg-[#738286] text-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Copyright and Links - Centered */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm mb-4">
          <p>&copy; {new Date().getFullYear()} Sold By You</p>
          <span className="hidden md:inline">•</span>
          <a href="/disclosure-policy" className="hover:text-gray-300 transition">Disclosure Policy</a>
          <span className="hidden md:inline">•</span>
          <a href="/terms-of-use" className="hover:text-gray-300 transition">Terms of Use</a>
          <span className="hidden md:inline">•</span>
          <a href="/privacy-policy" className="hover:text-gray-300 transition">Privacy Policy</a>
        </div>

        {/* Equal Housing Logo - Centered Below */}
        <div className="flex flex-col items-center">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10L10 40v50h80V40L50 10zm0 8l32 24v40H18V42l32-24z' fill='%23fff'/%3E%3Ctext x='50' y='70' font-size='40' text-anchor='middle' fill='%23fff'%3E=%3C/text%3E%3C/svg%3E"
            alt="Equal Housing Opportunity"
            className="h-10 w-10 mb-1"
          />
          <p className="text-xs">Equal Housing Opportunity</p>
        </div>
      </div>
    </footer>
  );
}
