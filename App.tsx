
import React, { useState, useEffect } from 'react';
import { PlannerState, MonthlyData, FinancialEntry } from './types';
import { INITIAL_STATE, MONTH_NAMES, COLORS } from './constants';
import PlannerLayout from './components/PlannerLayout';
import EditableTable from './components/EditableTable';
import MonthlyCalendar from './components/MonthlyCalendar';
import { ChevronLeft, ChevronRight, Save, Download, Sparkles, BarChart3, Target, PiggyBank, ArrowLeft, FileDown, X, TrendingUp, WifiOff } from 'lucide-react';

type ExportType = 'FULL' | 'MONTH' | 'ANNUAL';

const App: React.FC = () => {
  const [state, setState] = useState<PlannerState>(INITIAL_STATE);
  const [currentView, setCurrentView] = useState<'COVER' | 'ANNUAL' | 'MONTHLY' | 'REFLECTION' | 'FINAL'>('COVER');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [printFilter, setPrintFilter] = useState<ExportType | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('elegance_planner_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migratedMonths = (parsed.months || []).map((m: any, idx: number) => ({
          ...m,
          dailyNotes: m.dailyNotes || {},
          savings: m.savings || 0,
          goldenTip: m.goldenTip || INITIAL_STATE.months[idx].goldenTip
        }));
        setState({ 
          ...parsed, 
          annual: { ...INITIAL_STATE.annual, ...parsed.annual },
          months: migratedMonths 
        });
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const saveToLocal = () => {
    try {
      localStorage.setItem('elegance_planner_data', JSON.stringify(state));
      const message = isOnline 
        ? 'Progresso guardado com sucesso!' 
        : 'Modo Offline: Progresso guardado localmente no seu dispositivo.';
      alert(message);
    } catch (error) {
      console.error('Erro ao guardar dados:', error);
      alert('Houve um erro ao guardar os seus dados localmente. Verifique o espaço disponível no navegador.');
    }
  };

  const updateMonthly = (updates: Partial<MonthlyData>) => {
    const newMonths = [...state.months];
    newMonths[selectedMonthIdx] = { ...newMonths[selectedMonthIdx], ...updates };
    setState({ ...state, months: newMonths });
  };

  const calculateMonthlyBalance = (idx: number) => {
    const m = state.months[idx];
    if (!m) return { income: 0, expenses: 0, totalOut: 0, balance: 0, savings: 0 };
    const income = m.income.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const fixed = m.fixedExpenses.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const variable = m.variableExpenses.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const savings = m.savings || 0;
    
    const expenses = fixed + variable;
    const totalOut = expenses + savings; // Including savings in total outflows as per request
    
    return {
      income,
      expenses,
      totalOut,
      balance: income - totalOut, // Balance now deducts savings
      savings
    };
  };

  const handleExport = (type: ExportType) => {
    setPrintFilter(type);
    setIsExportModalOpen(false);
    
    setTimeout(() => {
      window.print();
      setPrintFilter(null);
    }, 500);
  };

  const renderCover = () => (
    <PlannerLayout>
      <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4 relative">
        <div className="space-y-6 mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-title text-[#E8A2B8] leading-tight tracking-tight py-4">
            Planeador<br/>
            <span className="italic block mt-2">Financeiro</span>
          </h1>
          <p className="font-subtitle tracking-[0.4em] text-[#C9A24D] uppercase text-[10px] sm:text-xs font-bold border-t border-b border-[#F6C1D1]/30 py-2 inline-block">
            Organização • Metas • Consciência
          </p>
        </div>
        
        <div className="relative mb-16 flex justify-center items-center">
          <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 border-2 border-[#F6C1D1]/50 rounded-full flex items-center justify-center p-3 overflow-hidden bg-white shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1512418490979-92798ccc1380?auto=format&fit=crop&q=80&w=600" 
               className="rounded-full grayscale opacity-40 w-full h-full object-cover" 
               alt="Planner" 
             />
          </div>
          <div className="absolute flex items-center justify-center pointer-events-none w-full">
             <span className="z-10 font-title italic text-xl sm:text-2xl text-[#6E6E6E] bg-white px-8 py-3 border-2 border-[#C9A24D] shadow-xl transform -rotate-3 whitespace-nowrap ring-8 ring-white">
               2026 Edition
             </span>
          </div>
        </div>

        <div className="max-w-[320px] mb-8">
          <p className="text-[#6E6E6E] text-sm sm:text-base leading-relaxed italic border-t border-b border-[#FAF3F5] py-6 px-6 relative">
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 text-[#E8A2B8] font-title text-2xl">“</span>
            O teu guia para um controlo financeiro com estilo e abundância consciente.
          </p>
        </div>

        {/* Signature */}
        <div className="mb-12">
          <p className="font-title italic text-[#C9A24D] text-lg sm:text-xl opacity-80 select-none">
            Mente Criativa SB
          </p>
        </div>

        <button onClick={() => setCurrentView('ANNUAL')} className="px-14 py-4 bg-[#E8A2B8] text-white font-subtitle tracking-widest text-xs uppercase hover:bg-[#C9A24D] transition-all rounded-sm no-print shadow-lg">
          Abrir Planeador
        </button>
      </div>
    </PlannerLayout>
  );

  const renderAnnual = () => {
    const monthlyStats = state.months.map((_, i) => calculateMonthlyBalance(i));
    const totalYearlyIncome = monthlyStats.reduce((acc, s) => acc + s.income, 0);
    const totalYearlyOut = monthlyStats.reduce((acc, s) => acc + s.totalOut, 0);
    const totalYearlySavings = monthlyStats.reduce((acc, s) => acc + s.savings, 0);
    const goal = state.annual.plannedSavings || 0;
    const progressPercent = goal > 0 ? Math.min(100, Math.max(0, (totalYearlySavings / goal) * 100)) : 0;

    return (
      <PlannerLayout title="Balanço Anual" subtitle="Visão Global de 2026">
        <div className="space-y-8">
          <div>
            <h3 className="font-title text-xl text-[#6E6E6E] mb-4 border-b border-[#F6C1D1]">Principais Metas do Ano</h3>
            {state.annual.goals.map((goal, i) => (
              <input key={i} type="text" value={goal} onChange={(e) => {
                const newGoals = [...state.annual.goals];
                newGoals[i] = e.target.value;
                setState({ ...state, annual: { ...state.annual, goals: newGoals } });
              }} className="w-full bg-transparent border-b border-[#FAF3F5] py-2 focus:ring-0 text-sm mb-2" placeholder={`${i + 1}. __________________________________________________`} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-title text-xl text-[#6E6E6E] mb-4 border-b border-[#F6C1D1]">Rendimento Previsto</h3>
              <div className="flex items-center space-x-2">
                <span className="text-[#C9A24D]">€</span>
                <input type="number" value={state.annual.predictedIncome || ''} onChange={(e) => setState({ ...state, annual: { ...state.annual, predictedIncome: parseFloat(e.target.value) || 0 } })} className="w-full bg-transparent border-none focus:ring-0 text-2xl font-title text-[#6E6E6E]" placeholder="0.00" />
              </div>
            </div>
            <div>
              <h3 className="font-title text-xl text-[#6E6E6E] mb-4 border-b border-[#F6C1D1]">Poupança Anual Planeada</h3>
              <div className="flex items-center space-x-2">
                <span className="text-[#C9A24D]">€</span>
                <input type="number" value={state.annual.plannedSavings || ''} onChange={(e) => setState({ ...state, annual: { ...state.annual, plannedSavings: parseFloat(e.target.value) || 0 } })} className="w-full bg-transparent border-none focus:ring-0 text-2xl font-title text-[#6E6E6E]" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="bg-[#FAF3F5] p-8 rounded-sm border border-[#E8A2B8]/20 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp size={18} className="text-[#C9A24D]" />
                  <h3 className="font-subtitle text-[11px] uppercase tracking-[0.2em] text-[#6E6E6E] font-bold">Progresso da Poupança Anual</h3>
                </div>
                <p className="text-[10px] text-[#6E6E6E]/60 italic font-subtitle">Acompanhamento de metas de 2026</p>
              </div>
              <div className="text-right">
                <span className="block font-title text-3xl text-[#E8A2B8] leading-none">{progressPercent.toFixed(0)}%</span>
                <span className="text-[9px] font-subtitle uppercase tracking-widest text-[#C9A24D]">Concluído</span>
              </div>
            </div>
            
            <div className="relative h-6 w-full bg-white rounded-full p-1 border border-[#F6C1D1]/30 shadow-inner">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative group"
                style={{ 
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.oldRose})`
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                
                {/* Progress indicator tooltip-style */}
                {progressPercent > 5 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#E8A2B8] shadow-sm" />
                )}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="text-left">
                <span className="block text-[9px] font-subtitle uppercase tracking-widest text-[#6E6E6E]/50">Realizado</span>
                <span className="font-title text-lg text-[#6E6E6E]">€ {totalYearlySavings.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] font-subtitle uppercase tracking-widest text-[#6E6E6E]/50">Meta Planeada</span>
                <span className="font-title text-lg text-[#C9A24D]">€ {goal.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Background decoration */}
            <Sparkles className="absolute -bottom-4 -right-4 text-[#C9A24D]/5 rotate-12" size={80} />
          </div>

          <div className="mt-12">
            <h3 className="font-title text-xl text-[#6E6E6E] mb-4 border-b border-[#F6C1D1]">Resumo Mensal</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-subtitle uppercase tracking-wider">
                <thead>
                  <tr className="text-[#C9A24D] border-b border-[#FAF3F5]">
                    <th className="text-left py-3">Mês</th>
                    <th className="text-right py-3">Ganhos (€)</th>
                    <th className="text-right py-3">Saídas (€)</th>
                    <th className="text-right py-3">Saldo Final (€)</th>
                  </tr>
                </thead>
                <tbody className="text-[#6E6E6E]">
                  {MONTH_NAMES.map((name, idx) => (
                    <tr key={name} className="border-b border-[#FAF3F5]">
                      <td className="py-2.5 font-bold cursor-pointer hover:text-[#E8A2B8]" onClick={() => { setSelectedMonthIdx(idx); setCurrentView('MONTHLY'); }}>{name}</td>
                      <td className="text-right py-2.5">{monthlyStats[idx].income.toFixed(2)}</td>
                      <td className="text-right py-2.5" title="Despesas + Poupança">{monthlyStats[idx].totalOut.toFixed(2)}</td>
                      <td className={`text-right py-2.5 font-bold ${monthlyStats[idx].balance >= 0 ? 'text-[#6E6E6E]' : 'text-red-400'}`}>{monthlyStats[idx].balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PlannerLayout>
    );
  };

  const renderMonthly = (idx: number = selectedMonthIdx) => {
    const month = state.months[idx];
    const balance = calculateMonthlyBalance(idx);
    const allEntries = [...month.income, ...month.fixedExpenses, ...month.variableExpenses];
    const entryDays = allEntries.filter(e => e.date).map(e => parseInt(e.date!.split('-')[2])).filter((v, i, a) => a.indexOf(v) === i);

    return (
      <React.Fragment key={`plan-${idx}`}>
        <PlannerLayout title={month.month} subtitle={`Plano Mensal • ${month.year}`}>
          <div className="space-y-8">
            <div className="flex justify-between items-center no-print">
              <button onClick={() => setCurrentView('ANNUAL')} className="flex items-center space-x-2 text-[10px] font-subtitle uppercase tracking-widest text-[#C9A24D] hover:text-[#E8A2B8]">
                <ArrowLeft size={14} /> <span>Ver Balanço Anual</span>
              </button>
            </div>

            {/* Golden Tip Section */}
            <div className="bg-[#C9A24D]/5 p-6 rounded-sm border-2 border-dotted border-[#C9A24D]/30 relative overflow-hidden group">
              <Sparkles className="absolute -right-2 -top-2 text-[#C9A24D]/20 group-hover:scale-125 transition-transform" size={48} />
              <h4 className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-[#C9A24D] mb-2 flex items-center space-x-2">
                <Sparkles size={14} /> <span>Dica de Ouro</span>
              </h4>
              <textarea
                value={month.goldenTip}
                onChange={(e) => updateMonthly({ goldenTip: e.target.value })}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-title italic text-[#6E6E6E] resize-none leading-relaxed min-h-[60px]"
                placeholder="Uma dica valiosa para este mês..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EditableTable title="Entradas" entries={month.income} onUpdate={(income) => updateMonthly({ income })} />
              <div className="space-y-6">
                <div className="bg-[#FAF3F5] p-6 rounded-sm border border-[#E8A2B8]/10 text-center">
                  <span className="text-[10px] font-subtitle uppercase tracking-widest text-[#C9A24D]">Balanço (Líquido)</span>
                  <div className={`text-3xl font-title mt-2 ${balance.balance >= 0 ? 'text-[#6E6E6E]' : 'text-red-400'}`}>€ {balance.balance.toFixed(2)}</div>
                  <p className="text-[9px] mt-1 text-[#6E6E6E]/40 italic">(Já descontado o valor de poupança)</p>
                </div>
                <div className="bg-[#E8A2B8]/5 p-6 border border-[#E8A2B8]/20 text-center">
                  <PiggyBank size={18} className="text-[#E8A2B8] mx-auto mb-2" />
                  <span className="text-[10px] font-subtitle uppercase tracking-widest text-[#6E6E6E]">Poupado</span>
                  <input type="number" value={month.savings || ''} onChange={(e) => updateMonthly({ savings: parseFloat(e.target.value) || 0 })} className="w-full bg-transparent border-none text-center focus:ring-0 text-2xl font-title text-[#6E6E6E]" placeholder="0.00" />
                </div>
              </div>
            </div>

            <EditableTable title="Despesas Fixas" entries={month.fixedExpenses} onUpdate={(fixedExpenses) => updateMonthly({ fixedExpenses })} />
            <EditableTable title="Variáveis & Extras" entries={month.variableExpenses} onUpdate={(variableExpenses) => updateMonthly({ variableExpenses })} />
            <MonthlyCalendar monthName={month.month} year={month.year} notes={month.dailyNotes} onUpdateNotes={(dailyNotes) => updateMonthly({ dailyNotes })} entryDays={entryDays} />
          </div>
        </PlannerLayout>
      </React.Fragment>
    );
  };

  const renderReflection = (idx: number = selectedMonthIdx) => {
    const month = state.months[idx];
    return (
      <React.Fragment key={`ref-${idx}`}>
        <PlannerLayout title="Reflexão" subtitle={`Final de ${month.month}`}>
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-8">
              {[
                { label: 'Onde o dinheiro foi melhor gasto?', field: 'bestSpent' },
                { label: 'O que posso melhorar no próximo mês?', field: 'improvement' },
                { label: 'Quanto consegui poupar efetivamente?', field: 'savedAmount' },
                { label: 'Uma decisão positiva que tomei:', field: 'positiveDecision' },
                { label: 'Prioridade para o próximo mês:', field: 'nextMonthPriority' },
              ].map((q) => (
                <div key={q.field}>
                  <h3 className="font-title text-lg text-[#6E6E6E] mb-2">{q.label}</h3>
                  <textarea value={(month.reflection as any)[q.field]} onChange={(e) => updateMonthly({ reflection: { ...month.reflection, [q.field]: e.target.value } })} className="w-full bg-transparent border-b border-[#FAF3F5] min-h-[80px] focus:ring-0 text-sm italic py-2 resize-none" placeholder="Escreve aqui..." />
                </div>
              ))}
            </div>
          </div>
        </PlannerLayout>
      </React.Fragment>
    );
  };

  const renderPrintView = () => {
    if (!printFilter) return null;
    
    if (printFilter === 'FULL') {
      return (
        <div className="fixed inset-0 z-[100] bg-white overflow-auto">
          {renderCover()}
          {renderAnnual()}
          {state.months.map((_, i) => (
            <React.Fragment key={i}>
              {renderMonthly(i)}
              {renderReflection(i)}
            </React.Fragment>
          ))}
        </div>
      );
    }
    
    if (printFilter === 'MONTH') {
      return (
        <div className="fixed inset-0 z-[100] bg-white overflow-auto">
          {renderMonthly(selectedMonthIdx)}
          {renderReflection(selectedMonthIdx)}
        </div>
      );
    }

    if (printFilter === 'ANNUAL') {
      return (
        <div className="fixed inset-0 z-[100] bg-white overflow-auto">
          {renderCover()}
          {renderAnnual()}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="pb-24">
      {renderPrintView()}
      
      <div className={printFilter ? 'hidden' : ''}>
        {/* Offline Status Indicator */}
        {!isOnline && (
          <div className="fixed top-0 left-0 w-full bg-[#C9A24D] text-white py-1 px-4 text-[10px] font-subtitle uppercase tracking-widest text-center z-[100] flex items-center justify-center space-x-2 no-print">
            <WifiOff size={12} />
            <span>Estás em modo offline. O progresso será guardado localmente no navegador.</span>
          </div>
        )}

        {currentView === 'COVER' && renderCover()}
        {currentView === 'ANNUAL' && renderAnnual()}
        {currentView === 'MONTHLY' && renderMonthly()}
        {currentView === 'REFLECTION' && renderReflection()}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-[#F6C1D1] p-4 flex justify-center items-center space-x-6 no-print z-50 shadow-lg">
        <div className="flex items-center space-x-2 mr-8">
          <button onClick={() => setCurrentView('COVER')} className={`px-3 py-1 text-[10px] font-subtitle uppercase tracking-widest ${currentView === 'COVER' ? 'text-[#E8A2B8] font-bold underline' : 'text-[#6E6E6E]'}`}>Capa</button>
          <button onClick={() => setCurrentView('ANNUAL')} className={`px-3 py-1 text-[10px] font-subtitle uppercase tracking-widest ${currentView === 'ANNUAL' ? 'text-[#E8A2B8] font-bold underline' : 'text-[#6E6E6E]'}`}>Anual</button>
          <button onClick={() => setCurrentView('MONTHLY')} className={`px-3 py-1 text-[10px] font-subtitle uppercase tracking-widest ${currentView === 'MONTHLY' || currentView === 'REFLECTION' ? 'text-[#E8A2B8] font-bold underline' : 'text-[#6E6E6E]'}`}>Mensal</button>
        </div>

        {(currentView === 'MONTHLY' || currentView === 'REFLECTION') && (
          <div className="flex items-center space-x-4 bg-[#FAF3F5] px-4 py-2 rounded-full border border-[#E8A2B8]/20 shadow-sm">
            <button onClick={() => setSelectedMonthIdx(prev => Math.max(0, prev - 1))} disabled={selectedMonthIdx === 0} className="text-[#E8A2B8] disabled:opacity-30"><ChevronLeft size={20} /></button>
            <span className="font-subtitle text-[10px] uppercase tracking-widest w-24 text-center text-[#6E6E6E] font-semibold">{MONTH_NAMES[selectedMonthIdx]}</span>
            <button onClick={() => setSelectedMonthIdx(prev => Math.min(11, prev + 1))} disabled={selectedMonthIdx === 11} className="text-[#E8A2B8] disabled:opacity-30"><ChevronRight size={20} /></button>
          </div>
        )}

        <div className="flex items-center space-x-2 ml-8">
          <button onClick={saveToLocal} className="p-2 text-[#6E6E6E] hover:text-[#E8A2B8]" title="Guardar"><Save size={22} /></button>
          <button onClick={() => setIsExportModalOpen(true)} className="p-2 text-[#E8A2B8] hover:text-[#C9A24D]" title="Exportar"><Download size={22} /></button>
          
          {currentView === 'MONTHLY' && (
            <button onClick={() => setCurrentView('REFLECTION')} className="ml-4 px-4 py-1.5 bg-[#C9A24D]/20 text-[#C9A24D] text-[10px] font-subtitle uppercase tracking-widest rounded-sm hover:bg-[#C9A24D] hover:text-white">Reflexão</button>
          )}
          {currentView === 'REFLECTION' && (
            <button onClick={() => setCurrentView('MONTHLY')} className="ml-4 px-4 py-1.5 bg-[#E8A2B8]/20 text-[#E8A2B8] text-[10px] font-subtitle uppercase tracking-widest rounded-sm hover:bg-[#E8A2B8] hover:text-white">Plano</button>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm no-print">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-[#E8A2B8]/30">
            <div className="bg-[#FAF3F5] p-6 flex justify-between items-center border-b border-[#E8A2B8]/20">
              <h3 className="font-title text-2xl text-[#6E6E6E]">Exportar Planeador</h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-[#6E6E6E] hover:text-red-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-sm text-[#6E6E6E] italic mb-6">O que gostaria de baixar para PDF?</p>
              
              <button onClick={() => handleExport('FULL')} className="w-full flex items-center justify-between p-4 bg-[#E8A2B8]/5 hover:bg-[#E8A2B8]/10 border border-[#E8A2B8]/20 rounded-sm transition-all group">
                <div className="text-left">
                  <span className="block font-subtitle text-xs uppercase tracking-widest text-[#E8A2B8] font-bold">PDF Completo</span>
                  <span className="text-[10px] text-[#6E6E6E]">Capa, Anual, 12 Meses e Reflexões</span>
                </div>
                <FileDown className="text-[#E8A2B8] group-hover:scale-110 transition-transform" />
              </button>

              <button onClick={() => handleExport('MONTH')} className="w-full flex items-center justify-between p-4 bg-[#C9A24D]/5 hover:bg-[#C9A24D]/10 border border-[#C9A24D]/20 rounded-sm transition-all group">
                <div className="text-left">
                  <span className="block font-subtitle text-xs uppercase tracking-widest text-[#C9A24D] font-bold">Mês de {MONTH_NAMES[selectedMonthIdx]}</span>
                  <span className="text-[10px] text-[#6E6E6E]">Plano mensal e Reflexão deste mês</span>
                </div>
                <FileDown className="text-[#C9A24D] group-hover:scale-110 transition-transform" />
              </button>

              <button onClick={() => handleExport('ANNUAL')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-sm transition-all group">
                <div className="text-left">
                  <span className="block font-subtitle text-xs uppercase tracking-widest text-[#6E6E6E] font-bold">Balanço Anual</span>
                  <span className="text-[10px] text-[#6E6E6E]">Capa e estratégia para 2026</span>
                </div>
                <FileDown className="text-[#6E6E6E] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
