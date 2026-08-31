import React, { useRef, useEffect } from 'react';

export default function BoundingBoxCanvas({ imageUrl, boundingBox, damageType, confidence, severityScore }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width || 600;
      canvas.height = img.height || 400;

      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Parse Bounding Box (x, y, w, h in percentages 0-100)
      let bbox = { x: 25, y: 25, w: 40, h: 40 };
      if (typeof boundingBox === 'string') {
        try {
          bbox = JSON.parse(boundingBox);
        } catch (e) {
          // fallback
        }
      } else if (typeof boundingBox === 'object' && boundingBox !== null) {
        bbox = boundingBox;
      }

      const bx = (bbox.x / 100) * canvas.width;
      const by = (bbox.y / 100) * canvas.height;
      const bw = (bbox.w / 100) * canvas.width;
      const bh = (bbox.h / 100) * canvas.height;

      // Determine colors based on severity
      const isCritical = (severityScore || 80) >= 80;
      const strokeColor = isCritical ? '#F43F5E' : '#06B6D4';
      const fillColor = isCritical ? 'rgba(244, 63, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)';

      // Fill detection region
      ctx.fillStyle = fillColor;
      ctx.fillRect(bx, by, bw, bh);

      // Draw glowing bounding box border
      ctx.lineWidth = 4;
      ctx.strokeStyle = strokeColor;
      ctx.strokeRect(bx, by, bw, bh);

      // Draw HUD Corner Accents
      const cornerLen = Math.min(bw, bh) * 0.25;
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#00F0FF';

      // Top-Left corner
      ctx.beginPath();
      ctx.moveTo(bx, by + cornerLen);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + cornerLen, by);
      ctx.stroke();

      // Bottom-Right corner
      ctx.beginPath();
      ctx.moveTo(bx + bw, by + bh - cornerLen);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw - cornerLen, by + bh);
      ctx.stroke();

      // Label background box
      const confPct = Math.round((confidence || 0.92) * 100);
      const labelText = `${damageType || 'Pothole'} (${confPct}%)`;

      ctx.font = 'bold 16px Outfit, sans-serif';
      const textMetrics = ctx.measureText(labelText);
      const textWidth = textMetrics.width + 20;

      ctx.fillStyle = strokeColor;
      ctx.fillRect(bx, Math.max(by - 32, 0), textWidth, 30);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(labelText, bx + 10, Math.max(by - 10, 20));
    };
  }, [imageUrl, boundingBox, damageType, confidence, severityScore]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-slate-950">
      <canvas ref={canvasRef} className="w-full h-auto object-contain max-h-[450px]" />
      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-wider flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>AI NEURAL OVERLAY ACTIVE</span>
      </div>
    </div>
  );
}
