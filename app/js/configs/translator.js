var translator = function($translateProvider) {
  $translateProvider.translations('en', {
    HEADER: {
      TITLE_PREFIX: 'Dialtone',
      TITLE_SUFFIX: 'labs',
      SIGN_IN: 'Sign In',
      SIGN_UP: 'Sign Up',
    },
    SIGN_IN: {
      TITLE: 'Log In',
      TO_SIGN_UP: 'Sign Up',
      EMAIL: 'Email address',
      PASSWORD: 'Password...',
      SUBMIT: 'Next',
      NAME: 'Name'
    },
    SIGN_UP: {
      TITLE: 'Sign Up',
      TO_SIGN_IN: 'Log In',
      EMAIL: 'Email address',
      PASSWORD: 'Password...',
      SUBMIT: 'Next',
      NAME: 'Name'
    },
    VERIFICATION: {
      TITLE: 'Verification',
      TO_SIGN_UP: 'Sign Up',
      LOGIN: 'Log In',
      CANCEL: 'Cancel',
      EMAIL: 'Email address',
      CODE: 'Your verification code...',
      DESCRIPTION: 'Please, verify your email so you can avoid having a password when logging into our app. We sent code to your email',
      RESEND: 'Resend code',
      SUBMIT: 'Next',
      NAME: 'Name'
    }

  });

  $translateProvider.preferredLanguage('en');

  // moment.updateLocale('', {});
};
