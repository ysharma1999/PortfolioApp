import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { horoscopeService } from '../../services/horoscopeService';
import { JournalState, ZodiacSign } from '../../types';
import { generateId } from '../../utils/dateUtils';



export const fetchHoroscope = createAsyncThunk(
  'journal/fetchHoroscope',
  async (zodiacSign: ZodiacSign) => {
    const response = await horoscopeService.getHoroscope(zodiacSign);
    return response;
  }
);

const initialState: JournalState = {
  selectedZodiac: 'aries',
  currentHoroscope: '',
  journalEntries: {},
  loading: false,
  error: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    setZodiacSign: (state, action: PayloadAction<ZodiacSign>) => {
      state.selectedZodiac = action.payload;
    },
    saveJournalEntry: (state, action: PayloadAction<{ date: string; content: string }>) => {
      const { date, content } = action.payload;
      const existingEntry = state.journalEntries[date];
      const now = new Date().toISOString();

      if (existingEntry) {
        state.journalEntries[date] = {
          ...existingEntry,
          content,
          updatedAt: now,
        };
      } else {

        state.journalEntries[date] = {
          id: generateId(),
          date,
          content,
          createdAt: now,
          updatedAt: now,
        };
      }
    },
    deleteJournalEntry: (state, action: PayloadAction<string>) => {
      delete state.journalEntries[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoroscope.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHoroscope.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHoroscope = action.payload.horoscope;
        state.error = null;
      })
      .addCase(fetchHoroscope.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch horoscope';
      });
  },
});

export const { 
  setZodiacSign, 
  saveJournalEntry, 
  deleteJournalEntry, 
  clearError 
} = journalSlice.actions;

export default journalSlice.reducer;
