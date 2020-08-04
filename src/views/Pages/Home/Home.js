import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

export default withAuth(class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.LogOutAndGoToToLoginPage = this.LogOutAndGoToToLoginPage.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async LogOutAndGoToToLoginPage() {
    this.props.auth.logout('/home');
  }

  render() {
    if (this.state.authenticated === null) return null;

    const button = this.state.authenticated ?
      <button onClick={this.LogOutAndGoToToLoginPage}>Logout</button> :
      <button onClick={this.LogOutAndGoToToLoginPage}>Login</button>;

    return (
      <div>
        <Link to='/'>Home</Link><br/>
        <Link id="home" to='/home'>Protected</Link><br/>
        {button}
      </div>
    );
  }
});
