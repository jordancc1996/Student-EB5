import { useState, useEffect } from 'react';
import { GRANDFATHERING_DEADLINE } from '@/lib/eb5-dates';

const GrandfatheringCountdownMainContent = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(GRANDFATHERING_DEADLINE).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const milestones = [
    {
      step: 1,
      title: "Source of Funds",
      duration: "1-3 Months",
      description: "Tracing assets & documenting path of funds."
    },
    {
      step: 2,
      title: "Project Selection",
      duration: "2-6 Weeks",
      description: "Due diligence on Regional Center projects."
    },
    {
      step: 3,
      title: "I-526E Preparation",
      duration: "1-2 Months",
      description: "Legal drafting and finalizing petition."
    },
    {
      step: 4,
      title: "USCIS Filing",
      duration: "Before Sept 30, 2026",
      description: "Submit I-526E to lock in current rules.",
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-lg p-8 md:p-10">
          {/* Header */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-3">
            Grandfathering Deadline Countdown
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-10">
            Time remaining until the September 30, 2026 deadline.
          </p>

          {/* Countdown Clock */}
          <div className="flex justify-center gap-4 md:gap-6 mb-12 flex-wrap">
            <div className="bg-foreground text-background px-5 py-4 md:px-6 md:py-5 rounded-lg min-w-[80px] md:min-w-[100px] text-center shadow-lg">
              <div className="text-3xl md:text-4xl font-bold leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest mt-2 opacity-80">Days</div>
            </div>
            <div className="bg-foreground text-background px-5 py-4 md:px-6 md:py-5 rounded-lg min-w-[80px] md:min-w-[100px] text-center shadow-lg">
              <div className="text-3xl md:text-4xl font-bold leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest mt-2 opacity-80">Hours</div>
            </div>
            <div className="bg-foreground text-background px-5 py-4 md:px-6 md:py-5 rounded-lg min-w-[80px] md:min-w-[100px] text-center shadow-lg">
              <div className="text-3xl md:text-4xl font-bold leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest mt-2 opacity-80">Minutes</div>
            </div>
            <div className="bg-foreground text-background px-5 py-4 md:px-6 md:py-5 rounded-lg min-w-[80px] md:min-w-[100px] text-center shadow-lg">
              <div className="text-3xl md:text-4xl font-bold leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest mt-2 opacity-80">Seconds</div>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="border-t border-border pt-8">
            <h2 className="font-serif text-2xl font-bold text-center mb-6">
              Why You Must Act Now
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              The process involves multiple steps before you can even file. Based on typical processing times, you should budget time for:
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              {milestones.map((milestone) => (
                <div 
                  key={milestone.step}
                  className="bg-secondary/50 p-5 border-l-4 border-foreground rounded-r-lg"
                >
                  <h4 className="font-bold text-lg mb-1">
                    {milestone.step}. {milestone.title}
                  </h4>
                  <p className={`text-sm mb-2 ${milestone.highlight ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                    Typical Duration: {milestone.duration}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Plan */}
            <div className="mt-12 border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium text-center mb-3">
                Your Action Plan
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto text-sm">
                Follow these steps to file before the September 30, 2026 deadline and lock in grandfathering protections.
              </p>

              <div className="max-w-lg mx-auto space-y-0">
                {[
                  { step: 1, title: 'Verify Your Source of Funds', desc: 'Document the lawful origin of your investment capital. This is the most time-intensive step.' },
                  { step: 2, title: 'Select a Qualifying Project', desc: 'Conduct due diligence on Regional Center projects. Prioritize Rural TEA for faster processing.' },
                  { step: 3, title: 'Engage an Immigration Attorney', desc: 'Retain experienced EB-5 counsel to prepare your I-526E petition and supporting evidence.' },
                  { step: 4, title: 'Wire Funds and File I-526E', desc: 'Transfer your investment and submit the petition to USCIS before the deadline.' },
                  { step: 5, title: 'File I-485 Concurrently (If Eligible)', desc: 'If you are in the U.S. with a current priority date, file adjustment of status at the same time.' },
                ].map((item, i, arr) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                    </div>
                    <div className={`pb-6 ${i === arr.length - 1 ? 'pb-0' : ''}`}>
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-10">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-4 text-base font-medium hover:bg-foreground/90 transition-colors"
                >
                  Book Your Strategy Call Before the Deadline
                </a>
                <p className="text-xs text-muted-foreground mt-3">Free 30-minute consultation. No obligation.</p>
              </div>

              <p className="mt-10 text-left font-serif font-light text-foreground/55 text-sm leading-relaxed">
                This timeline reflects current USCIS processing for those <a href="/pathways/f1-to-eb5-self-sponsored-green-card" className="underline decoration-foreground/30 underline-offset-2 hover:text-foreground/80 transition-colors">bypassing the H-1B lottery</a> via concurrent filing under the RIA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrandfatheringCountdownMainContent;
