import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { signUp } from '../util/auth';

const SignUpForm = ({
  setLoggedUser,
  preSignUp = null,
  postSignUp = null,
  apiUrl = null,
  t = (key: string, replaceValues = {}) => key,
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
      apiUrl,
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
    <>
      <div className="auth-form">
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
            <fieldset>
              <div className="field-wrap">
                <label>{t('components.user.register.username')}</label>
                <input
                  type="text"
                  onBlur={handleBlur('username')}
                  value={values.username}
                  autoComplete="off"
                  onChange={handleChange('username')}
                />
              </div>
              {errors.username && touched.username ? (
                <div className="field-error">{errors.username as string}</div>
              ) : null}
              <div className="field-wrap">
                <label>{t('components.user.register.email')}</label>
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
                <label>{t('components.user.register.password')}</label>
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
              ) : null}
              <div className="field-wrap">
                {signUpError && (
                  <div className="field-error">{signUpError}</div>
                )}
              </div>
              <div
                className="button"
                onClick={() => handleSubmit(values)} //can't pass function directly because of TS
              >
                {t('components.user.register.submit')}
              </div>
            </fieldset>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SignUpForm;
