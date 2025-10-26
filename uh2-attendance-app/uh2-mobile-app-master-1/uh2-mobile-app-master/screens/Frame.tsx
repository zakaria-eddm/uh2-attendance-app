import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface FrameProps {
  title?: string;
  children: React.ReactNode;
}

const Frame: React.FC<FrameProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.frame}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
        padding: 5,
        zIndex: 1,
        width: '115%',
        opacity: 1,
        maxWidth:'120%',
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf:'center'
  },
  frame: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
});

export default Frame;
