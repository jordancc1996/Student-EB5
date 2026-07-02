import { useState, useEffect } from 'react';
import { GRANDFATHERING_DEADLINE } from '@/lib/eb5-dates';

const PathwaysCountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const deadline = new Date(GRANDFATHERING_DEADLINE);
    const update = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 text-center flex-shrink-0">
      <div>
        <span className="text-2xl font-bold text-background">{timeLeft.days}</span>
        <span className="block text-xs text-background/60 uppercase">Days</span>
      </div>
      <div>
        <span className="text-2xl font-bold text-background">{timeLeft.hours}</span>
        <span className="block text-xs text-background/60 uppercase">Hours</span>
      </div>
      <div>
        <span className="text-2xl font-bold text-background">{timeLeft.minutes}</span>
        <span className="block text-xs text-background/60 uppercase">Min</span>
      </div>
    </div>
  );
};

export default PathwaysCountdownBanner;
