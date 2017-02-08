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
