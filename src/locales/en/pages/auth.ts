import { LocalePagesAuth } from '@/locales/type/pages/auth';

export const auth: LocalePagesAuth = {
  login: {
    title: 'Login',
    form: {
      username: { label: 'Username' },
      password: { label: 'Password' },
      submit: '@:pages.auth.login.title',
    },
    forgotPassword: 'Forget your {username} or {password}?',
    newTo: {
      text: 'New to my app? {0}',
      link: 'Register account.',
    },
  },
  register: {
    title: 'Register',
    form: {
      username: { label: 'Username' },
      displayName: { label: 'Display Name' },
      email: { label: 'Email' },
      password: { label: 'Password' },
      confirmPassword: {
        label: 'Confirm Password',
        hint: 'Re-enter password',
      },
      submit: 'Register',
    },
    hadAccount: {
      text: 'Already have a account? {0}',
      link: 'Login',
    },
  },
  forgotPassword: {
    title: 'Forgot Password',
    subtitle:
      "Tell us the username associated with your account, and we'll send you an email with a link to reset your password.",
    form: {
      username: { label: 'Username' },
      submit: 'Send',
    },
  },
  resetPassword: {
    title: 'Reset Password',
    subtitle: 'Reset your password.',
    form: {
      password: { label: 'Password' },
      confirmPassword: {
        label: 'Confirm Password',
        hint: 'Re-enter password',
      },
      submit: 'Reset',
    },
  },
  confirmEmail: {
    title: 'Confirm Email',
    subtitle:
      "Once you've clicked the confirm button, your email address will be confirmed.",
    form: {
      submit: 'Confirm',
    },
  },
  shared: {
    privacy:
      'By continuing, you are setting up account and agree to our User Agreement and Privacy Policy.',
    returnToLogin: 'Return to {0}.',
    usernameHint:
      'The username must start with an alphabet character and can only contain alphanumeric characters, underscores, and hyphens',
    passwordHint:
      "The password must be contain at least one upper case letter, one lower case letter, one digit, and one special character ({'@'} $ ! % * # ? &)",
  },
};
