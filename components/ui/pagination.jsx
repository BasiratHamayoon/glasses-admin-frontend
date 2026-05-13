"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";

/* -------------------------------------------------------------------------- */
/*                               Sub-Components                               */
/* -------------------------------------------------------------------------- */

const PaginationRoot = React.forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="pagination"
    className={`mx-auto flex w-full justify-center ${className}`}
    {...props}
  />
));
PaginationRoot.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={`flex flex-row items-center ${className}`}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={className} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({
  className,
  isActive,
  children,
  onClick,
  disabled,
  ...props
}) => {
  const { theme, colors } = useTheme();
  const isDark = theme === "dark";
  const goldenColor = colors.golden.DEFAULT;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center w-8 h-8 md:w-10 md:h-10
        text-xs md:text-sm font-bold rounded-lg
        transition-all duration-300 relative
        ${isActive 
          ? "text-black shadow-lg" 
          : `hover:bg-opacity-10 ${isDark ? 'text-white' : 'text-black'}`
        }
        ${disabled && "opacity-30 cursor-not-allowed"}
        ${className}
      `}
      style={{
        backgroundColor: isActive ? goldenColor : 'transparent',
        boxShadow: isActive ? `0 4px 12px ${goldenColor}40` : 'none'
      }}
      {...props}
    >
      {children}
      
      {/* Glow effect for active page */}
      {isActive && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="absolute inset-0 rounded-lg"
          style={{
            backgroundColor: goldenColor,
            filter: "blur(8px)",
            zIndex: -1
          }}
        />
      )}
    </motion.button>
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  onClick,
  disabled,
  ...props
}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <PaginationLink
      onClick={onClick}
      disabled={disabled}
      className={`gap-1 px-3 w-auto ${className}`} // Removed fixed width, added padding
      {...props}
    >
      {isArabic ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      <span className="hidden sm:inline">{isArabic ? 'السابق' : 'Previous'}</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  onClick,
  disabled,
  ...props
}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <PaginationLink
      onClick={onClick}
      disabled={disabled}
      className={`gap-1 px-3 w-auto ${className}`} // Removed fixed width, added padding
      {...props}
    >
      <span className="hidden sm:inline">{isArabic ? 'التالي' : 'Next'}</span>
      {isArabic ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <span
      className={`
        flex items-center justify-center w-8 h-8 md:w-10 md:h-10
        ${isDark ? 'text-neutral-500' : 'text-neutral-400'}
        ${className}
      `}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis";

/* -------------------------------------------------------------------------- */
/*                        Main Pagination Component                           */
/* -------------------------------------------------------------------------- */

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  siblingCount = 1,
  className = "" 
}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  // Generate page numbers to display
  const generatePagination = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
      return [...leftRange, 'ellipsis', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
      );
      return [1, 'ellipsis', ...rightRange];
    }

    if (showLeftEllipsis && showRightEllipsis) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
    }
  };

  const paginationRange = generatePagination();

  // If there's only 1 page (or 0), we often don't want to show pagination at all
  if (totalPages <= 1) return null;

  return (
    <PaginationRoot className={className}>
      <PaginationContent className="w-full flex justify-center items-center">
        
        {/* Previous Button - Added Margin Right/Left for Gap */}
        <PaginationItem className="mx-2 sm:mx-6">
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {/* Page Numbers Container */}
        <div className="flex items-center gap-1">
          <AnimatePresence mode="wait">
            {/* 
                We wrap the numbers in a motion.div to animate the slide effect,
                but keep the gap tight (gap-1) between numbers.
            */}
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isArabic ? -10 : 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1"
            >
              {paginationRange?.map((page, index) => {
                if (page === 'ellipsis') {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Button - Added Margin Left/Right for Gap */}
        <PaginationItem className="mx-2 sm:mx-6">
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      
      </PaginationContent>
    </PaginationRoot>
  );
};

export {
  Pagination,
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
};