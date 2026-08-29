import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [schedules, setSchedules] = useState<string[]>([]);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    apiClient.get('/settings/trade')
      .then(res => {
        setSchedules(res.schedules || []);
        setDuration(res.duration_minutes || 30);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let diff = 0;

      if (!schedules || schedules.length === 0) {
        // Fallback to midnight
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0);
        diff = tomorrow.getTime() - now.getTime();
      } else {
        const sorted = [...schedules].sort();
        let nextTime = null;

        for (const t of sorted) {
          const [hour, minute] = t.split(':').map(Number);
          const target = new Date(now);
          target.setHours(hour, minute, 0, 0);
          if (target.getTime() > now.getTime()) {
            nextTime = target;
            break;
          }
        }

        if (!nextTime) {
          const [hour, minute] = sorted[0].split(':').map(Number);
          nextTime = new Date(now);
          nextTime.setDate(now.getDate() + 1);
          nextTime.setHours(hour, minute, 0, 0);
        }

        diff = nextTime.getTime() - now.getTime();
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [schedules]);

  return { timeLeft, duration };
}
