import bcrypt from 'bcryptjs-react';
import defaultTranslator from './defaultTranslator';

export const storeUserDataInLocalStorage = (userData) => {
  localStorage.setItem('_user', JSON.stringify(userData));
};

export const clearUserDataInLocalStorage = () => {
  localStorage.removeItem('_user');
};

export const getUserDataInLocalStorage = () => {
  return JSON.parse(localStorage.getItem('_user'));
};

export const signIn = async (
  email: string,
  password: string,
  setLoggedUser: Function,
  setSignInError: Function,
  storeUserData: Function,
  apiUrl: string = null,
  t: Function = defaultTranslator
) => {
  try {
    const saltUrl = apiUrl + '/.netlify/functions/sign_in_salt';
    const responseSalt = await fetch(saltUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    if (!responseSalt.ok) {
      console.log('Error read salt: ' + JSON.stringify(responseSalt));
      setSignInError(t('lib.auth.signIn.cantLogin'));
      return;
    }
    const { salt } = await responseSalt.json();
    const saltedPassword = await bcrypt.hash(password, salt);

    const signInUrl = apiUrl + '/.netlify/functions/sign_in';
    const response = await fetch(signInUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: saltedPassword,
      }),
    });
    if (response.status === 200) {
      const userData = await response.json();
      setLoggedUser(userData);
      if (storeUserData.constructor.name === 'AsyncFunction') {
        await storeUserData(userData);
      } else {
        storeUserData(userData);
      }
      return userData;
    } else {
      const data = await response.json();
      console.log('Error: ' + JSON.stringify(data));
      setSignInError(t('lib.auth.signIn.cantLogin'));
    }
  } catch (error) {
    console.log('Login error: ' + error);
    setSignInError(t('lib.auth.signIn.cantLogin'));
  }
};

export const signUp = async (
  username: string,
  email: string,
  password: string,
  setLoggedUser: Function,
  setLoginError: Function,
  storeUserData: Function,
  apiUrl: string = null,
  t: Function = defaultTranslator
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const saltedPassword = await bcrypt.hash(password, salt);
    const signUpUrl = apiUrl + '/.netlify/functions/sign_up';
    const response = await fetch(signUpUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: saltedPassword,
        salt: salt,
      }),
    });
    if (response.status === 200) {
      //const token = response.headers.get('x-access-token');
      const userData = await response.json();
      setLoggedUser(userData);
      if (storeUserData.constructor.name === 'AsyncFunction') {
        await storeUserData(userData);
      } else {
        storeUserData(userData);
      }
      return userData;
    } else {
      const data = await response.json();
      console.log('SignUp error: ' + JSON.stringify(data));
      if (data.errorCode) {
        setLoginError(t(data.errorCode));
      } else {
        setLoginError(t('lib.auth.signUp.cantSignUp'));
      }
    }
  } catch (error) {
    console.log('Signup error: ' + error);
    setLoginError(t('lib.auth.signUp.cantSignUp'));
  }
};

export const resetPassword = async (
  email: string,
  setResetError: Function,
  apiUrl: string = null,
  t: Function = defaultTranslator
) => {
  try {
    const resetUrl = apiUrl + '/.netlify/functions/reset';
    const response = await fetch(resetUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    if (response.status === 200) {
      return true;
    } else {
      const data = await response.json();
      console.log('Reset error: ' + JSON.stringify(data));
      if (data.errorCode) {
        setResetError(t(data.errorCode));
      } else {
        setResetError(t('global.emailNotFound'));
      }
    }
  } catch (error) {
    console.log('Reset error: ' + error);
    setResetError(t('lib.auth.reset.cantReset'));
  }
};

export const changePassword = async (
  email: string,
  resetCode: string,
  newPassword: string,
  setChangePasswordError: Function,
  apiUrl: string = null,
  t: Function = defaultTranslator
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const saltedPassword = await bcrypt.hash(newPassword, salt);
    const changePasswordUrl = apiUrl + '/.netlify/functions/change-password';
    const response = await fetch(changePasswordUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        resetCode: resetCode,
        newPassword: saltedPassword,
        salt: salt,
      }),
    });
    if (response.status === 200) {
      return true;
    } else {
      const data = await response.json();
      console.log('Change password error: ' + JSON.stringify(data));
      if (data.errorCode) {
        setChangePasswordError(t(data.errorCode));
      } else {
        setChangePasswordError(t('global.emailNotFound'));
      }
    }
  } catch (error) {
    console.log('Change password error: ' + error);
    setChangePasswordError(t('lib.auth.changePassword.cantChangePassword'));
  }
};
