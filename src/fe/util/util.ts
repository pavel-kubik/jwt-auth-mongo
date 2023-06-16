import { Platform } from 'react-native';

export const isWeb = () => {
  return Platform.OS === 'web';
};
