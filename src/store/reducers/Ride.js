import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { fetchCount } from './counterAPI';
const initialState = {
  value: 0,
  status: 'idle',
  ridePath: [],
  token: '',
  chargedAmount: 0
};

// asynchronous function with createAsyncThunk
export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount) => {
    return [1,2,3,4,5,6,7,8,9,0];
    // const response = await fetchCount(amount);
    // return response.data;
  }
);

// Redux Toolkit slice
export const rideSlice = createSlice({
  name: 'ride',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    userRideLocation: (state, action) => {
      state.ridePath.push(action.payload);
    },
    resetRideLocation: (state, action) => {
      state.ridePath = action.payload; 
    },
    rideToken: (state, action) => {
      state.token = action.payload; 
    },
    setChargedAmount: (state, action) => {
      state.chargedAmount = action.payload; 
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value = action.payload;
      });
  },
});
export const { increment, decrement, incrementByAmount, userRideLocation, resetRideLocation, rideToken, setChargedAmount } = rideSlice.actions;
// more code...
export default rideSlice.reducer;