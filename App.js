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

import {Speedometer} from './components/Speedometer';

const App: () => React$Node = () => {
  Tts.setIgnoreSilentSwitch('ignore');

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View padding={24}>
          <Speedometer />
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
