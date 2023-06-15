const bundle = {
  'components.authForm.username': 'Username',
  'components.authForm.email': 'Email',
  'components.authForm.emailInvalid': 'Email must be valid email.',
  'components.authForm.password': 'Password',
  'components.authForm.required': 'Required',
  'components.authForm.register': 'Register',
  'components.authForm.login': 'Login',
  'components.authForm.welcome': 'Welcome {{username}}!',
  'lib.auth.signIn.cantLogin':
    "Can't login. Please check your email and password.",
  'lib.auth.signUp.cantSignUp': "Can't sign up now. Please try it later.",
  'global.signOut': 'Sign out',
};

const defaultTranslator = (key, replaceValues = {}) => {
  const message = bundle[key];

  if (!message) {
    console.warn(`[TRAN] Translated key ${key} not found.`);
    return '';
  }

  // Replace inserted keys by their values
  return Object.keys(replaceValues).reduce(
    (editedMessage, currentKey) =>
      editedMessage.replace(`{{${currentKey}}}`, replaceValues[currentKey]),
    message
  );
};

export default defaultTranslator;
