import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = () => localStorage.getItem('token');

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await axios.get('http://localhost:5000/api/cart', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data.items;
});

export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ itemId, quantity }, { dispatch }) => {
  await axios.put(
    `http://localhost:5000/api/cart/items/${itemId}`,
    { quantity },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  dispatch(fetchCart());
});

export const removeCartItem = createAsyncThunk('cart/removeItem', async (itemId, { dispatch }) => {
  await axios.delete(`http://localhost:5000/api/cart/items/${itemId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  dispatch(fetchCart());
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { dispatch }) => {
  await axios.delete('http://localhost:5000/api/cart/clear', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  dispatch(fetchCart());
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
