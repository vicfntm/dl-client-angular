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
