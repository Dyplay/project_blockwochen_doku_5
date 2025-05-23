"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocContent } from '@/lib/docs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  content: DocContent;
}

export default function SearchBar({ content }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; text: string; context: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simple search through headings and content
    const results: { id: string; text: string; context: string }[] = [];
    
    // Search headings
    content.headings.forEach((heading) => {
      if (heading.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({
          id: heading.id,
          text: heading.text,
          context: `Heading level ${heading.level}`
        });
      }
    });
    
    // Search content paragraphs (simplified for this demo)
    const contentText = content.plainText;
    const regex = new RegExp(`(.{0,40}${searchQuery}.{0,40})`, 'gi');
    const matches = contentText.match(regex);
    
    if (matches) {
      matches.forEach((match, index) => {
        // Find nearest heading
        let nearestHeadingId = '';
        let nearestHeadingText = '';
        
        const matchStartPos = contentText.indexOf(match);
        let minDistance = Infinity;
        
        content.headings.forEach((heading) => {
          const headingPos = contentText.indexOf(heading.text);
          if (headingPos !== -1 && headingPos <= matchStartPos) {
            const distance = matchStartPos - headingPos;
            if (distance < minDistance) {
              minDistance = distance;
              nearestHeadingId = heading.id;
              nearestHeadingText = heading.text;
            }
          }
        });
        
        results.push({
          id: nearestHeadingId || 'content-match-' + index,
          text: `...${match.replace(
            new RegExp(searchQuery, 'gi'),
            (match) => `<mark>${match}</mark>`
          )}...`,
          context: nearestHeadingText ? `Near "${nearestHeadingText}"` : 'In content'
        });
      });
    }
    
    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery, content]);

  // Improved scrollToResult function
  const scrollToResult = (id: string) => {
    try {
      // Wait a moment for any click events to resolve before proceeding
      setTimeout(() => {
        // First try finding the element by ID
        let targetElement = document.getElementById(id);
        
        // If we can't find it by ID but it's a content match, try to navigate to the nearest heading
        if (!targetElement && id.startsWith('content-match-')) {
          // Try to find a valid heading from the corresponding search result
          const resultItem = searchResults.find(result => result.id === id);
          if (resultItem && resultItem.context.startsWith('Near "')) {
            // Extract heading text from context
            const headingText = resultItem.context.substring(6, resultItem.context.length - 1);
            
            // Try to find the heading in the DOM
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            for (const heading of headings) {
              if (heading.textContent?.includes(headingText) && heading.id) {
                targetElement = heading;
                break;
              }
            }
          }
        }
        
        // If we found a target element, scroll to it
        if (targetElement) {
          // Add a highlight effect to make it more visible
          targetElement.classList.add('search-highlight');
          
          // Scroll to the element with offset for header
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
          
          // Remove highlight after a moment
          setTimeout(() => {
            targetElement?.classList.remove('search-highlight');
          }, 2000);
          
          // Reset search state
          setSearchQuery('');
          setIsFocused(false);
          
          // Focus on the element for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
          
          console.log(`Navigated to element with ID: ${targetElement.id}`);
        } else {
          console.warn(`Could not find element with ID: ${id}`);
          
          // Even if we can't find the exact element, try to scroll to an approximate area
          // based on the nearest heading we can find
          const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .filter(h => h.id);
            
          if (allHeadings.length > 0) {
            const targetHeading = allHeadings[0] as HTMLElement;
            window.scrollTo({
              top: targetHeading.offsetTop - 100,
              behavior: 'smooth'
            });
            
            setSearchQuery('');
            setIsFocused(false);
          }
        }
      }, 50);
    } catch (error) {
      console.error("Error navigating to search result:", error);
    }
  };

  return (
    <div className="relative">
      <motion.div 
        className={cn(
          "flex items-center space-x-2 mb-2 bg-background/50 rounded-lg",
          "border border-transparent transition-all",
          isFocused ? "shadow-lg border-primary/50" : "shadow-sm"
        )}
        animate={{
          width: isFocused ? "100%" : "100%",
          scale: isFocused ? 1.03 : 1,
          borderRadius: isFocused ? "0.75rem" : "0.5rem"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="flex items-center w-full px-3 py-2"
          animate={{ 
            backgroundColor: isFocused ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0)"
          }}
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-muted-foreground mr-2"
            animate={{ 
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? "#9333EA" : "#64748b" 
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </motion.svg>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            className="w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
        </motion.div>
      </motion.div>
      
      <AnimatePresence>
        {searchQuery.length >= 2 && (
          <motion.div
            ref={searchResultsRef}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 40 }}
            className={cn(
              "absolute z-20 w-full bg-background/95 backdrop-blur-sm",
              "rounded-md shadow-xl border border-border overflow-hidden"
            )}
          >
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground">
                <motion.div 
                  animate={{ 
                    rotate: 360 
                  }} 
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1, 
                    ease: "linear" 
                  }}
                  className="inline-block mr-2"
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
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </motion.div>
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <ScrollArea className="max-h-[300px]">
                <ul className="py-2">
                  {searchResults.map((result, index) => (
                    <motion.li 
                      key={index} 
                      className="px-4 py-2 hover:bg-muted/50 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      onClick={() => {
                        // Keep the focus state briefly to ensure the click works
                        setIsFocused(true);
                        scrollToResult(result.id);
                      }}
                    >
                      <div
                        className="w-full text-left"
                      >
                        <div 
                          className="text-sm font-medium text-foreground"
                          dangerouslySetInnerHTML={{ __html: result.text }}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {result.context}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No results found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .search-highlight {
          animation: highlight-pulse 2s ease-in-out;
        }
        
        @keyframes highlight-pulse {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(147, 51, 234, 0.15); }
        }
      `}</style>
    </div>
  );
}