import React from 'react';
import { useState } from 'react';
import { clearUserDataInLocalStorage } from '../util/auth';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthForm = ({
  loggedUser,
  setLoggedUser,
  preSignIn = null,
  preSignUp = null,
  postSignIn = null,
  postSignUp = null,
  apiUrl = null,
  t = (key: string, replaceValues = {}) => key,
}) => {
  const [authMode, setAuthMode] = useState('signin');

  const changeAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  const isSignUp = () => {
    return authMode === 'signup';
  };

  const isSignIn = () => {
    return authMode === 'signin';
  };

  const signOut = async () => {
    setLoggedUser(null);
    clearUserDataInLocalStorage();
  };

  return (
    <div className="auth">
      <div className="login-sign-up-form">
        {loggedUser && (
          <>
            <div>
              {t('components.authForm.welcome', {
                username: loggedUser.username,
              })}
            </div>
            <div className="button" onClick={signOut}>
              {t('global.signOut')}
            </div>
          </>
        )}
        {!loggedUser && (
          <>
            <ul className="tab-group">
              <li className="tab active">
                <div
                  onClick={changeAuthMode}
                  className={isSignIn() ? 'active' : ''}
                >
                  {t('components.user.login.title')}
                </div>
              </li>
              <li className="tab">
                <div
                  onClick={changeAuthMode}
                  className={isSignUp() ? 'active' : ''}
                >
                  {t('components.user.register.title')}
                </div>
              </li>
            </ul>
            {isSignIn() && (
              <SignInForm
                setLoggedUser={setLoggedUser}
                preSignIn={preSignIn}
                postSignIn={postSignIn}
                apiUrl={apiUrl}
                t={t}
              />
            )}
            {isSignUp() && (
              <SignUpForm
                setLoggedUser={setLoggedUser}
                preSignUp={preSignUp}
                postSignUp={postSignUp}
                apiUrl={apiUrl}
                t={t}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
