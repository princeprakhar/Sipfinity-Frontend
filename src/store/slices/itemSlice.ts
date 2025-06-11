// store/slices/itemSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Item } from '../../types';

interface ItemsState {
  items: Item[];
  filteredItems: Item[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  filteredItems: [],
  selectedCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredItems = filterItems(state.items, action.payload, state.selectedCategory);
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.filteredItems = filterItems(state.items, state.searchQuery, action.payload);
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.filteredItems = state.items;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Helper function to filter items
const filterItems = (items: Item[], searchQuery: string, selectedCategory: string | null): Item[] => {
  return items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
};

export const {
  setItems,
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
  setLoading,
  setError,
} = itemSlice.actions;

export default itemSlice.reducer;