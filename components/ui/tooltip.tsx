import { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="relative group">
      {/* Tooltip trigger */}
      {children}

      {/* Tooltip content */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
        <div className="bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {content}
        </div>
        <div className="w-3 h-3 bg-gray-700 absolute top-full left-1/2 transform -translate-x-1/2 rotate-45"></div>
      </div>
    </div>
  );
};
