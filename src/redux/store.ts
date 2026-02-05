import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./messagesSlice";
import featureFlagsReducer from "./featureFlagsSlice";

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    featureFlags: featureFlagsReducer
  }
});

export default store;