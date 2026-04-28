    "use client";

import { Loader2 } from "lucide-react";

export function Spinner({ className, size = 16, ...props }) {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin ${className || ""}`} 
      {...props} 
    />
  );
}