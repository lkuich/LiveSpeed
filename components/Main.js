import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  Switch,
  Button,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Slider from '@react-native-community/slider';
import Tts from 'react-native-tts';
import RNSpeedometer from './RNSpedometer';

async function postToApi(body) {
  return postData(
    'https://us-west2-skii-speed.cloudfunctions.net/skii_api',
    body,
  );
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

const styles = {
  container: {
    flex: 1,
  },
  halfHeight: {
    flex: 0.5,
    backgroundColor: '#FF3366',
  },
  quarterHeight: {
    flex: 0.25,
    backgroundColor: '#000',
  },
};

export const Main = () => {
  const [speedThreshold, setSpeedThreshold] = useState(5);

  const [useMetric, setUseMetric] = useState(true);
  const unit = useMetric ? 'Kph' : 'Mph';

  const [useDarkTheme, setUseDarkTheme] = useState(true);

  const [speed, setSpeed] = useState(0);
  const speedKm = speed > 0 ? Math.round(speed * useMetric ? 3.6 : 2.23694) : 0;

  const [watchId, setWatchId] = useState(null);

  const [previousRecord, setPreviousRecord] = useState(0);

  useEffect(() => {
    if (speedKm >= speedThreshold) {
      if (speedKm - previousRecord >= 4 || speedKm - previousRecord <= -4) {
        Tts.speak(`${speedKm} K`);
      }
    }

    setPreviousRecord(speedKm);
  }, [speedKm, previousRecord]);

  useEffect(() => {
    const w = Geolocation.watchPosition(
      async (pos) => {
        setSpeed(pos.coords.speed);
      },
      (e) => {
        console.error(e);
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 0,
        distanceFilter: 1,
      },
    );

    setWatchId(w);
  }, [setWatchId]);

  // return (
  //   // Try setting `justifyContent` to `center`.
  //   // Try setting `flexDirection` to `row`.
  //   <View
  //     style={{
  //       flex: 1,
  //       flexDirection: 'column',
  //       justifyContent: 'space-between',
  //     }}>
  //     <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
  //     <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
  //     <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
  //   </View>
  // );

  const row = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const color = useDarkTheme ? '#FFF' : '#000';

  return (
    <View
      padding={24}
      style={{
        backgroundColor: useDarkTheme ? '#000' : '#FFF',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        color,
      }}>
      <Text
        style={{fontSize: 32, textAlign: 'center', paddingBottom: 8, color}}>
        LiveSpeed
      </Text>
      <Text style={{textAlign: 'center', color}}>v1.2 by lkuich</Text>
      <View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-evenly',
        }}>
        <View>
          <RNSpeedometer
            value={speedKm}
            size={300}
            maxValue={300}
            suffix={unit}
            color={color}
            labels={[
              {
                labelColor: '#ff2900',
                activeBarColor: '#ff2900',
              },
              {
                labelColor: '#ff5400',
                activeBarColor: '#ff5400',
              },
              {
                labelColor: '#f4ab44',
                activeBarColor: '#f4ab44',
              },
              {
                labelColor: '#f2cf1f',
                activeBarColor: '#f2cf1f',
              },
              {
                labelColor: '#14eb6e',
                activeBarColor: '#14eb6e',
              },
              {
                labelColor: '#00ff6b',
                activeBarColor: '#00ff6b',
              },
            ]}
          />
        </View>

        <View>
          <Text style={{fontSize: 20, color}}>
            Readout Threshold: {speedThreshold} {unit}
          </Text>
          <Slider
            style={{height: 40}}
            minimumValue={5}
            maximumValue={200}
            step={5}
            value={speedThreshold}
            onValueChange={(v) => setSpeedThreshold(v)}
          />

          <View style={{...row, paddingTop: 16, paddingBottom: 16}}>
            <Text style={{fontSize: 20, color}}>{unit}</Text>
            <Switch onValueChange={setUseMetric} value={useMetric} />
          </View>

          <View style={row}>
            <Text style={{fontSize: 20, color}}>
              {useDarkTheme ? 'Dark Theme' : 'Light Theme'}
            </Text>
            <Switch onValueChange={setUseDarkTheme} value={useDarkTheme} />
          </View>
        </View>
      </View>
    </View>
  );
};
