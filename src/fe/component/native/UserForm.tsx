import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import defaultTranslator from '../../util/defaultTranslator';
import Button from './Button';
import ButtonBar from './ButtonBar';

export type Props = {
  loggedUser: { username: string };
  signOut: Function;
  t: Function;
};

const UserForm: React.FC<Props> = ({
  loggedUser,
  signOut,
  t = defaultTranslator,
}) => {
  return (
    <View>
      {loggedUser && (
        <>
          <Text style={styles.container}>
            {t('components.authForm.welcome', {
              username: loggedUser.username,
            })}
          </Text>
          <ButtonBar>
            <Button title={t('global.signOut')} onPress={signOut} />
          </ButtonBar>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    textAlign: 'center',
  },
});

export default UserForm;
