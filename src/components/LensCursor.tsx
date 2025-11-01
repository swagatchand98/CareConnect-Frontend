'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface LensCursorProps {
  size?: number;
  zoomLevel?: number;
  borderWidth?: number;
  borderColor?: string;
  className?: string;
  damping?: number;
}

const LensCursor: React.FC<LensCursorProps> = ({
  size = 150,
  zoomLevel = 1.5,
  borderWidth = 2,
  borderColor = '#3b82f6',
  className = '',
  damping = 0.1
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const lensRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Smooth damped movement
  const updateLensPosition = useCallback(() => {
    setLensPosition(prev => ({
      x: prev.x + (mousePosition.x - prev.x) * damping,
      y: prev.y + (mousePosition.y - prev.y) * damping
    }));
  }, [mousePosition, damping]);

  // Animation loop for smooth following
  useEffect(() => {
    const animate = () => {
      updateLensPosition();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, updateLensPosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Add event listeners to the document
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Update lens position
  useEffect(() => {
    if (!lensRef.current) return;

    const lens = lensRef.current;
    lens.style.left = `${lensPosition.x - size / 2}px`;
    lens.style.top = `${lensPosition.y - size / 2}px`;

    // Create magnification effect using CSS transform
    const backgroundX = -((lensPosition.x - size / 2) * (zoomLevel - 1));
    const backgroundY = -((lensPosition.y - size / 2) * (zoomLevel - 1));
    
    lens.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
    lens.style.backgroundSize = `${window.innerWidth * zoomLevel}px ${window.innerHeight * zoomLevel}px`;
  }, [lensPosition, size, zoomLevel]);

  return (
    <>
      {/* Lens cursor */}
      <motion.div
        ref={lensRef}
        className={`fixed pointer-events-none z-50 rounded-full overflow-hidden ${className}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0 
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeOut" 
        }}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `${borderWidth}px solid ${borderColor}`,
          boxShadow: `
            inset 0 0 20px rgba(59, 130, 246, 0.2),
            0 0 30px rgba(59, 130, 246, 0.2),
            0 0 60px rgba(59, 130, 246, 0.1)
          `,
          backdropFilter: 'blur(0.5px) brightness(1.2) contrast(1.5)',
          backgroundImage: `
            radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%),
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59,130,246,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')
          `,
          backgroundRepeat: 'no-repeat, repeat',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Magnification overlay */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at center, 
                rgba(255, 255, 255, 0.15) 0%, 
                rgba(59, 130, 246, 0.08) 30%, 
                rgba(59, 130, 246, 0.03) 60%,
                transparent 80%
              )
            `,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center',
          }}
        />  

        {/* Lens ring effect */}
        <div 
          className="absolute inset-1 rounded-full pointer-events-none border border-white/20"
          style={{
            boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.1)',
          }}
        />
      </motion.div>
    </>
  );
};

export default LensCursor;
