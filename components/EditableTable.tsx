
import React from 'react';
import { FinancialEntry } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface EditableTableProps {
  title: string;
  entries: FinancialEntry[];
  onUpdate: (entries: FinancialEntry[]) => void;
  showDate?: boolean;
  placeholderRows?: number;
}

const EditableTable: React.FC<EditableTableProps> = ({ 
  title, 
  entries, 
  onUpdate, 
  showDate = true,
  placeholderRows = 3 
}) => {
  const addRow = () => {
    const newEntry: FinancialEntry = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      value: 0,
      date: showDate ? new Date().toISOString().split('T')[0] : undefined
    };
    onUpdate([...entries, newEntry]);
  };

  const removeRow = (id: string) => {
    onUpdate(entries.filter(e => e.id !== id));
  };

  const handleChange = (id: string, field: keyof FinancialEntry, value: string | number) => {
    onUpdate(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const total = entries.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

  // Calculate how many extra empty rows to show for print/visual space
  const displayEntries = [...entries];
  const emptyNeeded = Math.max(0, placeholderRows - entries.length);
  const emptyRows = Array.from({ length: emptyNeeded }).map((_, i) => ({
    id: `placeholder-${i}`,
    description: '',
    value: undefined,
    date: undefined
  }));

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3 border-b border-[#F6C1D1] pb-1">
        <h3 className="font-title text-xl text-[#6E6E6E]">{title}</h3>
        <button 
          onClick={addRow}
          className="text-[#E8A2B8] hover:text-[#C9A24D] transition-colors no-print"
          title="Adicionar Linha"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#C9A24D] font-subtitle uppercase text-[10px] tracking-widest">
              <th className="text-left py-2">Descrição</th>
              <th className="text-right py-2">Valor</th>
              {showDate && <th className="text-right py-2">Data</th>}
              <th className="w-8 no-print"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-[#FAF3F5]">
                <td className="py-2">
                  <input
                    type="text"
                    value={entry.description}
                    onChange={(e) => handleChange(entry.id, 'description', e.target.value)}
                    placeholder="____________________"
                    className="w-full bg-transparent border-none focus:ring-0 placeholder:text-[#6E6E6E]/20"
                  />
                </td>
                <td className="py-2 text-right">
                  <input
                    type="number"
                    value={entry.value || ''}
                    onChange={(e) => handleChange(entry.id, 'value', parseFloat(e.target.value) || 0)}
                    className="w-24 bg-transparent border-none text-right focus:ring-0"
                    placeholder="0.00"
                  />
                </td>
                {showDate && (
                  <td className="py-2 text-right">
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handleChange(entry.id, 'date', e.target.value)}
                      className="bg-transparent border-none text-right focus:ring-0 text-[10px]"
                    />
                  </td>
                )}
                <td className="py-2 text-right no-print">
                  <button onClick={() => removeRow(entry.id)} className="text-red-200 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {/* Placeholder rows for printing/handwriting */}
            {emptyRows.map((row) => (
               <tr key={row.id} className="border-b border-[#FAF3F5] opacity-50">
                  <td className="py-2">
                    <div className="w-full h-6 border-b border-dotted border-[#F6C1D1]/30"></div>
                  </td>
                  <td className="py-2 text-right">
                    <div className="w-24 h-6 border-b border-dotted border-[#F6C1D1]/30 inline-block"></div>
                  </td>
                  {showDate && (
                    <td className="py-2 text-right">
                      <div className="w-20 h-6 border-b border-dotted border-[#F6C1D1]/30 inline-block"></div>
                    </td>
                  )}
                  <td className="py-2 no-print"></td>
               </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-[#6E6E6E]">
              <td className="py-4">TOTAL</td>
              <td className="py-4 text-right">€ {total.toFixed(2)}</td>
              {showDate && <td></td>}
              <td className="no-print"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default EditableTable;
