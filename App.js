/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, View, StatusBar} from 'react-native';
import Tts from 'react-native-tts';

import {Main} from './components/Main';

const App: () => React$Node = () => {
  Tts.setIgnoreSilentSwitch('ignore');

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <Main />
      </SafeAreaView>
    </>
  );
};

export default App;
