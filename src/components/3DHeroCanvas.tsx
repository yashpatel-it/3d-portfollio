import { useEffect, useRef, useState } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  px?: number; // projected screen x
  py?: number; // projected screen y
  depthRatio?: number;
}

export default function HeroCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rotationRef = useRef({ x: 0.005, y: 0.008, z: 0.003 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 400);
    let height = (canvas.height = 400);

    // Coordinate settings
    const rBase = 110; // Sphere radius
    let r = rBase;
    const center = { x: width / 2, y: height / 2 };
    
    // Generate nodes on a sphere (latitude and longitude)
    const nodes: Node3D[] = [];
    const latCount = 8;
    const lonCount = 14;

    for (let i = 1; i < latCount; i++) {
      const theta = (i * Math.PI) / latCount;
      for (let j = 0; j < lonCount; j++) {
        const phi = (j * 2 * Math.PI) / lonCount;
        nodes.push({
          x: Math.sin(theta) * Math.cos(phi),
          y: Math.sin(theta) * Math.sin(phi),
          z: Math.cos(theta),
        });
      }
    }

    // Add poles for geodesic completeness
    nodes.push({ x: 0, y: 0, z: 1 });
    nodes.push({ x: 0, y: 0, z: -1 });

    // Node rotation angles
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Mouse coordinate from -1 to 1 relative to canvas center
      mouseRef.current.targetX = (clientX / rect.width) * 2 - 1;
      mouseRef.current.targetY = (clientY / rect.height) * 2 - 1;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check current hover speeds
      const speedMultiplier = isHovered ? 3.5 : 1.0;
      r += ((isHovered ? rBase * 1.15 : rBase) - r) * 0.1; // Glow pulse

      // Smoothly update angles
      angleX += rotationRef.current.x * speedMultiplier;
      angleY += rotationRef.current.y * speedMultiplier;
      angleZ += rotationRef.current.z * speedMultiplier;

      // Mouse coordinates damping for responsive look
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      // Pan center slightly on mouse move for physical displacement
      const cx = center.x + mouseRef.current.x * 20;
      const cy = center.y + mouseRef.current.y * 20;

      // Projected nodes cache
      const projected: Node3D[] = [];

      // Rotate and project all nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // 3D rotations
        // 1. Rotate Y
        let x1 = node.x * Math.cos(angleY) - node.z * Math.sin(angleY);
        let z1 = node.x * Math.sin(angleY) + node.z * Math.cos(angleY);

        // 2. Rotate X
        let y2 = node.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = node.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // 3. Rotate Z
        let x3 = x1 * Math.cos(angleZ) - y2 * Math.sin(angleZ);
        let y3 = x1 * Math.sin(angleZ) + y2 * Math.cos(angleZ);

        // Perspective scaling
        const scale = 250 / (250 + z2 * rBase); // Depth factor
        const px = x3 * r * scale + cx;
        const py = y3 * r * scale + cy;

        projected.push({
          x: x3,
          y: y3,
          z: z2,
          px,
          py,
          depthRatio: (z2 + 1) / 2, // 0 (far) to 1 (near)
        });
      }

      // Draw Edges (connections)
      ctx.lineWidth = 1.0;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (!p1.px || !p1.py) continue;

        // Connect nodes that are close to each other in 3D space to form a wireframe grid
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (!p2.px || !p2.py) continue;

          // Euclidean distance in initial local coordinates
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Threshold for creating grid segments
          if (dist < 0.45) {
            const avgDepth = ((p1.depthRatio || 0) + (p2.depthRatio || 0)) / 2;

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);

            // Edge gradient/opacity depending on hover and depth
            const alpha = (0.05 + avgDepth * 0.25) * (isHovered ? 1.5 : 1);
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`; // Pink theme
            ctx.stroke();
          }
        }
      }

      // Draw Vertices (nodes)
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (!p.px || !p.py || p.depthRatio === undefined) continue;

        const size = (1.5 + p.depthRatio * 2.5) * (isHovered ? 1.4 : 1.0);
        
        ctx.beginPath();
        ctx.arc(p.px, p.py, size, 0, Math.PI * 2);

        // Core fill (gradient depending on depth)
        const gradient = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, size * 2);
        
        if (p.depthRatio > 0.6) {
          // Front nodes: bright orange/pink glowing dots
          gradient.addColorStop(0, "rgba(249, 115, 22, 1.0)"); // Orange
          gradient.addColorStop(1, "rgba(236, 72, 153, 0.0)"); // Pink fade
        } else {
          // Back nodes: dim purple dots
          gradient.addColorStop(0, "rgba(168, 85, 247, 0.7)"); // Purple
          gradient.addColorStop(1, "rgba(168, 85, 247, 0.0)");
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Extra glowing ring for front-most vertices when hovered
        if (isHovered && p.depthRatio > 0.8) {
          ctx.beginPath();
          ctx.arc(p.px, p.py, size * 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovered]);

  return (
    <div
      className="absolute flex items-center justify-center pointer-events-auto"
      style={{ width: "350px", height: "350px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer filter drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]"
      />
    </div>
  );
}
