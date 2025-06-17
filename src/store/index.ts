// src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import itemsReducer from './slices/itemSlice';
import profileReducer from './slices/profileSlice';
import productReducer from './slices/productSlice';
import reviewReducer from './slices/reviewSlice';
import { reviewApi } from '../services/reviewService';
import  adminReducer from './slices/adminSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  items: itemsReducer,
  profile: profileReducer,
  products: productReducer,
  adminProducts: adminReducer,
  review: reviewReducer,
    
    // Add the RTK Query API
  [reviewApi.reducerPath]: reviewApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE','review/toggleLikeReview', 'review/initializeUserPreferences'],
        // Ignore these field paths in the state
        ignoredPaths: ['review.likedReviews', 'review.dislikedReviews'],
      },
    }).concat(reviewApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;