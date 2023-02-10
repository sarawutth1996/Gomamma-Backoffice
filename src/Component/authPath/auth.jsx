class Auth {
  constructor() {
    try {
      const loadStore = JSON.parse(localStorage.getItem("cnf_us"));
      if (loadStore) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }
    } catch (error) {
      this.authenticated = false;
    }
  }

  login(callback) {
    this.authenticated = true;
    callback();
  }

  logout(callback) {
    localStorage.removeItem("cnf_us");
    this.authenticated = !this.authenticated;
    callback();
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
