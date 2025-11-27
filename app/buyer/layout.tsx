import Sidebar from '@/components/buyer/Sidebar';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Desktop: ml-64 for sidebar, Mobile: pt-16 for header, no left margin */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
