import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  persistReducer, 
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import rideReducer from './reducers/Ride';
import userReducer from './reducers/User';

const persistConfig = {
  key: 'user',
  storage: AsyncStorage,
};

const reducer = combineReducers({
  ride: rideReducer,
  user: userReducer
})

const persisterReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persisterReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
  // other options e.g middleware, go here
})

export const persistor = persistStore(store);