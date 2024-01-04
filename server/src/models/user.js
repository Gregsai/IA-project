class User {
    constructor(firstName, lastName, email, password, confirmed, role) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = password;
      this.confirmed = confirmed;
      this.role = role;
    }
  }
  
  module.exports = User;