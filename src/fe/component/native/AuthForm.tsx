import React, { useState } from 'react';

import defaultTranslator from '../../util/defaultTranslator';
import { Tab, TabView } from '@rneui/themed';
import SignInForm from './SignInFormNative';
import SignUpForm from './SignUpFormNative';
import { StyleSheet, View } from 'react-native';
import UserForm from './UserForm';

export type Props = {
  loggedUser: { username: string };
  setLoggedUser: Function;
  storeUserData: Function;
  clearUserData: Function;
  preSignIn?: Function;
  preSignUp?: Function;
  postSignIn?: Function;
  postSignUp?: Function;
  apiUrl?: string;
  t: Function;
  styleTemplate?: {
    signInWeb?: StyleSheet;
    signInMobile?: StyleSheet;
    signUpWeb?: StyleSheet;
    signUpMobile?: StyleSheet;
  };
};

const AuthForm: React.FC<Props> = ({
  loggedUser,
  setLoggedUser,
  storeUserData,
  clearUserData,
  preSignIn = null,
  preSignUp = null,
  postSignIn = null,
  postSignUp = null,
  apiUrl = null,
  t = defaultTranslator,
  styleTemplate = null,
}) => {
  const [index, setIndex] = useState(0);

  const signOut = async () => {
    setLoggedUser(null);
    clearUserData();
  };

  return (
    <View style={styles.container}>
      {!loggedUser && (
        <>
          <Tab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
              backgroundColor: 'white',
              height: 3,
            }}
            variant="primary"
          >
            <Tab.Item title="Login" />
            <Tab.Item title="Register" />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={styles.tab}>
              <SignInForm
                setLoggedUser={setLoggedUser}
                storeUserData={storeUserData}
                preSignIn={preSignIn}
                postSignIn={postSignIn}
                apiUrl={apiUrl}
                t={t}
                styleSheetWeb={styleTemplate.signInWeb}
                styleSheetMobile={styleTemplate.signInMobile}
              />
            </TabView.Item>
            <TabView.Item style={styles.tab}>
              <SignUpForm
                setLoggedUser={setLoggedUser}
                storeUserData={storeUserData}
                preSignUp={preSignUp}
                postSignUp={postSignUp}
                apiUrl={apiUrl}
                t={t}
                styleSheetWeb={styleTemplate.signUpWeb}
                styleSheetMobile={styleTemplate.signUpMobile}
              />
            </TabView.Item>
          </TabView>
        </>
      )}
      {loggedUser && (
        <UserForm loggedUser={loggedUser} signOut={signOut} t={t} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%', // content is collapsed if not present
  },
  tab: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default AuthForm;
