class User {
    constructor(firstName, lastName, email, password, confirmationToken, confirmed) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = password;
      this.confirmationToken = confirmationToken;
      this.confirmed = confirmed;
    }
  }
  
  module.exports = User;