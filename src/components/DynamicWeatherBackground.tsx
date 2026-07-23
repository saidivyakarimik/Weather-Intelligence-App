import React, { useEffect, useRef, useState } from 'react';
import { getWeatherTheme } from '../utils/weatherThemes';

export interface DynamicWeatherBackgroundProps {
  weatherCode: number;
  isDay: number;
  windSpeed?: number;      // in km/h or mph
  windDirection?: number;  // in degrees
  sunrise?: string;        // ISO format or time string
  sunset?: string;         // ISO format or time string
  localTime?: string;      // ISO format or time string
}

// Particle Interfaces
interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  vx: number;
  vy: number;
}

interface SnowFlake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  swingSpeed: number;
  swingMag: number;
  swingOffset: number;
}

interface CloudBlob {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export const DynamicWeatherBackground: React.FC<DynamicWeatherBackgroundProps> = ({
  weatherCode,
  isDay,
  windSpeed = 12,
  windDirection = 220,
  sunrise,
  sunset,
  localTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasError, setCanvasError] = useState<boolean>(false);

  // Theme info for badge & CSS fallback
  const theme = getWeatherTheme(weatherCode, isDay);

  // Time-of-day calculations (Golden Hour / Sunrise / Sunset / Night)
  const isNightTime = isDay === 0;

  const isGoldenHour = (() => {
    if (!sunrise || !sunset || !localTime) return false;
    try {
      const now = new Date(localTime).getTime();
      const sr = new Date(sunrise).getTime();
      const ss = new Date(sunset).getTime();
      const margin = 45 * 60 * 1000; // 45 minutes
      return Math.abs(now - sr) <= margin || Math.abs(now - ss) <= margin;
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCanvasError(true);
      return;
    }

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Responsive Canvas Resizing
    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Weather type categorization
    const isRain =
      (weatherCode >= 51 && weatherCode <= 67) ||
      (weatherCode >= 80 && weatherCode <= 82) ||
      weatherCode >= 95;
    const isSnow =
      (weatherCode >= 71 && weatherCode <= 77) ||
      (weatherCode >= 85 && weatherCode <= 86);
    const isStorm = weatherCode >= 95;
    const isCloudyOrFog =
      weatherCode === 2 || weatherCode === 3 || weatherCode === 45 || weatherCode === 48;

    // Wind Slant vector calculation
    const windRad = ((windDirection || 220) * Math.PI) / 180;
    const windScale = Math.min(3.5, (windSpeed || 12) / 8);
    const slantX = Math.sin(windRad) * windScale;

    // Initialize Particle Arrays
    const rainDrops: RainDrop[] = [];
    const splashes: Splash[] = [];
    const snowFlakes: SnowFlake[] = [];
    const cloudBlobs: CloudBlob[] = [];
    const stars: Star[] = [];

    // 1. Rain drops
    if (isRain) {
      const dropCount = isStorm ? 260 : weatherCode >= 63 ? 200 : 120;
      for (let i = 0; i < dropCount; i++) {
        rainDrops.push({
          x: Math.random() * (width + 400) - 200,
          y: Math.random() * height,
          length: Math.random() * 18 + 12,
          speed: Math.random() * 14 + 16,
          opacity: Math.random() * 0.4 + 0.35,
          width: Math.random() * 1.2 + 0.8,
        });
      }
    }

    // 2. Snowflakes
    if (isSnow) {
      const flakeCount = weatherCode >= 73 ? 180 : 110;
      for (let i = 0; i < flakeCount; i++) {
        snowFlakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1.2,
          speed: Math.random() * 1.5 + 0.8,
          opacity: Math.random() * 0.6 + 0.35,
          swingSpeed: Math.random() * 0.02 + 0.008,
          swingMag: Math.random() * 1.8 + 0.6,
          swingOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    // 3. Clouds & Fog
    if (isCloudyOrFog || isRain || isSnow) {
      const cloudCount = isCloudyOrFog ? 18 : 10;
      for (let i = 0; i < cloudCount; i++) {
        cloudBlobs.push({
          x: Math.random() * (width + 300) - 150,
          y: Math.random() * (height * 0.5) + 30,
          radius: Math.random() * 180 + 100,
          opacity: Math.random() * 0.12 + 0.06,
          vx: (Math.random() * 0.2 + 0.05) * (slantX > 0 ? 1 : -1),
          vy: (Math.random() - 0.5) * 0.02,
        });
      }
    }

    // 4. Stars for clear night
    if (isNightTime) {
      const starCount = 140;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.75),
          radius: Math.random() * 1.4 + 0.6,
          alpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    // Lightning Flash State
    let flashOpacity = 0;
    let flashCooldown = 150;
    let boltPath: { x: number; y: number }[] = [];

    const generateLightningBolt = () => {
      const startX = Math.random() * (width * 0.8) + width * 0.1;
      let currX = startX;
      let currY = 0;
      const path = [{ x: currX, y: currY }];

      while (currY < height * 0.65) {
        currX += (Math.random() - 0.5) * 60;
        currY += Math.random() * 40 + 20;
        path.push({ x: currX, y: currY });
      }
      return path;
    };

    let startTime = performance.now();

    // MAIN RENDER LOOP
    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.001;

      // 1. Draw Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);

      if (isStorm) {
        skyGrad.addColorStop(0, '#090d16');
        skyGrad.addColorStop(0.5, '#1e1b4b');
        skyGrad.addColorStop(1, '#0f172a');
      } else if (isRain) {
        if (isNightTime) {
          skyGrad.addColorStop(0, '#020617');
          skyGrad.addColorStop(0.6, '#0f172a');
          skyGrad.addColorStop(1, '#1e293b');
        } else {
          skyGrad.addColorStop(0, '#1e293b');
          skyGrad.addColorStop(0.5, '#334155');
          skyGrad.addColorStop(1, '#475569');
        }
      } else if (isSnow) {
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.5, '#38bdf8');
        skyGrad.addColorStop(1, '#e0f2fe');
      } else if (isGoldenHour) {
        skyGrad.addColorStop(0, '#2e1065');
        skyGrad.addColorStop(0.4, '#9f1239');
        skyGrad.addColorStop(0.75, '#ea580c');
        skyGrad.addColorStop(1, '#fef08a');
      } else if (isNightTime) {
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(0.5, '#0f172a');
        skyGrad.addColorStop(1, '#1e1b4b');
      } else {
        // Clear / Sunny Day
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.5, '#38bdf8');
        skyGrad.addColorStop(1, '#bae6fd');
      }

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Celestial Light Disks (Sun / Moon / Lens Flare)
      if (!isStorm && !isRain) {
        if (isNightTime) {
          // Stars Twinkle
          stars.forEach((s) => {
            const currentAlpha =
              s.alpha + Math.sin(elapsed * 3 * s.twinkleSpeed * 10 + s.twinkleOffset) * 0.25;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, currentAlpha))})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
          });

          // Moon Disk & Halo
          const moonX = width * 0.82;
          const moonY = height * 0.18;
          const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 110);
          moonGlow.addColorStop(0, 'rgba(238, 242, 255, 0.95)');
          moonGlow.addColorStop(0.2, 'rgba(199, 210, 254, 0.4)');
          moonGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');

