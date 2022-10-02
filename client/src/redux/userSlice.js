import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        loginFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        logout: (state) => {
            state.currentUser = initialState.currentUser;
            state.loading = false;
            state.error = false;
        },
        subscription: (state, action) => {
            if (state.currentUser.subscribedUsers?.includes(action.payload)) {
                state.currentUser.subscribedUsers?.splice(
                    state.currentUser.subscribedUsers.findIndex(userId => userId === action.payload),
                    1
                );
            } else {
                state.currentUser.subscribedUsers.push(action.payload);
            }
        }
    }
})

export const { loginStart, loginSuccess, loginFailed, logout, subscription } = userSlice.actions;

export default userSlice.reducer;