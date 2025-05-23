"use client";

import { MDXRemote } from 'next-mdx-remote';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { DocContent as DocContentType } from '@/lib/docs';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import Image from 'next/image';
import anime from 'animejs';

interface DocContentProps {
  content: DocContentType;
}

// Download buttons card component
function DownloadCard() {
  return (
    <div className="absolute right-[-270px] top-3 w-[250px] bg-card/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col gap-2 z-20">
      <h4 className="text-xs font-medium text-center text-foreground/80 mb-1">Download</h4>
      <button
        onClick={() => {
          // In a real app, this would trigger the PDF download
          alert('Downloading PDF...');
        }}
        className="flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M9 15h6"></path>
          <path d="M9 18h6"></path>
          <path d="M9 12h2"></path>
        </svg>
        PDF
      </button>
      <button
        onClick={() => {
          // In a real app, this would trigger the Word doc download
          alert('Downloading Word doc...');
        }}
        className="flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <polyline points="16 13 8 13"></polyline>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Word
      </button>
    </div>
  );
}

// Content decorative lines component
function ContentDecorativeLines() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hrElements, setHrElements] = useState<Element[]>([]);
  
  // Find all HR elements and set up decorative lines
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Delayed check for HR elements to ensure content is loaded
    const timeout = setTimeout(() => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;
      
      const hrs = parent.querySelectorAll('hr');
      setHrElements(Array.from(hrs));
      
      // Set up initial decorative elements
      hrs.forEach((hr, index) => {
        const hrRect = hr.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        
        // Create left decorative elements
        const leftVerticalLine = document.createElement('div');
        leftVerticalLine.className = `hr-deco-vline-left-${index} absolute w-px bg-primary/30`;
        leftVerticalLine.style.height = '60px';
        leftVerticalLine.style.left = '240px';
        leftVerticalLine.style.top = `${hrRect.top - parentRect.top - 30}px`;
        
        const leftPlus = document.createElement('div');
        leftPlus.className = `hr-deco-plus-left-${index} absolute text-primary/50`;
        leftPlus.textContent = '+';
        leftPlus.style.fontSize = '20px';
        leftPlus.style.left = '24px';
        leftPlus.style.top = `${hrRect.top - parentRect.top}px`;
        leftPlus.style.transform = 'translate(-50%, -50%)';
        
        const leftHLine = document.createElement('div');
        leftHLine.className = `hr-deco-hline-left-${index} absolute h-px bg-primary/30`;
        leftHLine.style.width = '12px';
        leftHLine.style.left = '24px';
        leftHLine.style.top = `${hrRect.top - parentRect.top}px`;
        
        // Create right decorative elements
        const rightVerticalLine = document.createElement('div');
        rightVerticalLine.className = `hr-deco-vline-right-${index} absolute w-px bg-primary/30`;
        rightVerticalLine.style.height = '60px';
        rightVerticalLine.style.right = '24px';
        rightVerticalLine.style.top = `${hrRect.top - parentRect.top - 30}px`;
        
        const rightPlus = document.createElement('div');
        rightPlus.className = `hr-deco-plus-right-${index} absolute text-primary/50`;
        rightPlus.textContent = '+';
        rightPlus.style.fontSize = '20px';
        rightPlus.style.right = '24px';
        rightPlus.style.top = `${hrRect.top - parentRect.top}px`;
        rightPlus.style.transform = 'translate(50%, -50%)';
        
        const rightHLine = document.createElement('div');
        rightHLine.className = `hr-deco-hline-right-${index} absolute h-px bg-primary/30`;
        rightHLine.style.width = '12px';
        rightHLine.style.right = '24px';
        rightHLine.style.top = `${hrRect.top - parentRect.top}px`;
        
        containerRef.current?.appendChild(leftVerticalLine);
        containerRef.current?.appendChild(leftPlus);
        containerRef.current?.appendChild(leftHLine);
        containerRef.current?.appendChild(rightVerticalLine);
        containerRef.current?.appendChild(rightPlus);
        containerRef.current?.appendChild(rightHLine);
        
        // Animate entrance
        anime({
          targets: [
            `.hr-deco-vline-left-${index}`,
            `.hr-deco-vline-right-${index}`
          ],
          height: [0, '60px'],
          opacity: [0, 1],
          duration: 800,
          delay: 300,
          easing: 'easeOutQuad'
        });
        
        anime({
          targets: [
            `.hr-deco-hline-left-${index}`,
            `.hr-deco-hline-right-${index}`
          ],
          width: [0, '12px'],
          opacity: [0, 1],
          duration: 600,
          delay: 500,
          easing: 'easeOutQuad'
        });
        
        anime({
          targets: [
            `.hr-deco-plus-left-${index}`,
            `.hr-deco-plus-right-${index}`
          ],
          opacity: [0, 1],
          scale: [0.5, 1],
          duration: 400,
          delay: 700,
          easing: 'easeOutQuad'
        });
      });
      
      // Also add standalone decorative elements not connected to HR
      createStandaloneDecoration(parent, containerRef.current, 'top', '15%');
      createStandaloneDecoration(parent, containerRef.current, 'middle', '50%');
      createStandaloneDecoration(parent, containerRef.current, 'bottom', '80%');
      
    }, 500);
    
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  
  // Handle scroll position
  useEffect(() => {
    if (!containerRef.current || hrElements.length === 0) return;
    
    const handleScroll = () => {
      hrElements.forEach((hr, index) => {
        const hrRect = hr.getBoundingClientRect();
        const isVisible = hrRect.top < window.innerHeight && hrRect.bottom > 0;
        
        if (isVisible) {
          anime({
            targets: [
              `.hr-deco-vline-left-${index}`,
              `.hr-deco-vline-right-${index}`
            ],
            opacity: 0.8,
            duration: 400,
            easing: 'easeOutQuad'
          });
          
          anime({
            targets: [
              `.hr-deco-hline-left-${index}`,
              `.hr-deco-hline-right-${index}`
            ],
            opacity: 0.8,
            width: '20px',
            duration: 600,
            easing: 'easeOutQuad'
          });
          
          anime({
            targets: [
              `.hr-deco-plus-left-${index}`,
              `.hr-deco-plus-right-${index}`
            ],
            opacity: 1,
            scale: 1.1,
            duration: 400,
            easing: 'easeOutQuad'
          });
        } else {
          anime({
            targets: [
              `.hr-deco-vline-left-${index}`,
              `.hr-deco-vline-right-${index}`,
              `.hr-deco-hline-left-${index}`,
              `.hr-deco-hline-right-${index}`,
              `.hr-deco-plus-left-${index}`,
              `.hr-deco-plus-right-${index}`
            ],
            opacity: 0.3,
            duration: 600,
            easing: 'easeOutQuad'
          });
        }
      });
      
      // Animate standalone decorations on scroll as well
      ['top', 'middle', 'bottom'].forEach(pos => {
        const vertLine = document.querySelector(`.standalone-vline-left-${pos}`);
        if (vertLine) {
          const rect = vertLine.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible) {
            anime({
              targets: [
                `.standalone-vline-left-${pos}`,
                `.standalone-vline-right-${pos}`,
                `.standalone-hline-left-${pos}`,
                `.standalone-hline-right-${pos}`
              ],
              opacity: 0.8,
              duration: 400,
              easing: 'easeOutQuad'
            });
            
            anime({
              targets: [
                `.standalone-plus-left-${pos}`,
                `.standalone-plus-right-${pos}`
              ],
              opacity: 1,
              scale: 1.1,
              duration: 400,
              easing: 'easeOutQuad'
            });
          } else {
            anime({
              targets: [
                `.standalone-vline-left-${pos}`,
                `.standalone-vline-right-${pos}`,
                `.standalone-hline-left-${pos}`,
                `.standalone-hline-right-${pos}`,
                `.standalone-plus-left-${pos}`,
                `.standalone-plus-right-${pos}`
              ],
              opacity: 0.3,
              duration: 600,
              easing: 'easeOutQuad'
            });
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hrElements]);
  
  const createStandaloneDecoration = (parent: Element, container: HTMLDivElement, position: string, topPercentage: string) => {
    const parentRect = parent.getBoundingClientRect();
    const topPosition = Math.floor(parentRect.height * (parseInt(topPercentage) / 100));
    
    // Left side
    const leftVerticalLine = document.createElement('div');
    leftVerticalLine.className = `standalone-vline-left-${position} absolute w-px bg-primary/30`;
    leftVerticalLine.style.height = '80px';
    leftVerticalLine.style.left = '24px';
    leftVerticalLine.style.top = `${topPosition - 40}px`;
    leftVerticalLine.style.opacity = '0';
    
    const leftPlus = document.createElement('div');
    leftPlus.className = `standalone-plus-left-${position} absolute text-primary/50`;
    leftPlus.textContent = '+';
    leftPlus.style.fontSize = '20px';
    leftPlus.style.left = '24px';
    leftPlus.style.top = `${topPosition}px`;
    leftPlus.style.transform = 'translate(-50%, -50%)';
    leftPlus.style.opacity = '0';
    
    const leftHLine = document.createElement('div');
    leftHLine.className = `standalone-hline-left-${position} absolute h-px bg-primary/30`;
    leftHLine.style.width = '16px';
    leftHLine.style.left = '24px';
    leftHLine.style.top = `${topPosition}px`;
    leftHLine.style.opacity = '0';
    
    // Right side
    const rightVerticalLine = document.createElement('div');
    rightVerticalLine.className = `standalone-vline-right-${position} absolute w-px bg-primary/30`;
    rightVerticalLine.style.height = '80px';
    rightVerticalLine.style.right = '24px';
    rightVerticalLine.style.top = `${topPosition - 40}px`;
    rightVerticalLine.style.opacity = '0';
    
    const rightPlus = document.createElement('div');
    rightPlus.className = `standalone-plus-right-${position} absolute text-primary/50`;
    rightPlus.textContent = '+';
    rightPlus.style.fontSize = '20px';
    rightPlus.style.right = '24px';
    rightPlus.style.top = `${topPosition}px`;
    rightPlus.style.transform = 'translate(50%, -50%)';
    rightPlus.style.opacity = '0';
    
    const rightHLine = document.createElement('div');
    rightHLine.className = `standalone-hline-right-${position} absolute h-px bg-primary/30`;
    rightHLine.style.width = '16px';
    rightHLine.style.right = '24px';
    rightHLine.style.top = `${topPosition}px`;
    rightHLine.style.opacity = '0';
    
    container.appendChild(leftVerticalLine);
    container.appendChild(leftPlus);
    container.appendChild(leftHLine);
    container.appendChild(rightVerticalLine);
    container.appendChild(rightPlus);
    container.appendChild(rightHLine);
    
    // Animate entrance with delay based on position
    const delay = position === 'top' ? 200 : position === 'middle' ? 400 : 600;
    
    anime({
      targets: [
        `.standalone-vline-left-${position}`,
        `.standalone-vline-right-${position}`
      ],
      height: [0, '80px'],
      opacity: [0, 0.3],
      duration: 800,
      delay: delay,
      easing: 'easeOutQuad'
    });
    
    anime({
      targets: [
        `.standalone-hline-left-${position}`,
        `.standalone-hline-right-${position}`
      ],
      width: [0, '16px'],
      opacity: [0, 0.3],
      duration: 600,
      delay: delay + 200,
      easing: 'easeOutQuad'
    });
    
    anime({
      targets: [
        `.standalone-plus-left-${position}`,
        `.standalone-plus-right-${position}`
      ],
      opacity: [0, 0.5],
      scale: [0.5, 1],
      duration: 400,
      delay: delay + 400,
      easing: 'easeOutQuad'
    });
  };
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
}

// Custom component to handle Wiki-style image references
function WikiImage({ src }: { src: string }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Extract the image name from the src format: ![[Pasted image XXXXX.png]]
  const match = src.match(/\[\[(.*?)\]\]/);
  const imagePath = match ? `/${match[1]}` : '';
  
  console.log("WikiImage - Raw src:", src);
  console.log("WikiImage - Extracted path:", imagePath);
  
  if (!imagePath) {
    return <div>Error: Could not parse image path from {src}</div>;
  }
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="my-8 overflow-hidden rounded-lg shadow-md"
    >
      <Image 
        src={imagePath} 
        alt="Documentation image" 
        width={800}
        height={450}
        className="w-full object-contain"
      />
    </motion.div>
  );
}

// MDX components
const components = {
  h1: ({ children }: { children: React.ReactNode }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
    
    return (
      <motion.h1 
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mt-6 mb-6 text-foreground"
      >
        {children}
      </motion.h1>
    );
  },
  h2: ({ children, id }: { children: React.ReactNode; id?: string }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
    
    return (
      <motion.h2 
        id={id}
        ref={ref}
        initial={{ opacity: 0, y: 15 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-semibold mt-10 mb-4 text-foreground"
      >
        {children}
      </motion.h2>
    );
  },
  h3: ({ children, id }: { children: React.ReactNode; id?: string }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
    
    return (
      <motion.h3 
        id={id}
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        className="text-xl font-medium mt-8 mb-3 text-foreground"
      >
        {children}
      </motion.h3>
    );
  },
  p: ({ children }: { children: React.ReactNode }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
    
    return (
      <motion.p 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="my-4 leading-7 text-foreground/90"
      >
        {children}
      </motion.p>
    );
  },
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-foreground/90">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground/90">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary/70 pl-4 my-6 italic text-foreground/80">
      {children}
    </blockquote>
  ),
  img: ({ src, alt }: { src: string; alt: string }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
    
    console.log("Image component received src:", src);
    
    // Check if this is a wiki-style image reference
    if (src && (src.includes('[[') || src.startsWith('!'))) {
      return <WikiImage src={src} />;
    }
    
    // For normal image paths
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="my-8 overflow-hidden rounded-lg shadow-md"
      >
        <Image 
          src={src} 
          alt={alt || "Documentation image"} 
          width={800}
          height={450}
          className="w-full object-contain"
        />
      </motion.div>
    );
  },
  pre: ({ children }: { children: React.ReactNode }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <pre className="my-6 overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          {children}
        </pre>
        <button 
          onClick={() => {
            const pre = document.querySelector('pre');
            if (pre) {
              const code = pre.textContent || '';
              navigator.clipboard.writeText(code);
            }
          }}
          className="absolute top-4 right-4 p-1 rounded-md bg-muted-foreground/20 hover:bg-muted-foreground/30 text-muted-foreground"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </button>
      </motion.div>
    );
  },
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
      {children}
    </code>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="border-b">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="border-b border-muted m-0 p-0 even:bg-muted/50">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="border px-4 py-2 text-left font-bold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="border px-4 py-2 text-left text-foreground/90">
      {children}
    </td>
  ),
  hr: () => {
    return (
      <div className="relative">
        <hr className="my-8 border-muted" />
      </div>
    );
  },
  'wiki-image': WikiImage,
};

