const JourneyCTA = () => {
  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-serif mb-4 text-white/90">
          Secure Your Future
        </h2>
        <a
          href="/contact"
          className="inline-block text-4xl md:text-5xl lg:text-6xl font-bold mb-12 hover:opacity-80 transition-opacity"
          style={{ color: '#FF4500' }}
        >
          Start Your EB-5 Journey Today
        </a>
        <div className="flex items-center justify-center text-6xl md:text-7xl lg:text-8xl font-bold">
          <span className="text-zinc-700">student</span>
          <span className="text-white">eb5</span>
        </div>
      </div>
    </section>
  );
};

export default JourneyCTA;
