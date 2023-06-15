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
  setLoggedUser: Function = null,
  setSignInError: Function = null,
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
      storeUserDataInLocalStorage(userData);
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
  setLoggedUser: Function = null,
  setLoginError: Function = null,
  apiUrl: string = null,
  t: Function = defaultTranslator
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const saltedPassword = await bcrypt.hash(password, salt);
    const signUpUrl = apiUrl + '/.netlify/functions/sign_up';
    const response = await fetch(signUpUrl, {
      method: 'POST',
      mode: 'no-cors',
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
      storeUserDataInLocalStorage(userData);
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
