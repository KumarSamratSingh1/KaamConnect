import { createSlice } from '@reduxjs/toolkit';
const chatSlice = createSlice({
  name: 'chat',
  initialState: { conversations: [], activeConversation: null, messages: {}, typingUsers: {} },
  reducers: {
    setConversations: (state, action) => { state.conversations = action.payload; },
    setActiveConversation: (state, action) => { state.activeConversation = action.payload; },
    setMessages: (state, action) => { state.messages[action.payload.convId] = action.payload.messages; },
    addMessage: (state, action) => {
      const { convId, message } = action.payload;
      if (!state.messages[convId]) state.messages[convId] = [];
      state.messages[convId].push(message);
    },
    setTyping: (state, action) => { state.typingUsers[action.payload.convId] = action.payload.isTyping; },
  }
});
export const { setConversations, setActiveConversation, setMessages, addMessage, setTyping } = chatSlice.actions;
export default chatSlice.reducer;
