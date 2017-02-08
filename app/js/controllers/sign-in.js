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
