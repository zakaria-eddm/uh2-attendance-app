import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../assets/logo-attendance.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
});

export default memo(Logo);
