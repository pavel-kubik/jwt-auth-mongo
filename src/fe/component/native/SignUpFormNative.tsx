import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { signUp } from '../../util/auth';
import defaultTranslator from '../../util/defaultTranslator';
import Button from './Button';
import ButtonBar from './ButtonBar';

export type Props = {
  setLoggedUser: Function;
  storeUserData: Function;
  preSignUp?: Function;
  postSignUp?: Function;
  apiUrl?: string;
  t?: Function;
};

const SignUpForm: React.FC<Props> = ({
  setLoggedUser,
  storeUserData,
  preSignUp = null,
  postSignUp = null,
  apiUrl = null,
  t = defaultTranslator,
}) => {
  const [signUpError, setSignUpError] = useState(null);

  const signUpHandler = async (values) => {
    try {
      if (preSignUp) {
        preSignUp();
      }
      const userData = await signUp(
        values.username,
        values.email,
        values.password,
        setLoggedUser,
        setSignUpError,
        storeUserData,
        apiUrl,
        t
      );
      if (userData) {
        values.password = '';
        if (postSignUp) {
          postSignUp(userData);
        }
      } else {
        setSignUpError(t('lib.auth.signUp.cantSignUp'));
        return false;
      }
    } catch (e) {
      setSignUpError(t('lib.auth.signUp.cantSignUp'));
      return false;
    }
  };

  const validationSignUp = Yup.object().shape({
    username: Yup.string().required(t('components.authForm.required')),
    email: Yup.string()
      .email('components.user.emailInvalid')
      .required(t('components.authForm.required')),
    password: Yup.string().required(t('components.authForm.required')),
  });

  const signUpFormChanged = () => {
    setSignUpError(null);
  };

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
      }}
      validateOnChange={false}
      validationSchema={validationSignUp}
      onSubmit={signUpHandler}
      onChange={signUpFormChanged}
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
              <Text>{t('components.authForm.username')}</Text>
              <TextInput
                style={styles.input}
                onBlur={handleBlur('username')}
                value={values.username}
                placeholder="Enter username"
                autoComplete="off"
                onChangeText={handleChange('username')}
              />
            </View>
            {errors.username && touched.username ? (
              <Text style={styles.errorMessage}>
                {errors.username as string}
              </Text>
            ) : null}
          </View>
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
            {signUpError && (
              <Text style={styles.errorMessage}>{signUpError}</Text>
            )}
            <ButtonBar>
              <Button
                title={t('components.authForm.register')}
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

export default SignUpForm;
