import { useReducer, useCallback } from 'react';
import type { FilterState, FilterAction } from '../types';

const initialFilters: FilterState = {
  year: null,
  paperType: null,
  knowledgePointId: null,
  difficulty: null,
  questionType: null,
  searchQuery: '',
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_YEAR':
      return { ...state, year: action.payload };
    case 'SET_PAPER_TYPE':
      return { ...state, paperType: action.payload };
    case 'SET_KNOWLEDGE_POINT':
      return { ...state, knowledgePointId: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'SET_QUESTION_TYPE':
      return { ...state, questionType: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'RESET':
      return initialFilters;
    default:
      return state;
  }
}

export function useFilters() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const setYear = useCallback((year: number | null) => dispatch({ type: 'SET_YEAR', payload: year }), []);
  const setPaperType = useCallback((pt: FilterState['paperType']) => dispatch({ type: 'SET_PAPER_TYPE', payload: pt }), []);
  const setKnowledgePoint = useCallback((kp: string | null) => dispatch({ type: 'SET_KNOWLEDGE_POINT', payload: kp }), []);
  const setDifficulty = useCallback((d: FilterState['difficulty']) => dispatch({ type: 'SET_DIFFICULTY', payload: d }), []);
  const setQuestionType = useCallback((qt: FilterState['questionType']) => dispatch({ type: 'SET_QUESTION_TYPE', payload: qt }), []);
  const setSearch = useCallback((q: string) => dispatch({ type: 'SET_SEARCH', payload: q }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    filters,
    setYear,
    setPaperType,
    setKnowledgePoint,
    setDifficulty,
    setQuestionType,
    setSearch,
    reset,
  };
}
