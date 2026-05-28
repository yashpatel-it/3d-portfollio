import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
}

interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  u: number;
  v: number;
}

interface GeometricShape {
  vertices: Vertex3D[];
  edges: Edge[];
  x: number; // World x
  y: number; // World y
  z: number; // World z
  color: string;
  size: number; // Scale multiplier
  rx: number; // Rot angle X
  ry: number; // Rot angle Y
  rz: number; // Rot angle Z
  speedX: number; // Rotate speed X
  speedY: number; // Rotate speed Y
  speedZ: number; // Rotate speed Z
  driftY: number; // Drifting speed vertical
}

export default function Starfield3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(1); // Active Z-speed
  const targetScrollSpeedRef = useRef<number>(1); // Target Z-speed
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic color palettes matching the main site accent
    const colors = [
      "rgba(168, 85, 247, ",  // Purple (#a855f7)
      "rgba(236, 72, 153, ",  // Pink (#ec4899)
      "rgba(249, 115, 22, ",  // Orange (#f97316)
      "rgba(99, 102, 241, ",  // Indigo (#6366f1)
    ];

    const particleCount = 200;
    const maxDepth = 1500;
    const focalLength = 350;
    const particles: Particle[] = [];

    // Initialize stars
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 3,
        y: (Math.random() - 0.5) * height * 3,
        z: Math.random() * maxDepth,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 1.5 + 0.8,
      });
    }

    // Geometry templates
    const cubeVertices: Vertex3D[] = [
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
    ];
    const cubeEdges: Edge[] = [
      { u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 0 },
      { u: 4, v: 5 }, { u: 5, v: 6 }, { u: 6, v: 7 }, { u: 7, v: 4 },
      { u: 0, v: 4 }, { u: 1, v: 5 }, { u: 2, v: 6 }, { u: 3, v: 7 }
    ];

    const pyramidVertices: Vertex3D[] = [
      { x: 0, y: -1.2, z: 0 }, // Top apex
      { x: -1, y: 0.8, z: -1 }, { x: 1, y: 0.8, z: -1 },
      { x: 1, y: 0.8, z: 1 }, { x: -1, y: 0.8, z: 1 }
    ];
    const pyramidEdges: Edge[] = [
      { u: 0, v: 1 }, { u: 0, v: 2 }, { u: 0, v: 3 }, { u: 0, v: 4 },
      { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 4 }, { u: 4, v: 1 }
    ];

    const octahedronVertices: Vertex3D[] = [
      { x: 0, y: -1.4, z: 0 }, { x: 0, y: 1.4, z: 0 }, // top and bottom apex
      { x: -1, y: 0, z: -1 }, { x: 1, y: 0, z: -1 },
      { x: 1, y: 0, z: 1 }, { x: -1, y: 0, z: 1 }
    ];
    const octahedronEdges: Edge[] = [
      { u: 0, v: 2 }, { u: 0, v: 3 }, { u: 0, v: 4 }, { u: 0, v: 5 },
      { u: 1, v: 2 }, { u: 1, v: 3 }, { u: 1, v: 4 }, { u: 1, v: 5 },
      { u: 2, v: 3 }, { u: 3, v: 4 }, { u: 4, v: 5 }, { u: 5, v: 2 }
    ];

    // Array of active 3D floating shapes
    const shapes: GeometricShape[] = [];
    const shapeCount = 18;

    for (let i = 0; i < shapeCount; i++) {
      const type = Math.floor(Math.random() * 3);
      let v: Vertex3D[] = [];
      let e: Edge[] = [];

      if (type === 0) {
        v = cubeVertices; e = cubeEdges;
      } else if (type === 1) {
        v = pyramidVertices; e = pyramidEdges;
      } else {
        v = octahedronVertices; e = octahedronEdges;
      }

      shapes.push({
        vertices: v,
        edges: e,
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2.5,
        z: Math.random() * (maxDepth * 0.8) + 200,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 20 + 20, // scale multiplier
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        speedX: Math.random() * 0.008 - 0.004,
        speedY: Math.random() * 0.008 - 0.004,
        speedZ: Math.random() * 0.008 - 0.004,
        driftY: Math.random() * 0.2 + 0.1, // slow downward float
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    const handleScroll = () => {
      targetScrollSpeedRef.current = 15; // stretch warp zoom on scroll

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        targetScrollSpeedRef.current = 1.0;
      }, 150);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "rgba(12, 12, 12, 0.25)"; // Trails
      ctx.fillRect(0, 0, width, height);

      // Damp scroll speed and camera coordinates
      scrollSpeedRef.current += (targetScrollSpeedRef.current - scrollSpeedRef.current) * 0.08;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const cx = width / 2 - mouseRef.current.x * 150;
      const cy = height / 2 - mouseRef.current.y * 150;

      // 1. Draw Starfield Particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.z -= scrollSpeedRef.current * 1.5;

        if (p.z <= 0) {
          p.z = maxDepth;
          p.x = (Math.random() - 0.5) * width * 3;
          p.y = (Math.random() - 0.5) * height * 3;
        }

        const k = focalLength / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthRatio = 1 - p.z / maxDepth;
          const radius = p.size * k * 0.8;

          ctx.beginPath();
          if (scrollSpeedRef.current > 4) {
            const trail = (scrollSpeedRef.current - 3) * 1.5;
            const pxPrev = p.x * (focalLength / (p.z + trail)) + cx;
            const pyPrev = p.y * (focalLength / (p.z + trail)) + cy;
            
            ctx.strokeStyle = `${p.color}${Math.min(depthRatio * 0.7, 0.9)})`;
            ctx.lineWidth = radius * 0.7;
            ctx.moveTo(px, py);
            ctx.lineTo(pxPrev, pyPrev);
            ctx.stroke();
          } else {
            ctx.fillStyle = `${p.color}${Math.min(depthRatio * 0.5, 0.8)})`;
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 2. Draw 3D Floating Wireframe Geometry Shapes
      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];

        // Drift shape vertical position down and push forward based on scroll speed
        s.y += s.driftY + (scrollSpeedRef.current - 1) * 0.8;
        s.z -= scrollSpeedRef.current * 1.0;

        // Rotate shape
        s.rx += s.speedX;
        s.ry += s.speedY;
        s.rz += s.speedZ;

        // Reset if shape flies past bottom screen bounds or camera depth
        if (s.z <= 10 || s.y > height * 1.5) {
          s.z = maxDepth * 0.8;
          s.y = -height * 0.8;
          s.x = (Math.random() - 0.5) * width * 2;
        }

        const depthRatio = 1 - s.z / maxDepth;
        const scaleK = focalLength / s.z;

        // Coordinates of projected vertices cache
        const projVertices: { px: number; py: number }[] = [];

        // Precalculate trigonometric functions for speed
        const cosX = Math.cos(s.rx), sinX = Math.sin(s.rx);
        const cosY = Math.cos(s.ry), sinY = Math.sin(s.ry);
        const cosZ = Math.cos(s.rz), sinZ = Math.sin(s.rz);

        // Project shape vertices
        for (let j = 0; j < s.vertices.length; j++) {
          const v = s.vertices[j];

          // Scale local vertex coordinate
          const lx = v.x * s.size;
          const ly = v.y * s.size;
          const lz = v.z * s.size;

          // 3D Rotation on X, Y, Z local coordinates
          // Rotate Y
          let x1 = lx * cosY - lz * sinY;
          let z1 = lx * sinY + lz * cosY;
          // Rotate X
          let y2 = ly * cosX - z1 * sinX;
          let z2 = ly * sinX + z1 * cosX;
          // Rotate Z
          let x3 = x1 * cosZ - y2 * sinZ;
          let y3 = x1 * sinZ + y2 * cosZ;

          // World coordinates
          const wx = x3 + s.x;
          const wy = y2 + s.y;
          const wz = z2 + s.z;

          // Project to 2D
          const k = focalLength / wz;
          const px = wx * k + cx;
          const py = wy * k + cy;

          projVertices.push({ px, py });
        }

        // Draw shape wireframe edges
        ctx.lineWidth = Math.max(0.4, depthRatio * 1.2);
        ctx.strokeStyle = `${s.color}${Math.min(depthRatio * 0.28, 0.45)})`;

        for (let j = 0; j < s.edges.length; j++) {
          const edge = s.edges[j];
          const p1 = projVertices[edge.u];
          const p2 = projVertices[edge.v];

          if (p1 && p2) {
            // Draw connecting lines
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }

        // Draw glowing vertex endpoints
        for (let j = 0; j < projVertices.length; j++) {
          const p = projVertices[j];
          if (p) {
            ctx.beginPath();
            ctx.arc(p.px, p.py, Math.max(1, depthRatio * 2.5), 0, Math.PI * 2);
            ctx.fillStyle = `${s.color}${Math.min(depthRatio * 0.6, 0.85)})`;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: "#0C0C0C" }}
    />
  );
}
