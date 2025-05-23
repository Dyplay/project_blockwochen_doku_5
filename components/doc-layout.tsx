"use client";

import { useEffect, useState, useRef } from 'react';
import { DocContent } from '@/lib/docs';
import ThreeBackground from '@/components/three-background';
import TableOfContents from '@/components/table-of-contents';
import DocContentComponent from '@/components/doc-content';
import ProgressIndicator from '@/components/progress-indicator';
import SearchBar from '@/components/search-bar';
import { motion } from 'framer-motion';
import anime from 'animejs';

// Decorative interface lines component
function DecorativeLines({ scrollProgress }: { scrollProgress: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Animation based on scroll position
    anime({
      targets: '.vertical-line',
      height: `${Math.min(70 + scrollProgress * 0.3, 100)}%`,
      opacity: scrollProgress > 5 ? 0.6 : 0.2,
      duration: 800,
      easing: 'easeOutExpo'
    });
    
    anime({
      targets: '.horizontal-line',
      width: `${Math.min(30 + scrollProgress * 0.7, 100)}%`,
      opacity: scrollProgress > 5 ? 0.5 : 0.2,
      duration: 800,
      easing: 'easeOutExpo'
    });
    
    anime({
      targets: '.plus-symbol',
      opacity: scrollProgress > 10 ? 0.8 : 0.2,
      scale: scrollProgress > 10 ? 1 : 0.5,
      duration: 400,
      easing: 'easeOutQuad'
    });
    
  }, [scrollProgress]);
  
  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0">
      {/* Left side decorations */}
      <div className="absolute left-0 top-0 bottom-0 w-24">
        <div className="vertical-line absolute left-12 top-0 w-px bg-primary/20 h-0"></div>
        <div className="horizontal-line absolute left-12 top-[15%] h-px bg-primary/20 w-0"></div>
        <div className="plus-symbol absolute left-12 top-[15%] text-primary/40 opacity-0" style={{ fontSize: '24px', transform: 'translate(-50%, -50%)' }}>+</div>
        
        <div className="vertical-line absolute left-12 top-[40%] w-px bg-primary/20 h-0"></div>
        <div className="horizontal-line absolute left-12 top-[40%] h-px bg-primary/20 w-0"></div>
        <div className="plus-symbol absolute left-12 top-[40%] text-primary/40 opacity-0" style={{ fontSize: '24px', transform: 'translate(-50%, -50%)' }}>+</div>
        
        <div className="vertical-line absolute left-12 bottom-[25%] w-px bg-primary/20 h-0"></div>
        <div className="plus-symbol absolute left-12 bottom-[25%] text-primary/40 opacity-0" style={{ fontSize: '24px', transform: 'translate(-50%, -50%)' }}>+</div>
      </div>
      
      {/* Right side decorations */}
      <div className="absolute right-0 top-0 bottom-0 w-24">
        <div className="vertical-line absolute right-12 top-0 w-px bg-primary/20 h-0"></div>
        <div className="horizontal-line absolute right-12 top-[20%] h-px bg-primary/20 w-0"></div>
        <div className="plus-symbol absolute right-12 top-[20%] text-primary/40 opacity-0" style={{ fontSize: '24px', transform: 'translate(50%, -50%)' }}>+</div>
        
        <div className="vertical-line absolute right-12 top-[45%] w-px bg-primary/20 h-0"></div>
        <div className="horizontal-line absolute right-12 top-[45%] h-px bg-primary/20 w-0"></div>
        <div className="plus-symbol absolute right-12 top-[45%] text-primary/40 opacity-0" style={{ fontSize: '24px', transform: 'translate(50%, -50%)' }}>+</div>
        
        <div className="vertical-line absolute right-12 bottom-[15%] w-px bg-primary/20 h-0"></div>
        <div className="plus-symbol absolute right-12 bottom-[15%] text-primary/40 opacity-0" style={{ fontSize: '24px', transform: 'translate(50%, -50%)' }}>+</div>
      </div>
    </div>
  );
}

interface DocLayoutProps {
  content: DocContent;
}

export default function DocLayout({ content }: DocLayoutProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
      
      // Determine active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (scrollTop >= sectionTop - 100) {
          currentSection = section.id;
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-purple-950/30">
      <ThreeBackground scrollProgress={scrollProgress} />
      <DecorativeLines scrollProgress={scrollProgress} />
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto hidden lg:block">
            <SearchBar content={content} />
            <TableOfContents 
              headings={content.headings} 
              activeSection={activeSection}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ProgressIndicator progress={scrollProgress} />
            <DocContentComponent content={content} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}