import { useEffect, useRef } from "react";
import { usePortfolio } from "../hooks/usePortfolio";

interface TagItem {
  text: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  isHovered: boolean;
}

export default function SkillsGlobe3D() {
  const { skills } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Flatten skills into a single array of strings
  const tagsList = skills.categories.flatMap((cat) => cat.items);
  
  // Track dragging state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const spinSpeed = useRef({ x: 0.003, y: 0.003 });
  const activeHoverTag = useRef<TagItem | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    
    // Canvas sizing with High-DPI support
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = 450;
    const displayHeight = 450;
    
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = displayWidth;
    const height = displayHeight;
    const center = { x: width / 2, y: height / 2 };
    const radius = 160; // sphere radius
    const focalLength = 300;

    // Distribute tags uniformly on a 3D sphere using Golden Section Spiral (Fibonacci sphere)
    const tags: TagItem[] = [];
    const numTags = tagsList.length;

    for (let i = 0; i < numTags; i++) {
      const k = -1 + (2 * i) / (numTags - 1);
      const theta = Math.acos(k);
      const phi = Math.sqrt(numTags * Math.PI) * theta;

      tags.push({
        text: tagsList[i],
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta),
        width: 0,
        height: 0,
        isHovered: false,
      });
    }

    // Interactive tracking variables
    let mouseX = 0;
    let mouseY = 0;

    const rotateTags = (ax: number, ay: number) => {
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);

      for (let i = 0; i < tags.length; i++) {
        const t = tags[i];

        // 1. Rotate Y (left-right)
        const x1 = t.x * cosY - t.z * sinY;
        const z1 = t.x * sinY + t.z * cosY;

        // 2. Rotate X (up-down)
        const y2 = t.y * cosX - z1 * sinX;
        const z2 = t.y * sinX + z1 * cosX;

        t.x = x1;
        t.y = y2;
        t.z = z2;
      }
    };

    // Event listeners for dragging / rotating
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (isDragging.current) {
        const dx = e.clientX - previousMousePosition.current.x;
        const dy = e.clientY - previousMousePosition.current.y;

        // Drag rotations
        spinSpeed.current = {
          x: dy * 0.005,
          y: -dx * 0.005,
        };

        rotateTags(spinSpeed.current.x, spinSpeed.current.y);

        previousMousePosition.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Attach event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Apply default spinning inertia with decay when not dragging
      if (!isDragging.current) {
        // Decay speed towards calm auto-rotation
        spinSpeed.current.x += (0.0012 - spinSpeed.current.x) * 0.05;
        spinSpeed.current.y += (0.0015 - spinSpeed.current.y) * 0.05;
        rotateTags(spinSpeed.current.x, spinSpeed.current.y);
      }

      // Projection calculation and tag hover testing
      let hoveredItem: TagItem | null = null;

      // Sort tags by Z (depth) so we draw back tags first, then front tags (painter's algorithm)
      const sortedTags = [...tags].sort((a, b) => b.z - a.z);

      // Pre-calculate positions and test hover on top-most (front) items first
      for (let i = 0; i < sortedTags.length; i++) {
        const t = sortedTags[i];
        const scale = focalLength / (focalLength + t.z * radius);
        const px = t.x * radius * scale + center.x;
        const py = t.y * radius * scale + center.y;

        // Approx size estimation for mouse hover collision
        const fontSize = Math.max(10, Math.floor(13 + (1 - t.z) * 8));
        ctx.font = `bold ${fontSize}px "Kanit", sans-serif`;
        const textWidth = ctx.measureText(t.text).width;
        const textHeight = fontSize;

        t.width = textWidth;
        t.height = textHeight;

        // Check if mouse is hovering (only if Z depth is in front space, i.e., t.z <= 0.2)
        if (!isDragging.current && t.z <= 0.3) {
          const isMouseOver =
            mouseX >= px - textWidth / 2 - 10 &&
            mouseX <= px + textWidth / 2 + 10 &&
            mouseY >= py - textHeight / 2 - 8 &&
            mouseY <= py + textHeight / 2 + 8;

          if (isMouseOver && !hoveredItem) {
            hoveredItem = t;
          }
        }
      }

      // Reset hover status
      for (let i = 0; i < tags.length; i++) {
        tags[i].isHovered = false;
      }
      
      activeHoverTag.current = hoveredItem;
      if (hoveredItem) {
        hoveredItem.isHovered = true;
        // Pause auto rotation slightly when hovering over a tag
        if (!isDragging.current) {
          spinSpeed.current.x *= 0.85;
          spinSpeed.current.y *= 0.85;
        }
      }

      // Draw the tags sequentially (back to front)
      for (let i = 0; i < sortedTags.length; i++) {
        const t = sortedTags[i];
        const scale = focalLength / (focalLength + t.z * radius);
        const px = t.x * radius * scale + center.x;
        const py = t.y * radius * scale + center.y;

        // Font scaling based on depth
        // Z is in range -1 (nearest) to 1 (farthest)
        // Closer tags (Z < 0) are larger and brighter
        const depthAlpha = Math.max(0.12, 1 - (t.z + 1) / 2);
        const fontSize = Math.max(9, Math.floor(12 + (1 - t.z) * 11));

        ctx.font = `bold ${fontSize}px "Kanit", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (t.isHovered) {
          // Hover state: Glow text with modern hot pink neon shadow
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#ec4899";
          ctx.fillStyle = "#ffffff";
          ctx.scale(1.2, 1.2); // Hover 3D pop scaling
          ctx.fillText(t.text, px / 1.2, py / 1.2);
          ctx.scale(1 / 1.2, 1 / 1.2);
          ctx.shadowBlur = 0; // Reset shadow
        } else {
          // Normal state: Gradient or alpha shade depending on depth
          if (t.z < -0.4) {
            // Front-most elements get nice gradient fills
            const grad = ctx.createLinearGradient(px - t.width / 2, py, px + t.width / 2, py);
            grad.addColorStop(0, `rgba(168, 85, 247, ${depthAlpha * 1.3})`); // Purple
            grad.addColorStop(0.5, `rgba(236, 72, 153, ${depthAlpha * 1.3})`); // Pink
            grad.addColorStop(1, `rgba(249, 115, 22, ${depthAlpha * 1.3})`); // Orange
            ctx.fillStyle = grad;
          } else {
            // Further back: clean white/gray transparent
            ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.85})`;
          }
          
          ctx.fillText(t.text, px, py);
        }

        // Draw connecting 3D orbital orbits for an extra high-tech look
        if (t.isHovered) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(236, 72, 153, 0.15)";
          ctx.lineWidth = 0.5;
          ctx.arc(center.x, center.y, radius * scale * 1.1, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Update cursor feedback
      canvas.style.cursor = activeHoverTag.current ? "pointer" : isDragging.current ? "grabbing" : "grab";

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [tagsList.length]);

  return (
    <div className="relative flex justify-center items-center select-none w-full max-w-[450px] mx-auto h-[450px]">
      {/* Background glow beneath globe */}
      <div className="absolute inset-0 rounded-full blur-3xl opacity-15 accent-gradient scale-50 pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
