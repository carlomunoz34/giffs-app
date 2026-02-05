import { useDispatch, useSelector } from "react-redux";
import { getFeatureFlags, toggleFeatureFlag } from "../../redux/featureFlagsSlice";
import type { FeatureFlagName } from "../../types/featureFlags.types";

export const useFeatureFlag = () => {
  const dispatch = useDispatch();
  const featureFlags = useSelector(getFeatureFlags);

  const isFeatureFlagEnabled = (featureFlag: FeatureFlagName) => {
    return featureFlags.includes(featureFlag);
  };

  const enableFeatureFlag = (featureFlag: FeatureFlagName) => {
    if (isFeatureFlagEnabled(featureFlag)) {
      return;
    }
    dispatch(toggleFeatureFlag(featureFlag));
  };

  const disableFeatureFlag = (featureFlag: FeatureFlagName) => {
    if (!isFeatureFlagEnabled(featureFlag)) {
      return;
    }
    dispatch(toggleFeatureFlag(featureFlag));
  };

  return {
    isFeatureFlagEnabled,
    enableFeatureFlag,
    disableFeatureFlag
  };
};