import { useEffect, useRef } from 'react';

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x || 0;
    this.y = y || 0;
  }
}

class Particle {
  ctx: CanvasRenderingContext2D;
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
  time: number;
  duration: number;
  color: string;
  w: number;
  h: number;
  complete: boolean;
  x: number;
  y: number;
  r: number;
  sy: number;

  constructor(ctx: CanvasRenderingContext2D, p0: Point, p1: Point, p2: Point, p3: Point) {
    this.ctx = ctx;
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.time = 0;
    this.duration = 3 + Math.random() * 1;
    this.color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    this.w = 8;
    this.h = 6;
    this.complete = false;
    this.x = p0.x;
    this.y = p0.y;
    this.r = 0;
    this.sy = 1;
  }

  update() {
    this.time = Math.min(this.duration, this.time + (1 / 60));
    const f = Ease.outCubic(this.time, 0.0125, 1, this.duration);
    const p = cubeBezier(this.p0, this.p1, this.p2, this.p3, f);
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    this.r = Math.atan2(dy, dx) + Math.PI * 0.5;
    this.sy = Math.sin(Math.PI * f * 10);
    this.x = p.x;
    this.y = p.y;
    this.complete = this.time === this.duration;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.r);
    this.ctx.scale(1, this.sy);
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(-this.w * 0.5, -this.h * 0.5, this.w, this.h);
    this.ctx.restore();
  }
}

function cubeBezier(p0: Point, c0: Point, c1: Point, p1: Point, t: number): Point {
  const nt = 1 - t;
  return new Point(
    nt * nt * nt * p0.x + 3 * nt * nt * t * c0.x + 3 * nt * t * t * c1.x + t * t * t * p1.x,
    nt * nt * nt * p0.y + 3 * nt * nt * t * c0.y + 3 * nt * t * t * c1.y + t * t * t * p1.y
  );
}

const Ease = {
  outCubic(t: number, b: number, c: number, d: number) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  },
};

const CelebrationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = 600;
    const particles: Particle[] = [];

    canvas.width = width;
    canvas.height = height;

    const createParticles = () => {
      for (let i = 0; i < 128; i++) {
        const p0 = new Point(width / 2, height / 2);
        const p1 = new Point(Math.random() * width, Math.random() * height);
        const p2 = new Point(Math.random() * width, Math.random() * height);
        const p3 = new Point(Math.random() * width, height + 64);
        particles.push(new Particle(ctx, p0, p1, p2, p3));
      }
    };

    const updateParticles = () => {
      particles.forEach((particle) => particle.update());
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => particle.draw());
    };

    const checkParticlesComplete = () => {
      return particles.every((particle) => particle.complete);
    };

    const loop = () => {
      updateParticles();
      drawParticles();

      if (checkParticlesComplete()) {
        particles.length = 0;
        createParticles();
        setTimeout(animate, Math.random() * 2000);
      } else {
        animate();
      }
    };

    const animate = () => {
      requestAnimationFrame(loop);
    };

    createParticles();
    animate();
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />;
};

export default CelebrationCanvas;
