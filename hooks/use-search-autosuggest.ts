import { useState, useEffect, useRef } from "react";
import { productService, BackendProduct } from "@/lib/api/product.service";

export interface SuggestionItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  author?: string;
}

export function useSearchAutosuggest() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestion dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update query and set loading/open states in the event handler thread to prevent react-hooks/set-state-in-effect warning
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length >= 2) {
      setIsLoading(true);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Debounce API calls for search suggestions
  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await productService.getProducts({
          page: 1,
          limit: 5,
          search: query.trim(),
        });
        
        // Map products to suggestion items
        const mapped: SuggestionItem[] = response.products.map((p: BackendProduct) => {
          const slug = p.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
            
          const image = p.images?.[0] || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80";
          const author = p.attributes?.author || p.attributes?.Author;
          
          return {
            id: p.id,
            slug,
            name: p.title,
            price: p.price || 0,
            image,
            author,
          };
        });

        setSuggestions(mapped);
      } catch (error) {
        console.error("Autosuggest search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const clearQuery = () => {
    setQuery("");
    setSuggestions([]);
    setIsLoading(false);
    setIsOpen(false);
  };

  return {
    query,
    setQuery: handleQueryChange,
    suggestions,
    isLoading,
    isOpen,
    setIsOpen,
    containerRef,
    clearQuery,
  };
}
