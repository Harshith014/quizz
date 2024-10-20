import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../components/Api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/auth/logout`);
        localStorage.removeItem('token');
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { isAuthenticated: true };
    }
    return { isAuthenticated: false };
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload || 'Login failed';
                state.isAuthenticated = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
            });
    },
});

export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;