import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import './App.scss';
import { connect } from 'react-redux';

const loading = () => <div style={{display: 'flex', justifyContent: 'center', marginTop: '15%'}}></div>

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Home = React.lazy(() => import('./views/Pages/Home'));
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

function onAuthRequired({history}) {
  history.push('/login');
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <BrowserRouter>

        <Security
            issuer='https://authenticate.logicioe.com/oauth2/aus220u93aWY3ABcN357'
            clientId='0oa1tsz7wdMfVB2Vv357'
            redirectUri={window.location.origin + '/implicit/callback'}
            onAuthRequired={onAuthRequired}
            pkce={true}
            scopes={['openid', 'email', 'profile', 'groups', 'phone', 'address']} >
            <React.Suspense fallback={loading()}>

              <Switch>

              	<Route exact path='/' render={props => <Home {...props}/>} />

              	<Route path='/implicit/callback' component={ImplicitCallback} />
              	<Route exact path="/login" name="Login Page" render={() => <Login
                  baseUrl='https://authenticate.logicioe.com'
                />} />

                <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
                <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
                <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />

                <SecureRoute path="/" name="Default Layout" render={props =>
                  <DefaultLayout
                    {...props }
                  />
                }/>

              </Switch>

            </React.Suspense>

          </Security>

      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
 ...state
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(App);