export default function DocContent({ content }: DocContentProps) {
  const [contentVisible, setContentVisible] = useState(false);
  
  // Process content to handle wiki-style image references
  useEffect(() => {
    const processImages = () => {
      // Find all wiki-style image references in the document
      const wikiImages = document.querySelectorAll('p');
      
      wikiImages.forEach(p => {
        const text = p.textContent || '';
        if (text.startsWith('![[') && text.includes(']]')) {
          console.log("Found wiki image reference:", text);
          
          // Create a new image element
          const img = document.createElement('img');
          const match = text.match(/\[\[(.*?)\]\]/);
          if (match && match[1]) {
            img.src = `/${match[1]}`;
            img.alt = "Documentation image";
            img.className = "wiki-image";
            
            // Replace the paragraph with the image
            p.parentNode?.replaceChild(img, p);
          }
        }
      });
    };
    
    Prism.highlightAll();
    
    // Add a slight delay for the content to fade in and process images
    const timer = setTimeout(() => {
      setContentVisible(true);
      processImages();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative prose prose-purple dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-headings:font-semibold prose-img:rounded-lg bg-card/50 backdrop-blur-sm shadow-xl rounded-xl p-8 md:p-12"
    >
      <DownloadCard />
      <div className="relative z-10">
        <MDXRemote {...content.mdxSource} components={components} />
      </div>
      <ContentDecorativeLines />
    </motion.article>
  );
}