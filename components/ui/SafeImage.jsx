"use client";
import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export const SafeImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  // If no source is provided, or if the image failed to load (like a webpage URL)
  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-400 ${className}`}>
         <div className="flex flex-col items-center gap-1">
           <ImageIcon size={16} />
           <span className="text-[7px] uppercase tracking-widest font-bold">No Image</span>
         </div>
      </div>
    );
  }

  // If it's a valid image, render it. If it fails, trigger the error state
  return (
    <img 
      src={src} 
      alt={alt || "image"} 
      className={`object-cover ${className}`} 
      onError={() => setError(true)} 
    />
  );
};