import { createSlice } from "@reduxjs/toolkit";
import { messages as messagesEN } from "../messages/en";
import type { LanguageState, LocaleMessages } from "../types/messages.types";

const availableMessages: LocaleMessages = {
  en: messagesEN
};

const initialState: LanguageState = {
  locale: "en",
  messages: availableMessages
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload;
    }
  }
});

export const { setLocale } = messagesSlice.actions;

export const selectLocale = (state: { messages: LanguageState; }) => state.messages.locale;
export const selectMessages = (state: { messages: LanguageState; }) => state.messages.messages;
export const selectCurrentMessages = (state: { messages: LanguageState; }) =>
  state.messages.messages[state.messages.locale];

export default messagesSlice.reducer;