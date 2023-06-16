import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { signUp } from '../../util/auth';
import defaultTranslator from '../../util/defaultTranslator';
import Button from './Button';
import ButtonBar from './ButtonBar';
import { isWeb } from '../../util/util';

export type Props = {
  setLoggedUser: Function;
  storeUserData: Function;
  preSignUp?: Function;
  postSignUp?: Function;
  apiUrl?: string;
  t?: Function;
  styleSheetWeb?: StyleSheet;
  styleSheetMobile?: StyleSheet;
};

const SignUpForm: React.FC<Props> = ({
  setLoggedUser,
  storeUserData,
  preSignUp = null,
  postSignUp = null,
  apiUrl = null,
  t = defaultTranslator,
  styleSheetWeb = null,
  styleSheetMobile = null,
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

  const styles: any = isWeb()
    ? styleSheetWeb
      ? styleSheetWeb
      : styleTemplates
    : styleSheetMobile
    ? styleSheetMobile
    : styleTemplates;

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
          <View style={styles.fieldView}>
            <View style={styles.fieldWrapper}>
              {isWeb() && <Text>{t('components.authForm.username')}</Text>}
              <TextInput
                style={styles.input}
                onBlur={handleBlur('username')}
                value={values.username}
                placeholder="Enter username"
                placeholderTextColor={isWeb() ? 'black' : 'white'}
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
          <View style={styles.fieldView}>
            <View style={styles.fieldWrapper}>
              {isWeb() && <Text>{t('components.authForm.email')}</Text>}
              <TextInput
                style={styles.input}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="Enter email"
                placeholderTextColor={isWeb() ? 'black' : 'white'}
                autoComplete="off"
                onChangeText={handleChange('email')}
              />
            </View>
            {errors.email && touched.email ? (
              <Text style={styles.errorMessage}>{errors.email as string}</Text>
            ) : null}
          </View>
          <View style={styles.fieldView}>
            <View style={styles.fieldWrapper}>
              {isWeb() && <Text>{t('components.authForm.password')}</Text>}
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Enter password"
                placeholderTextColor={isWeb() ? 'black' : 'white'}
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

const styleTemplates = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fieldView: {
    width: '100%',
    alignItems: 'center',
  },
  fieldWrapper: {
    backgroundColor: '#3BF',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginTop: 20,

    alignItems: 'center',
  },
  input: {
    height: 50,
    flex: 1,
    padding: 10,
    textAlign: 'center',
    width: '100%',
    color: 'white',
  },
  buttonArea: {
    flexDirection: 'column',
    paddingTop: 20,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
});

export default SignUpForm;
