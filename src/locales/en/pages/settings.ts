import { LocalePagesSettings } from '@/locales/type/pages/settings';

export const settings: LocalePagesSettings = {
  title: 'Settings',
  account: {
    accountInfomation: {
      title: 'Account Infomation',
      subtitle:
        'See information about your account, download an archive of your data, or learn about your account deactivation options',
    },
    deleteAccount: {
      title: 'Delete Account',
      subtitle:
        'Permanently delete your Sawamura account. Once deleted, the data is not recoverable.',
      form: {
        submit: 'Delete Account',
      },
      alerts: {
        deleteAlert: {
          message: 'Are you sure to delete your account?',
          deny: 'No',
          confirm: 'Yes',
        },
        deleteConfirm: {
          message: 'If you click agree, there is no way to go back!',
          cancel: 'Cancel',
          confirm: 'Agree',
        },
      },
    },
  },
  display: {
    themeMode: {
      title: 'Theme Mode',
      subtitle:
        'Manage your display mode. These settings affect all the Sawamura accounts on this browser.',
    },
    personalTheme: {
      title: 'Personal Theme',
      subtitle:
        'Manage your color, and background. These settings affect on this account only.',
      form: {
        select: { label: 'Select Source Color' },
        clear: { label: 'Clear' },
      },
    },
  },
  languages: {
    interfaceLanguage: {
      title: 'Interface Language',
      subtitle:
        'Select your preferred language for headlines, buttons, and other text from Sawamura.',
    },
  },
  email: {
    verifyEmail: {
      title: 'Verify Email',
      subtitle: {
        verified: 'Email: {0}',
        unverified:
          'You should confirm this {0} email to be able to experience all the features fully',
      },
      form: { submit: 'Send' },
    },
    changeEmail: {
      title: 'Change Email',
      subtitle:
        'Your current email is {0}. What would you like to update it to?',
      form: {
        email: {
          label: 'Current',
          hint: 'After you update your email address, a verification email will be sent to you',
        },
        submit: 'Submit',
      },
    },
    configureEmail: {
      title: 'Configure Email',
      subtitle:
        "Your account don't have an email yet. Would you like to configure it?",
      form: {
        email: { label: 'Email' },
      },
    },
  },
  password: {
    changePassword: {
      title: 'Change Password',
      subtitle:
        'Changing your password will log you out of all your active Sawamura sessions except the one you’re using at this time.',
      forgotPassword: 'Forgot password?',
      form: {
        currentPassword: { label: 'Current Password' },
        newPassword: { label: 'New Password' },
        confirmPassword: {
          label: 'Confirm Password',
          hint: 'Re-enter password',
        },
        submit: 'Change',
      },
    },
  },
  oauthProviders: {
    connectedAccounts: {
      title: 'Connected Accounts',
      subtitle:
        'These are the social accounts you connected to your Sawamura account to log in. You can enable or disable access here.',
      form: {
        link: 'Enable',
        unlink: 'Dsiable',
      },
      alerts: {
        unlink: {
          message: 'Do you want to unlink login provider {provider}',
          cancel: 'Cancel',
          confirm: 'Agree',
        },
      },
    },
  },
  shared: {
    menus: {
      account: 'Account',
      display: 'Display',
      languages: 'Languages',
      email: 'Email',
      password: 'Password',
      oauthProviders: 'Oauth Providers',
    },
  },
};
