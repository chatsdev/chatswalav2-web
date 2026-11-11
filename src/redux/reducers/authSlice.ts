import { AuthState } from "@/src/types/auth";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  authRedirectField: "",
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthRedirectField: (state, action) => {
      state.authRedirectField = action.payload;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      if (state.user) {
        state.user = {
          ...state.user,
          ...user,
          phone: user.phone !== undefined ? user.phone : state.user.phone,
          country: user.country !== undefined ? user.country : state.user.country,
          country_code: user.country_code !== undefined ? user.country_code : state.user.country_code,
          note: user.note !== undefined ? user.note : state.user.note,
        };
      } else {
        state.user = user;
      }
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.permissions = [];
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setAuthRedirectField, setCredentials, setLogout, stopLoading, updateUser, setPermissions } = authSlice.actions;

export default authSlice.reducer;
