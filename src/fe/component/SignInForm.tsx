import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { signIn } from '../util/auth';

const SignInForm = ({
  setLoggedUser,
  preSignIn = null,
  postSignIn = null,
  apiUrl = null,
  t = (key: string, replaceValues = {}) => key,
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
      apiUrl,
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
    <>
      <div className="auth-form">
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
            <fieldset>
              <div className="field-wrap">
                <label>{t('components.user.login.email')}</label>
                <input
                  type="text"
                  onBlur={handleBlur('email')}
                  value={values.email}
                  autoComplete="off"
                  onChange={handleChange('email')}
                />
              </div>
              {errors.email && touched.email ? (
                <div className="field-error">{errors.email as string}</div>
              ) : null}
              <div className="field-wrap">
                <label>{t('components.user.login.password')}</label>
                <input
                  type="password"
                  onBlur={handleBlur('password')}
                  value={values.password}
                  autoComplete="off"
                  onChange={handleChange('password')}
                />
              </div>
              {errors.password && touched.password ? (
                <div className="field-error">{errors.password as string}</div>
              ) : null}{' '}
              <div className="field-wrap">
                {signInError && (
                  <div className="field-error">{signInError}</div>
                )}
              </div>
              <div
                className="button"
                onClick={() => handleSubmit(values)} //can't pass function directly because of TS
              >
                {t('components.user.login.submit')}
              </div>
            </fieldset>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SignInForm;
