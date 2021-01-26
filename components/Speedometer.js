import React, {useState, useEffect} from 'react';
import {Text, TextInput, Button, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Slider from '@react-native-community/slider';
import Tts from 'react-native-tts';

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

export const Speedometer = () => {
  const [userId, setUserId] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speedThreshold, setSpeedThreshold] = useState(5);

  const [speed, setSpeed] = useState(0);
  const speedKm = speed > 0 ? Math.round(speed * 3.6) : 0;

  const [watchId, setWatchId] = useState(null);

  const [previousRecord, setPreviousRecord] = useState(0);

  useEffect(() => {
    if (isRecording && speedKm >= speedThreshold) {
      if (speedKm - previousRecord >= 2 || speedKm - previousRecord <= -2) {
        Tts.speak(`${speedKm} K`);
      }
    }

    setPreviousRecord(speedKm);
  }, [speedKm, previousRecord]);

  useEffect(() => {
    if (isRecording === true) {
      const w = Geolocation.watchPosition(
        async (pos) => {
          setSpeed(pos.coords.speed);

          await postToApi({userId, ...pos});
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
    } else if (watchId === null) {
    } else if (watchId !== undefined && watchId !== null) {
      Geolocation.clearWatch(watchId);
      Geolocation.stopObserving();

      setSpeed(0);
      setPreviousRecord(0);
      setWatchId(undefined);
    }
  }, [isRecording]);

  return (
    <>
      <Text>ver 1.2</Text>
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(t) => setUserId(parseInt(t) || 0)}
        value={userId}
      />

      <Text>Speed Threshold: {speedThreshold} km/h</Text>
      <Slider
        style={{height: 40}}
        minimumValue={5}
        maximumValue={100}
        step={5}
        value={speedThreshold}
        onValueChange={(v) => setSpeedThreshold(v)}
      />

      <Button
        onPress={() => {
          if (userId === 0 || !userId || userId === '') {
            Alert.alert('Error', 'Please select a user ID', ['Ok'], {
              cancelable: true,
            });
          } else setIsRecording(!isRecording);
        }}
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        color="#841584"
      />

      <Text
        style={{
          paddingTop: 12,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 0,
          width: '100%',
          height: 50,
          backgroundColor: 'yellow',
        }}>
        {speedKm} km/h
      </Text>
    </>
  );
};
