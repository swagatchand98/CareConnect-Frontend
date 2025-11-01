import React, { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  delay?: number;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ customClass, children, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-gray-300 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 shadow-lg ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

const CardSwap: React.FC<CardSwapProps> = ({
  width = 300,
  height = 200,
  delay = 3000,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cards = cardsRef.current;
    if (cards.length === 0) return;

    // Initial positioning
    cards.forEach((card, i) => {
      if (card) {
        gsap.set(card, {
          x: i * 20,
          y: -i * 20,
          z: -i * 50,
          xPercent: -50,
          yPercent: -50,
          zIndex: cards.length - i,
          transformOrigin: 'center center'
        });
      }
    });

    let currentIndex = 0;

    const animateCards = () => {
      if (cards.length < 2) return;

      const frontCard = cards[currentIndex];
      if (!frontCard) return;

      const tl = gsap.timeline();

      // Move front card down and out
      tl.to(frontCard, {
        y: '+=400',
        rotation: 10,
        duration: 1,
        ease: 'power2.in'
      });

      // Move other cards forward
      cards.forEach((card, i) => {
        if (i !== currentIndex && card) {
          const newIndex = i > currentIndex ? i - 1 : i;
          tl.to(card, {
            x: newIndex * 20,
            y: -newIndex * 20,
            z: -newIndex * 50,
            zIndex: cards.length - newIndex,
            duration: 0.8,
            ease: 'power2.out'
          }, '-=0.5');
        }
      });

      // Move front card to back
      tl.to(frontCard, {
        x: (cards.length - 1) * 20,
        y: -(cards.length - 1) * 20,
        z: -(cards.length - 1) * 50,
        rotation: 0,
        zIndex: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.3');

      currentIndex = (currentIndex + 1) % cards.length;
    };

    const interval = setInterval(animateCards, delay);

    return () => {
      clearInterval(interval);
    };
  }, [delay]);

  const childArray = React.Children.toArray(children);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ 
        width, 
        height, 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {childArray.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            key: index,
            ref: (el: HTMLDivElement) => {
              if (el) cardsRef.current[index] = el;
            },
            style: { width, height }
          });
        }
        return child;
      })}
    </div>
  );
};

export default CardSwap;
