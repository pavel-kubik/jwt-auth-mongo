const bundle = {
  'components.authForm.username': 'Username',
  'components.authForm.email': 'Email',
  'components.authForm.emailInvalid': 'Email must be valid email.',
  'components.authForm.password': 'Password',
  'components.authForm.required': 'Required',
  'components.authForm.register': 'Register',
  'components.authForm.login': 'Login',
  'lib.auth.signIn.cantLogin':
    "Can't login. Please check your email and password.",
  'lib.auth.signUp.cantSignUp': "Can't sign up now. Please try it later.",
};
const defaultTranslator = (key: string, replaceValues = {}): string => {
  return bundle[key];
};

export default defaultTranslator;
