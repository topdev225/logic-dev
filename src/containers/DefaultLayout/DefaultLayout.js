import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
// import Redirect from 'react-router-dom';
import * as router from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import allActions from '../../redux/actions'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { omit } from 'lodash';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import {
  AppAside,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

import { RotateSpinner } from "react-spinners-kit";

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));


const theme = createMuiTheme({
  palette: {
    primary: { main: 'rgb(10,34,62)' },
    secondary: { main: 'rgb(242,97,39)' },
  },
  status: {
    danger: 'orange',
  },
});



class DefaultLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: {
        startDate: new Date(),
        endDate: new Date(),
      },
      dashboardDate: {
        startDate: new Date(),
        endDate: new Date(),
      },
      data: [],
      organizations: {},
      cluster_list: [],
      organizationDisplayNames: [],
      directorOrgs: [],
      endpoint: {},
      fetchNum: 0,
      cluster_access_length: 1,
    };
    this.fetchData = this.fetchData.bind(this)
    this.get_clusters()
  }

  loading = () => <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15%', marginLeft: '700px' }}></div>

  setOrgsInState = (organizations, organizationDisplayNames) => {
    this.setState(
      {
        organizations: organizations,
        organizationDisplayNames: organizationDisplayNames
      }
    )
  }

  setClusterListInState = (cluster_list) => {
    this.setState(
      {
        cluster_list: cluster_list
      }
    )
  }

  signOut(e) {
    e.preventDefault()
    this.props.auth.logout()
  }

  goToProfile(e) {
    e.preventDefault()
    window.location = window.location.origin + '/usermanagement/profile'

  }

  setDate = (dateObj) => {
    this.setState({
      date: {
        startDate: dateObj.selection.startDate,
        endDate: dateObj.selection.endDate
      }
    })
  }



  setDashboardDate = (dateObj) => {
    this.setState({
      dashboardDate: {
        startDate: dateObj.selection.startDate,
        endDate: dateObj.selection.endDate
      }
    })
    //Add callback functionality here
  }





  // just get the cluster names, returns array i.e [ dev, manassasmall ]
  async get_clusters() {
    let userInfo = await this.props.auth.getUser()
    let clusters = userInfo.cluster_access
    let cluster_list = [...this.state.cluster_list]
    for (let i = 0; i < clusters.length; i++) {
      cluster_list.push(clusters[i])
    }
    this.setClusterListInState(cluster_list)
  }




  // Sets the initial organizations prop. Contains host and server data for all accessable clusters.
  async fetchData() {

    let userInfo = await this.props.auth.getUser()

    let userEmail = userInfo.email
    let clusterAccessJoined = userInfo.cluster_access.map(org =>
      org.split(' ').join('').toLowerCase()
    )

    this.setState({
      cluster_access_length: userInfo.cluster_access.length,
      clusterAccessJoined: clusterAccessJoined,
      userEmail: userEmail,
      organizationDisplayNames: []
    })

    let allHosts = []

    for (let i = 0; i < clusterAccessJoined.length; i++) {
      await fetch(`${process.env.REACT_APP_FETCH_URL}`, {
        headers: {
          function: 'data',
          organization: clusterAccessJoined[i],
        }
      })
        .then((res) => res.json())
        .then((json) => {

          if (!!Object.keys(json).length) {

            allHosts.push(json.data.results)

            let currentOrg = json.organization

            let organizations = { ...this.state.organizations }
            organizations[currentOrg] = json.data

            let organizationDisplayNames = [...this.state.organizationDisplayNames]
            organizationDisplayNames.push(currentOrg)

            this.setOrgsInState(organizations, organizationDisplayNames)

          } else {
            return
          }
        })
    }

    this.setState({
      orgslength: Object.keys(this.state.organizations).length,
      fetchNum: this.state.fetchNum + 1
    })

  }


  Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }





  render() {
    console.log('www',this.state)

    return (
      <MuiThemeProvider theme={theme}>

        <div className="app">
          <AppHeader fixed style={{ backgroundColor: '#fff', height: '65px' }}>
            <Suspense fallback={this.loading()}>
              <DefaultHeader
                onLogout={e => this.signOut(e)}
                profile={e => this.goToProfile(e)}
                date={this.state.date}
                setdate={this.setDate}
              />
            </Suspense>
          </AppHeader>


          <div className="app-body">

            <AppSidebar style={{ height: `${window.innerHeight - 60}px`, marginTop: '11px', backgroundColor: '#1D2229' }} fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                <AppSidebarNav style={{ color: '#1D2229' }} navConfig={navigation} {...omit(this.props, ['dispatch'])} router={router} />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>

            <main style={{ backgroundColor: '#e4e7ea', marginTop: '12px' }} className="main">

              <Suspense fallback={this.loading()}>
                <Switch>
                  {
                    (!!this.state.cluster_list.length && (this.state.cluster_list.length === Object.keys(this.state.organizations).length)) ?

                      routes.map((route, idx) => {

                        return route.component ? (
                          <Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            render={props => (
                              <route.component {...props}
                                clusteraccessjoined={this.state.clusterAccessJoined}
                                cluster_list={this.state.cluster_list}
                                date={this.state.date}
                                dashboarddate={this.state.dashboardDate}
                                hostgroupsstatus={this.state.hostgroupsstatus}
                                mspdate={this.state.mspDate}
                                organizations={this.state.organizations}
                                organizationdisplaynames={this.state.organizationDisplayNames}
                                orgslength={this.state.orgslength}
                                setdashboarddate={this.setDashboardDate}
                                setdatainstate={this.setDataInState}
                                setdate={this.setDate}
                                setmspdate={this.setMSPDate}
                                slaData={this.state.slaData}
                                state={this.state}
                                useremail={this.state.userEmail}
                                fetchnum={this.state.fetchNum}
                                fetchdata={this.fetchData}
                                searchedquery={props.location.search}
                              />
                            )} />
                        ) : (null);
                      })

                      :

                      <div style={{ height: `${window.innerHeight - 300}px` }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15%' }}>
                          <RotateSpinner
                            size={350}
                            color="rgb(242,97,39)"
                            loading={true}
                          />
                        </div>
                      </div>


                  }
                  {/*<Redirect from="/" to="/home" />*/}
                </Switch>
              </Suspense>

            </main>

            <AppAside style={{ overflowY: 'scroll' }} fixed>
              <Suspense fallback={this.loading()}>
                <DefaultAside
                  cluster_list={this.state.cluster_list}
                  organizations={this.state.organizations}
                  fetchData={this.fetchData}
                />
              </Suspense>
            </AppAside>
          </div>


          <Snackbar
            autoHideDuration={5000}
            style={{ width: '50%' }}
            anchorOrigin={{ vertical: this.props.alert.vertical, horizontal: this.props.alert.horizontal }}
            key={`${this.props.alert.vertical},${this.props.alert.horizontal}`}
            open={this.props.alert.alertOpen}
            onClose={() => this.props.dispatch(allActions.appActions.closeAlert())}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
          >
            <this.Alert onClose={() => this.props.dispatch(allActions.appActions.closeAlert())} severity={this.props.alert.severity}>
              {this.props.alert.alertContent}
            </this.Alert>
          </Snackbar>

        </div>

      </MuiThemeProvider>

    );
  }
}


const mapStateToProps = (state) => {
  return {
    alert: state.snackbarAlert,
  };
};


export default compose(
  withAuth,
  connect(
    mapStateToProps,
    null,
  ),
)(DefaultLayout);
