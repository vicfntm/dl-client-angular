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
