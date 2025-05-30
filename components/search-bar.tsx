"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const resultItemsRef = useRef<(HTMLLIElement | null)[]>([]);

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
    // Reset selected index when results change
    setSelectedIndex(-1);
    // Initialize refs array to match result count
    resultItemsRef.current = results.map(() => null);
  }, [searchQuery, content]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
      
      // Ensure selected item is visible in scroll area
      if (selectedIndex + 1 < searchResults.length && resultItemsRef.current[selectedIndex + 1]) {
        resultItemsRef.current[selectedIndex + 1]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : prev
      );
      
      // Ensure selected item is visible in scroll area
      if (selectedIndex > 0 && resultItemsRef.current[selectedIndex - 1]) {
        resultItemsRef.current[selectedIndex - 1]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      scrollToResult(searchResults[selectedIndex].id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchQuery('');
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Aggressive direct scrolling approach
  const scrollToResult = (id: string) => {
    console.log("CLICK DETECTED - Trying to navigate to:", id);
    
    try {
      // Directly find the element
      const element = document.getElementById(id);
      console.log("Element found by ID?", element ? "YES" : "NO");
      
      if (element) {
        // Get its absolute position on the page
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const absoluteTop = rect.top + scrollTop;
        
        console.log("SCROLLING to position:", absoluteTop - 120);
        
        // Force scroll directly to the element's position minus header offset
        window.scrollTo(0, absoluteTop - 120);
        
        // Force a second scroll after a small delay to ensure it works
        setTimeout(() => {
          window.scrollTo(0, absoluteTop - 120);
          
          // Add very obvious highlight
          element.style.backgroundColor = "rgba(255, 0, 255, 0.3)";
          element.style.outline = "2px solid purple";
          element.style.padding = "10px";
          
          setTimeout(() => {
            element.style.backgroundColor = "";
            element.style.outline = "";
            element.style.padding = "";
          }, 3000);
        }, 100);
        
        // Close search
        setSearchQuery('');
        setIsFocused(false);
        
        return true;
      }
      
      // Special handling for content matches
      if (id.startsWith('content-match-')) {
        console.log("Content match, using alternative approach");
        
        // Find the related item in search results
        const resultItem = searchResults.find(r => r.id === id);
        if (!resultItem) return false;
        
        // If it has a nearest heading, use that
        if (resultItem.context.startsWith('Near "')) {
          const headingText = resultItem.context.substring(6, resultItem.context.length - 1);
          console.log("Looking for heading:", headingText);
          
          // Look through all headings
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          for (const heading of headings) {
            if (heading.textContent && heading.textContent.includes(headingText)) {
              console.log("Found heading:", heading);
              
              // Get its position
              const rect = heading.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const absoluteTop = rect.top + scrollTop;
              
              // Force scroll with offset
              window.scrollTo(0, absoluteTop - 120);
              
              // Highlight it clearly
              (heading as HTMLElement).style.backgroundColor = "rgba(255, 0, 255, 0.3)";
              (heading as HTMLElement).style.outline = "2px solid purple";
              
              setTimeout(() => {
                (heading as HTMLElement).style.backgroundColor = "";
                (heading as HTMLElement).style.outline = "";
              }, 3000);
              
              // Close search
              setSearchQuery('');
              setIsFocused(false);
              
              return true;
            }
          }
        }
        
        // If we got here, we couldn't find a heading - look for the content itself
        const searchText = resultItem.text.replace(/<\/?mark>/g, '').replace(/^\.\.\./, '').replace(/\.\.\.$/, '');
        const paragraphs = document.querySelectorAll('p');
        
        for (const p of paragraphs) {
          if (p.textContent && p.textContent.includes(searchText)) {
            // Found matching paragraph
            const rect = p.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const absoluteTop = rect.top + scrollTop;
            
            // Force scroll
            window.scrollTo(0, absoluteTop - 120);
            
            // Highlight
            (p as HTMLElement).style.backgroundColor = "rgba(255, 0, 255, 0.3)";
            (p as HTMLElement).style.outline = "2px solid purple";
            
            setTimeout(() => {
              (p as HTMLElement).style.backgroundColor = "";
              (p as HTMLElement).style.outline = "";
            }, 3000);
            
            // Close search
            setSearchQuery('');
            setIsFocused(false);
            
            return true;
          }
        }
      }
      
      // Ultra fallback - just scroll a significant amount down the page
      console.log("FALLBACK - Just scrolling down the page");
      window.scrollTo(0, 500); // Scroll down 500px
      
      // Close search
      setSearchQuery('');
      setIsFocused(false);
      
      return false;
    } catch (error) {
      console.error("Error during scroll:", error);
      return false;
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
            onKeyDown={handleKeyDown}
            className="w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
        </motion.div>
      </motion.div>
      
      <AnimatePresence>
        {searchQuery.length >= 2 && isFocused && (
          <motion.div
            ref={searchResultsRef}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', maxHeight: '300px' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 40 }}
            className={cn(
              "absolute z-20 w-full bg-background/95 backdrop-blur-sm",
              "rounded-md shadow-xl border border-border"
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
              <ScrollArea className="max-h-[300px] h-fit">
                <ul className="py-2">
                  {searchResults.map((result, index) => (
                    <motion.li 
                      key={index}
                      ref={el => resultItemsRef.current[index] = el} 
                      className={cn(
                        "px-4 py-2 hover:bg-muted/50 cursor-pointer transition-colors",
                        selectedIndex === index && "bg-muted/70"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      onClick={(e) => {
                        // Prevent any default behavior
                        e.preventDefault();
                        if (e.stopPropagation) e.stopPropagation();
                        
                        console.log("SEARCH ITEM CLICKED:", result.id, result.text);
                        
                        // Show visual click feedback
                        const el = resultItemsRef.current[index];
                        if (el) {
                          (el as HTMLElement).style.backgroundColor = "purple";
                          (el as HTMLElement).style.color = "white";
                        }
                        
                        // Delay the scrolling slightly to ensure click is processed
                        setTimeout(() => {
                          // Execute the scroll
                          scrollToResult(result.id);
                          
                          // Reset visual feedback
                          if (el) {
                            (el as HTMLElement).style.backgroundColor = "";
                            (el as HTMLElement).style.color = "";
                          }
                        }, 100);
                        
                        return false;
                      }}
                      // For accessibility
                      tabIndex={0}
                      role="option"
                      aria-selected={selectedIndex === index}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="w-full text-left">
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
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.5);
          background-color: rgba(147, 51, 234, 0.1) !important;
          border-radius: 2px;
        }
        
        @keyframes highlight-pulse {
          0%, 100% { background-color: rgba(147, 51, 234, 0.1); }
          50% { background-color: rgba(147, 51, 234, 0.3); }
        }
        
        mark {
          background-color: rgba(147, 51, 234, 0.2);
          color: inherit;
          font-weight: 600;
          padding: 0 2px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}