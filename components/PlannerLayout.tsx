
import React from 'react';
import { COLORS } from '../constants';

interface PlannerLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const PlannerLayout: React.FC<PlannerLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FAF3F5] py-10 px-4 sm:px-0">
      <div className="w-full max-w-[600px] bg-white shadow-2xl rounded-sm min-h-[848px] p-6 sm:p-10 flex flex-col border border-[#E8A2B8]/20 print-page relative">
        {/* Aesthetic Borders */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#F6C1D1]"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[#C9A24D]/30"></div>
        
        {title && (
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-title text-[#E8A2B8] mb-2">{title}</h1>
            {subtitle && <p className="text-sm font-subtitle uppercase tracking-widest text-[#C9A24D]">{subtitle}</p>}
            <div className="w-20 h-[1px] bg-[#C9A24D] mx-auto mt-4"></div>
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>

        {/* Footer Page Marking (Visual only) */}
        <div className="mt-8 pt-4 border-t border-[#E8A2B8]/10 text-center text-[10px] text-[#6E6E6E]/50 font-subtitle tracking-widest no-print">
          PLANEADOR FINANCEIRO • ORGANIZAÇÃO • METAS
        </div>
      </div>
    </div>
  );
};

export default PlannerLayout;
