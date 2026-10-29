import { createSlice } from '@reduxjs/toolkit';
const uiSlice = createSlice({
  name: 'ui',
  initialState: { darkMode: localStorage.getItem('darkMode') === 'true', sidebarOpen: false },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', String(state.darkMode));
      document.documentElement.classList.toggle('dark', state.darkMode);
    },
    setSidebar: (state, action) => { state.sidebarOpen = action.payload; },
  }
});
export const { toggleDarkMode, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
