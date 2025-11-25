export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Create Your Listing',
      description: 'Fill out property details and upload photos. Pay the $795 flat fee.',
    },
    {
      number: '2',
      title: 'Go Live on MLS',
      description: 'Your home appears on MLS, Zillow, Realtor.com, and all major portals.',
    },
    {
      number: '3',
      title: 'Receive & Review Offers',
      description: 'Review offers online, negotiate, and accept the best one.',
    },
    {
      number: '4',
      title: 'Close with Confidence',
      description: 'Track escrow progress and close on schedule with our guidance.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#738286]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Four simple steps to sell your home and keep your equity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-[#10b981] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
