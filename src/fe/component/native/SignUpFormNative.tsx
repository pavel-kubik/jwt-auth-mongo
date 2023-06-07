import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Text, TextInput, View } from 'react-native';

import { signUp } from '../../util/auth';
import defaultTranslator from '../../util/defaultTranslator';

export type Props = {
  setLoggedUser: Function;
  preSignUp?: Function;
  postSignUp?: Function;
  t?: Function;
};

const SignUpForm: React.FC<Props> = ({
  setLoggedUser,
  preSignUp = null,
  postSignUp = null,
  t = defaultTranslator,
}) => {
  const [signUpError, setSignUpError] = useState(null);

  const signUpHandler = async (values) => {
    if (preSignUp) {
      preSignUp();
    }
    const userData = await signUp(
      values.username,
      values.email,
      values.password,
      setLoggedUser,
      setSignUpError,
      t
    );
    values.password = '';
    if (postSignUp) {
      postSignUp(userData);
    }
  };

  const validationSignUp = Yup.object().shape({
    username: Yup.string().required(t('components.authForm.required')),
    email: Yup.string()
      .email(t('components.authForm.emailInvalid'))
      .required(t('components.authForm.required')),
    password: Yup.string().required(t('components.authForm.required')),
  });

  const signUpFormChanged = () => {
    setSignUpError(null);
  };

  return (
    <View>
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
          <View>
            <View>
              <Text>{t('components.user.register.username')}</Text>
              <TextInput
                onBlur={handleBlur('username')}
                value={values.username}
                autoComplete="off"
                onChangeText={handleChange('username')}
              />
              {errors.username && touched.username ? (
                <Text style={ErrorButton}>{errors.username as string}</Text>
              ) : null}
            </View>
            <View>
              <Text>{t('components.user.register.email')}</Text>
              <TextInput
                onBlur={handleBlur('email')}
                value={values.email}
                autoComplete="off"
                onChangeText={handleChange('email')}
              />
              {errors.email && touched.email ? (
                <Text style={ErrorButton}>{errors.email as string}</Text>
              ) : null}
            </View>
            <View>
              <Text>{t('components.user.register.password')}</Text>
              <TextInput
                secureTextEntry={true}
                onBlur={handleBlur('password')}
                value={values.password}
                autoComplete="off"
                onChangeText={handleChange('password')}
              />
              {errors.password && touched.password ? (
                <Text style={ErrorButton}>{errors.password as string}</Text>
              ) : null}
            </View>
            {signUpError && <Text style={ErrorButton}>{signUpError}</Text>}
            <Button
              title={t('components.user.register.submit')}
              onPress={() => handleSubmit(values)}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const ErrorButton = {
  color: 'red',
};

export default SignUpForm;
