export default {
  firstName: {
    presence: { allowEmpty: true, message: 'is not required' },
    length: {
      maximum: 32,
      minimum: 1
    }
  },
  lastName: {
    presence: { allowEmpty: true, message: 'is not required' },
    length: {
      maximum: 32,
      minimum: 1
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64,
      minimum: 1
    },
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128,
      minimum: 6
    }
  },
  isAdmin: {
    presence: { allowEmpty: true, message: 'is not required' },
    checked: true
  }
};