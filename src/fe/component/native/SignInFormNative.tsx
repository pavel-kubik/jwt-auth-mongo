import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { signIn } from '../../util/auth';
import defaultTranslator from '../../util/defaultTranslator';
import Button from './Button';
import ButtonBar from './ButtonBar';

export type Props = {
  setLoggedUser: Function;
  storeUserData: Function;
  preSignIn?: Function;
  postSignIn?: Function;
  apiUrl: string;
  t?: Function;
};

const SignInForm: React.FC<Props> = ({
  setLoggedUser,
  storeUserData,
  preSignIn = null,
  postSignIn = null,
  apiUrl = null,
  t = defaultTranslator,
}) => {
  const [signInError, setSignInError] = useState(null);

  const signInHandler = async (values) => {
    try {
      if (preSignIn) {
        preSignIn();
      }
      const userData = await signIn(
        values.email,
        values.password,
        setLoggedUser,
        setSignInError,
        storeUserData,
        apiUrl,
        t
      );
      if (userData) {
        values.password = '';
        if (postSignIn) {
          postSignIn(userData);
        }
      } else {
        setSignInError(t('lib.auth.signIn.cantLogin'));
        return false;
      }
    } catch (e) {
      setSignInError(t('lib.auth.signIn.cantLogin'));
      return false;
    }
  };

  const validationSignIn = Yup.object().shape({
    email: Yup.string()
      .email(t('components.authForm.emailInvalid'))
      .required(t('components.authForm.required')),
    password: Yup.string().required(t('components.authForm.required')),
  });

  const signInFormChanged = () => {
    setSignInError(null);
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validateOnChange={false}
      validationSchema={validationSignIn}
      onSubmit={signInHandler}
      onChange={signInFormChanged}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        values,
        errors,
      }) => (
        <View style={styles.container}>
          <View>
            <View style={styles.fieldWrapper}>
              <Text>{t('components.authForm.email')}</Text>
              <TextInput
                style={styles.input}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="Enter email"
                autoComplete="off"
                onChangeText={handleChange('email')}
              />
            </View>
            {errors.email && touched.email ? (
              <Text style={styles.errorMessage}>{errors.email as string}</Text>
            ) : null}
          </View>
          <View>
            <View style={styles.fieldWrapper}>
              <Text>{t('components.authForm.password')}</Text>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Enter password"
                autoComplete="off"
                onChangeText={handleChange('password')}
              />
            </View>
            {errors.password && touched.password ? (
              <Text style={styles.errorMessage}>
                {errors.password as string}
              </Text>
            ) : null}
          </View>
          <View style={styles.buttonArea}>
            {signInError && (
              <Text style={styles.errorMessage}>{signInError}</Text>
            )}
            <ButtonBar>
              <Button
                title={t('components.authForm.login')}
                onPress={handleSubmit}
              />
            </ButtonBar>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    height: '100%',
  },
  fieldWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  buttonArea: {
    flexDirection: 'column',
    paddingTop: 20,
  },
  input: {
    borderWidth: 1,
    marginLeft: 20,
    paddingLeft: 5,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
});

export default SignInForm;
