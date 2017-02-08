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
