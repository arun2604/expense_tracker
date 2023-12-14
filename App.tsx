import React from 'react';
import Navigation from './src/navigations/Stack/Navigation';
import store from './src/features/Redux/Store';
import {Provider} from 'react-redux';
import 'react-native-gesture-handler';
import {PaperProvider, useTheme} from 'react-native-paper';
import {useAppSelector} from './src/features/Redux/Store';
import {darkTheme, lightTheme} from './src/theme/Theme';

export type AppTheme = typeof lightTheme;

export const useAppTheme = () => useTheme<AppTheme>();

const Wrapper = () => {
  const isDarkTheme: any = useAppSelector(state => state.theme.isDarkTheme);
  const colors = isDarkTheme ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={{...colors, dark: isDarkTheme, mode: 'exact'}}>
      <Navigation />
    </PaperProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  );
};

export default App;
