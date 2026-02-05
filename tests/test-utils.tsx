import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from 'react-redux';
import store from '@/redux/store';

export const renderWithProviders = (ui: ReactElement) => render(<Provider store={store}>{ui}</Provider>);
