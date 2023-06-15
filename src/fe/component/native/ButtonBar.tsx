import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

export type Props = {
  children: JSX.Element | JSX.Element[];
};

const ButtonBar: React.FC<Props> = ({ children }: Props) => {
  return <View style={styles.buttonBar}>{children}</View>;
};

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-between',
    padding: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
});

export default ButtonBar;
