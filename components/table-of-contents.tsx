"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[];
  activeSection: string;
}

export default function TableOfContents({ headings, activeSection }: TableOfContentsProps) {
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    // Prevent default behavior and event bubbling
    event?.preventDefault();
    event?.stopPropagation();
    
    if (!id) return;
    
    // Use a timeout to ensure DOM is fully processed
    setTimeout(() => {
      // Try multiple approaches to find the element
      let element = null;
      
      // Direct ID match
      element = document.getElementById(id);
      
      // Try different strategies if element not found
      if (!element) {
        // Check for headings with this ID
        const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
          .map(tag => `${tag}[id="${id}"]`)
          .join(', ');
        element = document.querySelector(headingSelectors);
        
        // Try data-id attribute
        if (!element) {
          element = document.querySelector(`[data-id="${id}"]`);
        }
        
        // Try anchor with name attribute
        if (!element) {
          element = document.querySelector(`a[name="${id}"]`);
        }
        
        // Look for heading text that matches
        if (!element) {
          const matchingHeading = headings.find(h => h.id === id);
          if (matchingHeading) {
            const textContent = matchingHeading.text.replace(/\*\*/g, '');
            const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            
            for (const heading of allHeadings) {
              if (heading.textContent?.trim() === textContent) {
                element = heading;
                console.log(`Found heading via text content match: ${textContent}`);
                break;
              }
              
              // Try a more lenient match
              if (heading.textContent?.trim().includes(textContent) || 
                  textContent.includes(heading.textContent?.trim() || '')) {
                element = heading;
                console.log(`Found heading via partial text match: ${textContent}`);
                break;
              }
            }
          }
        }
      }
      
      if (element) {
        console.log(`Found element for navigation: ${id}`);
        
        // Add temporary highlight effect
        element.classList.add('toc-highlight');
        
        // Get the element's position with respect to the viewport
        const rect = element.getBoundingClientRect();
        
        // Scroll with offset for header
        window.scrollTo({
          top: window.scrollY + rect.top - 100, // Offset for fixed header
          behavior: 'smooth'
        });
        
        // Set focus on the element for accessibility
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
        
        // Remove highlight after animation completes
        setTimeout(() => {
          element?.classList.remove('toc-highlight');
        }, 2000);
      } else {
        console.warn(`Could not find element with id: ${id}`);
        
        // Fallback - try to find any heading that might be related
        const headingText = headings.find(h => h.id === id)?.text;
        if (headingText) {
          try {
            const searchText = headingText.toLowerCase().replace(/\*\*/g, '');
            const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
            
            for (const el of allElements) {
              const elText = el.textContent?.toLowerCase() || '';
              if (elText.includes(searchText) || searchText.includes(elText)) {
                console.log(`Found fallback element via text search: ${elText}`);
                
                el.classList.add('toc-highlight');
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                setTimeout(() => {
                  el.classList.remove('toc-highlight');
                }, 2000);
                break;
              }
            }
          } catch (err) {
            console.error("Error in fallback search:", err);
          }
        }
      }
    }, 50); // Small delay to ensure DOM is ready
  };
  
  // Function to clean heading text - remove asterisks
  const cleanHeadingText = (text: string) => {
    return text.replace(/\*\*/g, '');
  };

  // Don't render content until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="mt-8 py-4 pl-2">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Table of Contents</h2>
      
      <ScrollArea className="h-[calc(100vh-15rem)]">
        <nav className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToSection(heading.id)}
              className={cn(
                "flex items-start w-full px-2 py-1.5 text-sm rounded-md transition-colors text-left",
                "hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                {
                  "text-primary font-medium bg-muted/30": activeSection === heading.id,
                  "text-muted-foreground": activeSection !== heading.id,
                  "pl-4": heading.level === 2,
                  "pl-6": heading.level === 3,
                  "pl-8": heading.level === 4,
                  "pl-10": heading.level === 5,
                }
              )}
            >
              <div className="flex items-center">
                {activeSection === heading.id && (
                  <motion.div
                    layoutId="activeSectionIndicator"
                    className="w-1 h-5 bg-primary rounded-full mr-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <span>{cleanHeadingText(heading.text)}</span>
              </div>
            </button>
          ))}
        </nav>
      </ScrollArea>
      
      <style jsx global>{`
        .toc-highlight {
          animation: toc-highlight-pulse 2s ease-in-out;
        }
        
        @keyframes toc-highlight-pulse {
          0%, 100% { background-color: transparent; }
          20%, 60% { background-color: rgba(147, 51, 234, 0.15); }
        }
      `}</style>
    </div>
  );
}