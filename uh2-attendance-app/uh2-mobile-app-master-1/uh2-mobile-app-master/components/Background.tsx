import React, { memo } from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from 'react-native';

type Props = {
  children: React.ReactNode;
};

const Background = ({ children }: Props) => (
  // <ImageBackground
  //   source={require('../assets/background_dot.png')}
  //   resizeMode="repeat"
  //   style={styles.background}
  // >
    <View style={styles.background}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </View>
);

const styles = StyleSheet.create({
  background: {
    zIndex: 1,
    flex: 1,
    width: '100%',
  },
  container: {
    opacity: 1,
    zIndex: -100,
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(Background);
