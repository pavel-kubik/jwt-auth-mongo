import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { signIn } from '../../util/auth';
import defaultTranslator from '../../util/defaultTranslator';
import Button from './Button';
import ButtonBar from './ButtonBar';
import { isWeb } from '../../util/util';

export type Props = {
  setLoggedUser: Function;
  storeUserData: Function;
  preSignIn?: Function;
  postSignIn?: Function;
  apiUrl: string;
  t?: Function;
  styleSheetWeb?: StyleSheet;
  styleSheetMobile?: StyleSheet;
};

const SignInForm: React.FC<Props> = ({
  setLoggedUser,
  storeUserData,
  preSignIn = null,
  postSignIn = null,
  apiUrl = null,
  t = defaultTranslator,
  styleSheetWeb = null,
  styleSheetMobile = null,
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

const styleTemplates = isWeb()
  ? StyleSheet.create({
      container: {
        maxWidth: 600,
        height: '100%',
      },
      fieldView: {},
      fieldWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
      },
      input: {
        borderWidth: 1,
        marginLeft: 20,
        paddingLeft: 5,
      },
      buttonArea: {
        flexDirection: 'column',
        paddingTop: 20,
      },
      errorMessage: {
        color: 'red',
        textAlign: 'center',
      },
    })
  : // mobile styles
    StyleSheet.create({
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

export default SignInForm;
