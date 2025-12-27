
import React from 'react';

export const COLORS = {
  blush: '#F6C1D1',
  oldRose: '#E8A2B8',
  nude: '#FAF3F5',
  softGray: '#6E6E6E',
  gold: '#C9A24D'
};

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const GOLDEN_TIPS = [
  'Reserve os primeiros 10% do seu ganho para o seu "Eu do Futuro" antes de pagar qualquer conta.',
  'Evite compras por impulso no Carnaval. Se não estava no plano, espere 48h antes de comprar.',
  'Revise todas as suas subscrições mensais. Cancele o que não usou nos últimos 30 dias.',
  'É tempo de declarações. Organize faturas de saúde e educação para maximizar o seu reembolso.',
  'Planeie os presentes de datas festivas com antecedência para evitar preços de última hora.',
  'Estamos no meio do ano! Reavalie as suas metas anuais e ajuste a rota se necessário.',
  'Férias com consciência: defina um teto de gastos diários para aproveitar sem culpa.',
  'Invista no seu conhecimento. Compre um livro ou curso que ajude a aumentar a sua renda.',
  'Mês de "destralhar": venda o que não usa e direcione o valor extra para a sua reserva.',
  'Prepare-se para a Black Friday: faça uma lista real do que precisa e poupe para pagar a pronto.',
  'O 13º salário não é bónus extra, é oportunidade estratégica para quitar dívidas ou investir.',
  'Celebre as conquistas e desenhe o mapa da sua abundância para o próximo ciclo.'
];

export const INITIAL_STATE = {
  annual: {
    goals: ['', '', ''],
    predictedIncome: 0,
    annualFixedExpenses: [],
    debts: [],
    plannedSavings: 0,
    savingsTips: ''
  },
  months: MONTH_NAMES.map((m, idx) => ({
    month: m,
    year: 2026,
    mainGoal: '',
    goldenTip: GOLDEN_TIPS[idx],
    income: [],
    fixedExpenses: [],
    variableExpenses: [],
    savings: 0,
    dailyNotes: {},
    reflection: {
      bestSpent: '',
      improvement: '',
      savedAmount: '',
      positiveDecision: '',
      nextMonthPriority: ''
    }
  }))
};
