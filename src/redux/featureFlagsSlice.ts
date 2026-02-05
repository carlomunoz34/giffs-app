import { createSlice } from "@reduxjs/toolkit";
import type { FeatureFlagName } from "../types/featureFlags.types";

const urlParams = new URLSearchParams(window.location.search);
const supportedFeatureFlags: FeatureFlagName[] = ["staticData"];
let initialState: FeatureFlagName[] = [];

const extractFeatureFlags = (urlFeatureFlags: unknown): FeatureFlagName[] => {
  if (urlFeatureFlags == null || !Array.isArray(urlFeatureFlags)) {
    return initialState;
  }
  return urlFeatureFlags.filter(param => supportedFeatureFlags.includes(param));
};

const urlFeatureFlagsRaw = urlParams.get("featureFlags");
if (urlFeatureFlagsRaw != null) {
  try {
    initialState = extractFeatureFlags(JSON.parse(urlFeatureFlagsRaw));
  } catch (error) {
    console.error(error);
  }
}

const featureFlagSlice = createSlice({
  name: "featureFlags",
  initialState,
  reducers: {
    toggleFeatureFlag: (state, action) => {
      if (!supportedFeatureFlags.includes(action.payload)) {
        return;
      }

      if (state.includes(action.payload)) {
        state = state.filter(featureFlag => featureFlag !== action.payload);
      } else {
        state = [...state, action.payload];
      }
    }
  }
});

export const getFeatureFlags = (state: { featureFlags: FeatureFlagName[]; }) => state.featureFlags;
export const { toggleFeatureFlag } = featureFlagSlice.actions;
export default featureFlagSlice.reducer;
