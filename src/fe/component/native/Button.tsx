import React from 'react';
import { View } from 'react-native';
import { Text, StyleSheet, Pressable } from 'react-native';

export type Props = {
  onPress: Function;
  title: string;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({ onPress, title, disabled = false }) => {
  return (
    <>
      {!disabled && (
        <Pressable style={styles.button} onPress={() => onPress()}>
          <Text style={styles.text}>{title}</Text>
        </Pressable>
      )}
      {disabled && (
        <View style={styles.disabledButton}>
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#2196F3',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  disabledButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'silver',
  },
});

export default Button;
