import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { signIn } from '../../util/auth';
import defaultTranslator from '../../util/defaultTranslator';

export type Props = {
  setLoggedUser: Function;
  preSignIn?: Function;
  postSignIn?: Function;
  t?: Function;
};

const SignInForm: React.FC<Props> = ({
  setLoggedUser,
  preSignIn = null,
  postSignIn = null,
  t = defaultTranslator,
}) => {
  const [signInError, setSignInError] = useState(null);

  const signInHandler = async (values) => {
    if (preSignIn) {
      preSignIn();
    }
    const userData = await signIn(
      values.email,
      values.password,
      setLoggedUser,
      setSignInError,
      t
    );
    values.password = '';
    if (postSignIn) {
      postSignIn(userData);
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
                onChange={() => handleChange('email')}
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
                onChange={() => handleChange('password')}
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
            <Button
              title={t('components.authForm.login')}
              onPress={() => handleSubmit()}
            />
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
