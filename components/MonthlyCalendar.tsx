
import React from 'react';
import { MONTH_NAMES } from '../constants';

interface MonthlyCalendarProps {
  monthName: string;
  year: number;
  notes: { [day: number]: string };
  onUpdateNotes: (notes: { [day: number]: string }) => void;
  entryDays?: number[]; // Days that have financial entries (income/expenses)
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ 
  monthName, 
  year, 
  notes, 
  onUpdateNotes,
  entryDays = []
}) => {
  const monthIdx = MONTH_NAMES.indexOf(monthName);
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, monthIdx, 1).getDay(); // 0 (Sun) to 6 (Sat)

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleNoteChange = (day: number, text: string) => {
    onUpdateNotes({ ...notes, [day]: text });
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4 border-b border-[#F6C1D1] pb-1">
        <h3 className="font-title text-xl text-[#6E6E6E]">Calendário de Gastos</h3>
        <span className="text-[10px] font-subtitle uppercase tracking-widest text-[#C9A24D]">{monthName} {year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 border border-[#F6C1D1]/20 p-1 bg-white">
        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
          <div key={d} className="text-center text-[9px] font-subtitle font-bold text-[#E8A2B8] py-1 border-b border-[#F6C1D1]/10">
            {d}
          </div>
        ))}
        {blanks.map(b => (
          <div key={`blank-${b}`} className="min-h-[60px] bg-[#FAF3F5]/30"></div>
        ))}
        {days.map(day => {
          const hasNote = !!notes[day]?.trim();
          const hasEntry = entryDays.includes(day);

          return (
            <div 
              key={day} 
              className={`min-h-[60px] border border-[#FAF3F5] flex flex-col p-1 group transition-colors duration-300 ${hasNote || hasEntry ? 'bg-[#F6C1D1]/5' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-subtitle text-[#C9A24D] font-bold">{day}</span>
                <div className="flex space-x-0.5">
                  {hasEntry && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24D]" title="Lançamento financeiro" />
                  )}
                  {hasNote && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8A2B8]" title="Nota diária" />
                  )}
                </div>
              </div>
              <textarea
                value={notes[day] || ''}
                onChange={(e) => handleNoteChange(day, e.target.value)}
                className="flex-1 w-full bg-transparent border-none focus:ring-0 text-[9px] leading-tight resize-none p-0 text-[#6E6E6E] placeholder:text-[#6E6E6E]/10"
                placeholder="..."
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-end space-x-4 text-[9px] font-subtitle uppercase tracking-widest text-[#6E6E6E]/60 no-print">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-[#C9A24D]" />
          <span>Lançamento</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-[#E8A2B8]" />
          <span>Nota</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;
