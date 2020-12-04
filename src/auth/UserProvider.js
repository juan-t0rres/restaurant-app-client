import React, { Component, createContext } from "react";
import jwt_decode from "jwt-decode";

export const UserContext = createContext({ user: null });
class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.setUser = this.setUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.logOut = this.logOut.bind(this);

    const token = localStorage.getItem("token");
    const user = token
      ? this.getUser(token)
      : {
          loggedIn: false,
          setUser: (token) => {
            this.setUser(token);
          },
        };

    this.state = {
      user,
    };
  }

  getUser(token) {
    const decoded = jwt_decode(token);
    const user = {
      name: decoded.name,
      isEmployee: decoded.isEmployee,
      id: decoded.id,
      loggedIn: true,
      logOut: () => this.logOut(),
    };
    return user;
  }

  setUser(token) {
    const user = this.getUser(token);
    this.setState({ user });
    localStorage.setItem("token", token);
    window.location = "/";
  }

  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    window.location = "/";
  }

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
