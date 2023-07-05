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
  'components.user.login.resetPassword': 'Did you forget your password?',
  'components.authForm.resetPassword': 'Send',
  'components.authForm.changePassword': 'Send',
  'components.authForm.resetCode': 'Reset Code',
  'components.authForm.newPassword': 'New Password',
  'lib.auth.changePassword.cantChangePassword': "Can't change password.",
  'lib.auth.reset.cantReset': "Can't reset password.",
  'global.signOut': 'Sign out',
  'global.emailNotFound': 'Email not found.',
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
