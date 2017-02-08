var traineeApp = angular.module('traineeApp', [
  'restangular',
  'ui.router',
  'pascalprecht.translate',
  'LocalStorageModule',
  'valdr'
]);

var angularLocalStorage = function(localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('traineeApp');
};

traineeApp.config(angularLocalStorage);
var restangular = function(RestangularProvider) {
  RestangularProvider.setBaseUrl('http://localhost:3000');
};

traineeApp.config(restangular);
var router = function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/sign-in');

  $stateProvider
    .state('signIn', {
      url: '/sign-in',
      controller: 'signInCtrl',
      templateUrl: 'html/modules/sign-in.html'
    })
    .state('signUp', {
      url: '/sign-up',
      controller: 'signUpCtrl',
      templateUrl: 'html/modules/sign-up.html'
    })
    .state('verification', {
      url: '/verification',
      controller: 'verificationCtrl',
      templateUrl: 'html/modules/verification.html'
    });
};

traineeApp.config(router);
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

traineeApp.config(translator);
var validations = function(valdrProvider) {
  valdrProvider.addConstraints({
    user: {
      email: {
        required: {
          message: 'email is required'
        },
        email: {
          message: 'email address is not valid'
        }
      },
      name: {
        required: {
          message: 'name is required'
        }
      },
      code: {
        required: {
          message: ''
        },
        size: {
          min: 4,
          max: 4,
          message: 'validation code must contain 4 digits'
        },
        pattern: {
          value: /^\d{4}$/,
          message: 'validation code must be a number'
        }
      }
    }
  });
};

traineeApp.config(validations);
var partials = function($rootScope) {
  var base = 'html/components/';

  $rootScope.partials = {
    header: base.concat('header.html')
  };
};

traineeApp.run(partials);
var User = function(Restangular) {
  function Model(data) {
    for (var key in data) {
      this[key] = data[key];
    }
  };

  Model.prototype = {};

  Model.initAuth = function(token) {
    Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + token });
  }

  Model.signIn = function(user) {
    return Restangular
      .all('user-sign-in')
      .post(user)
      .then(function(data) {
        return data.plain();
      })
      .catch(function(error) {
        return error;
      });
  };

  Model.signUp = function(user) {
    return Restangular
      .all('user-sign-up')
      .post(user)
      .then(function(data) {
        return data.plain();
      })
      .catch(function(error) {
        return error;
      });
  };

  Model.resend = function(user) {
    return Restangular
      .all('user-sign-in')
      .post(user);
  };

  Model.verification = function(user) {
    return Restangular
      .all('user-verify')
      .post(user);
  };

  return (Model);
};

traineeApp.factory('User', User);
var signInCtrl = function($scope, $state, Restangular, User, localStorageService) {
  $scope.user = {
    email: '',
    firstName: ''
  };
  $scope.errorVisible = false;
  $scope.submitForm = function(form) {
    if (form.$valid) {
      User.signIn($scope.user)
        .then(function(response) {
          if (response.status > 0) {
            $scope.status = response.data.status;
          };
          localStorageService.set('currentUser', $scope.user);
          if (isNaN(response.status)) {
            $state.go('verification');
          };
        })
        .catch(function(error) {
          $scope.status = error;
        });
    };
  };
  $scope.showError = function() {
    $scope.errorVisible = true;
  };
  $scope.hideError = function() {
    $scope.errorVisible = false;
    $scope.status = '';
  };
};

traineeApp.controller('signInCtrl', signInCtrl);
var signUpCtrl = function($scope, $state, Restangular, User, localStorageService) {
  $scope.user = {
    email: '',
    firstName: ''
  };
  $scope.forms = {};
  $scope.errorVisible = false;
  $scope.submitForm = function(form) {
    if (form.$valid) {
      User.signUp($scope.user)
        .then(function(response) {
          $scope.status = response.data.status;
          if (response.status > 0) {
            $scope.status = response.data.status;
          };
          localStorageService.set('currentUser', $scope.user);
          if (isNaN(response.status)) {
            $state.go('verification');
          };
        })
        .catch(function(error) {
          $scope.status = error;
        });
    }
  };
  $scope.showError = function() {
    $scope.errorVisible = true;
  };
  $scope.hideError = function() {
    $scope.errorVisible = false;
    $scope.status = '';
  };
};

traineeApp.controller('signUpCtrl', signUpCtrl);
var verificationCtrl = function($scope, Restangular, localStorageService, User) {
  $scope.user = localStorageService.get('currentUser');
  $scope.status = '';
  $scope.errorVisible = false;

  $scope.submitForm = function(form) {
    if (form.$valid) {
      User.verification($scope.user)
        .then(function(serverEntity) {
          var token = serverEntity.token;
          localStorageService.set('token', token);
          User.initAuth(token);
        })
        .catch(function(error) {
          $scope.status = error.data.status;
        });
    }
  };
  $scope.resendCode = function() {
    User.resend({
        email: $scope.user.email
      })
      .then(function(data) {
        $scope.status = data.data.status;
      })
      .catch(function(error) {
        $scope.status = error.data.status;
      });
  };
  $scope.showError = function() {
    $scope.errorVisible = true;
  };
};

traineeApp.controller('verificationCtrl', verificationCtrl);
angular.element(document).ready(function() {
  angular.bootstrap(document, ['traineeApp']);
});
