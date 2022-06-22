import * as mobilenet from '@tensorflow-models/mobilenet';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {

  const [hasCameraPermission, sethasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);


  const imageRef = useRef()
  const textInputRef = useRef()
  const fileInputRef = useRef()


  const loadModel = async () => {
    try {
      const model = await mobilenet.load()
      // console.log("Model loaded");
      setModel(model)
    } catch (error) {
      console.log(error)
    }
  }
  loadModel()

  const uploadImage = (e) => {
    const { files } = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    } else {
      setImageURL(null)
    }
  }

  const identify = async () => {
    console.log(model);
    console.log(image);
    const results = await model.classify(image.current)
    setResults(results)
    // console.log(results);
  }

  // useEffect(() => {
  //   loadModel()
  // }, [])


  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      sethasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const triggerUpload = () => {
    console.log("Model called");
    loadModel()
    setImage('assets/3135715.png')
    // if (camera) {
    //   const data = camera.takePictureAsync(null)
    //   setImage(data)
    //   // setImage("clearfix_camera/assets/3135715.png")
    //   console.log(data.base64)
    // }
  
    identify(image)
  }



  if (hasCameraPermission === false) {
    return <Text>No Camera Access</Text>;
  }


  return (
    <View style={styles.container}>
      <Text style={{ margin: 10 }}>Image Identification</Text>

      <View style={styles.cameraContainer}>
        <Camera ref={ref => setCamera(ref)}
          style={styles.captureingPart}
          type={type}
          crossOrigin='anonymous'
        />
      </View>

      <Button
        title='Flip Camera'
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      />

      <Button title='Take picture' onPress={() => triggerUpload()} />

      {results.length > 0 && <View>
        {results.map((result, index) => {
          return (
            <View key={index}>
              <Text style={styles.result}>{result.className}</Text>
            </View>
          )
        })}
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    borderWidth: 4,
    borderColor: 'red',
    borderRadius: 32,
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    margin: 10,
  },
  captureingPart: {
    height: 400,
    width: '100%',
    margin: 'auto',
  },
  flipIconButton: {
    alignSelf: 'center',
    alignItems: 'center',
    margin: 6,
  },
  result: {
    fontSize: 10,
    color: 'orange',
  }
});