          ctx.fillStyle = moonGlow;
          ctx.beginPath();
          ctx.arc(moonX, moonY, 110, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(moonX, moonY, 28, 0, Math.PI * 2);
          ctx.fill();
        } else if (isGoldenHour) {
          // Low Golden Sun
          const sunX = width * 0.78;
          const sunY = height * 0.55;
          const sunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 160);
          sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          sunGlow.addColorStop(0.3, 'rgba(249, 115, 22, 0.45)');
          sunGlow.addColorStop(1, 'rgba(225, 29, 72, 0)');

          ctx.fillStyle = sunGlow;
          ctx.beginPath();
          ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
          ctx.fill();
        } else if (!isCloudyOrFog) {
          // Vibrant Sun Disk & Lens Flare
          const sunX = width * 0.78;
          const sunY = height * 0.16;

          const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 180);
          sunGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
          sunGlow.addColorStop(0.25, 'rgba(253, 224, 71, 0.6)');
          sunGlow.addColorStop(0.6, 'rgba(251, 146, 60, 0.25)');
          sunGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.fillStyle = sunGlow;
          ctx.beginPath();
          ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
          ctx.fill();

          // Subtle Lens Flare Circles
          const flareDx = (width * 0.5 - sunX) * 0.4;
          const flareDy = (height * 0.5 - sunY) * 0.4;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.arc(sunX + flareDx, sunY + flareDy, 22, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(251, 207, 232, 0.12)';
          ctx.beginPath();
          ctx.arc(sunX + flareDx * 1.8, sunY + flareDy * 1.8, 35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Render Clouds / Fog Blobs
      cloudBlobs.forEach((c) => {
        c.x += c.vx + slantX * 0.1;
        c.y += c.vy;

        if (c.x > width + c.radius) c.x = -c.radius;
        if (c.x < -c.radius) c.x = width + c.radius;

        const cloudGlow = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.radius);
        if (isNightTime) {
          cloudGlow.addColorStop(0, `rgba(148, 163, 184, ${c.opacity * 1.2})`);
          cloudGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
        } else {
          cloudGlow.addColorStop(0, `rgba(255, 255, 255, ${c.opacity * 1.5})`);
          cloudGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = cloudGlow;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Render Rain & Splashes
      if (isRain) {
        ctx.strokeStyle = isNightTime ? 'rgba(186, 230, 253, 0.65)' : 'rgba(255, 255, 255, 0.75)';
        ctx.lineCap = 'round';

        rainDrops.forEach((drop) => {
          drop.x += slantX * (drop.speed * 0.3);
          drop.y += drop.speed;

          if (drop.y > height) {
            // Spawn splash ripple at ground level
            if (Math.random() < 0.6) {
              splashes.push({
                x: drop.x,
                y: height - Math.random() * 20,
                radius: 1,
                maxRadius: Math.random() * 6 + 4,
                opacity: 0.7,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2 - 0.5,
              });
            }

            drop.y = -drop.length - Math.random() * 40;
            drop.x = Math.random() * (width + 400) - 200;
          }

          ctx.lineWidth = drop.width;
          ctx.globalAlpha = drop.opacity;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + slantX * drop.length * 0.35, drop.y + drop.length);
          ctx.stroke();
        });

        ctx.globalAlpha = 1.0;

        // Render Splashes
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          s.radius += 0.35;
          s.opacity -= 0.04;
          s.x += s.vx;
          s.y += s.vy;

          if (s.opacity <= 0 || s.radius >= s.maxRadius) {
            splashes.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(224, 242, 254, ${Math.max(0, s.opacity)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 5. Render Snow
      if (isSnow) {
        ctx.fillStyle = '#ffffff';

        snowFlakes.forEach((flake) => {
          flake.x += Math.sin(elapsed * 2 + flake.swingOffset) * flake.swingMag + slantX * 0.2;
          flake.y += flake.speed;

          if (flake.y > height + 10) {
            flake.y = -10;
            flake.x = Math.random() * width;
          }

          ctx.globalAlpha = flake.opacity;
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalAlpha = 1.0;
      }

      // 6. Thunderstorm Lightning Bolts & Screen Flashes
      if (isStorm) {
        flashCooldown--;
        if (flashCooldown <= 0) {
          if (Math.random() < 0.25) {
            flashOpacity = 0.85;
            boltPath = generateLightningBolt();
            flashCooldown = Math.floor(Math.random() * 180 + 120);
          }
        }

        if (flashOpacity > 0.02) {
          // White/Violet Atmospheric Flash Fill
          ctx.fillStyle = `rgba(243, 232, 255, ${flashOpacity * 0.4})`;
          ctx.fillRect(0, 0, width, height);

          // Jagged Lightning Bolt Line
          if (boltPath.length > 1) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${flashOpacity})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(boltPath[0].x, boltPath[0].y);
            for (let i = 1; i < boltPath.length; i++) {
              ctx.lineTo(boltPath[i].x, boltPath[i].y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          flashOpacity *= 0.86;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [weatherCode, isDay, windSpeed, windDirection, sunrise, sunset, localTime, isGoldenHour, isNightTime]);

  // Fallback mode if Canvas is not supported
  if (canvasError) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000">
        <div className={`absolute inset-0 ${theme.bgGradient}`} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic HTML5 Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
