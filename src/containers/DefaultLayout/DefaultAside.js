import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import * as moment from 'moment';
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';

const styles = theme => ({
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '10px',
    marginBottom: '1px',
    backgroundColor: 'rgb(10,34,62)',
    color: '#fff',
    borderLeft: `10px solid #e53935`,
    '&:hover': {
      backgroundColor: '#7FB4D6'
    },
  },
  headers: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: 'rgb(10,34,62)',
    color: '#fff',
  }
});

  class DefaultAside extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
    };
    this.build_alarms = this.build_alarms.bind(this)
    setInterval(() => this.build_alarms(), 30000);
    this.state = {
      device_alarms: [],
      service_alarms: []
    }
  }

  componentDidMount(){
    this.build_alarms();
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  async build_alarms() {

    let device_alarms = [];
    let service_alarms = [];

    // update data
    await this.props.fetchData();

    var cluster_length = Object.keys(this.props.organizations).length

    for(let i=0; i<cluster_length; i++){

      var host_length = this.props.organizations[Object.keys(this.props.organizations)[i]].host_data.length
      var service_length = this.props.organizations[Object.keys(this.props.organizations)[i]].service_data.length

      //for each host
      for(let host=0; host<host_length; host++){
         var host_object = this.props.organizations[Object.keys(this.props.organizations)[i]].host_data[host]

        if (host_object.attrs.state !== 0) {

          var unix_state_time = host_object.attrs.last_hard_state_change
          var datetime = new Date(host_object.attrs.last_hard_state_change * 1000)
          var state_time = moment(datetime).fromNow()
          var display_name = host_object.attrs.display_name
          var host_name = host_object.attrs.name

          device_alarms.push({
            device_name: display_name,
            cluster: this.props.cluster_list[i],
            device: host_name,
            state_time: unix_state_time,
            time_from: state_time
          })
        }
      }

      //for each service
      for(let service=0; service<service_length; service++){
         var service_object = this.props.organizations[Object.keys(this.props.organizations)[i]].service_data[service]

        if (service_object.attrs.state !== 0) {

          var service_unix_state_time = service_object.attrs.last_hard_state_change
          var service_datetime = new Date(service_object.attrs.last_hard_state_change * 1000)
          var service_state_time = moment(service_datetime).fromNow()

          var service_name = service_object.attrs.display_name
          var device_name = service_object.joins.host.display_name
          var service_host_name = service_object.joins.host.name
          var state = service_object.attrs.state

          service_alarms.push({
            device_name: device_name,
            cluster: this.props.cluster_list[i],
            device: service_host_name,
            service: service_name,
            state: state,
            state_time: service_unix_state_time,
            time_from: service_state_time
          })
        }
      }
    }

    // Sort the arrays
    device_alarms.sort((a,b) => (a.state_time < b.state_time) ? 1 :-1)
    service_alarms.sort((a,b) => (a.state_time < b.state_time) ? 1 :-1)

    this.setState({
      device_alarms: device_alarms,
      service_alarms: service_alarms
    })
  }

  render() {

    const { classes } = this.props;

    return (
      <React.Fragment >

            <List dense style={{ marginTop: '3px'}}>

              <Paper
                  square
                className={classes.headers}
              >
                  <h5>
                    Devices
                  </h5>
              </Paper>

              { this.props.organizations && this.state.device_alarms &&
              this.state.device_alarms.map(alarm => {

              return <Link
                        to={`/device-board?org=${alarm.cluster}&device=${alarm.device}`}
                        style={{textDecoration: 'none', color: '#000'}}
                      >
                      <Paper
                       square
                       style={{
                         borderLeft: `10px solid #e53935`
                       }}
                       className={classes.listItem}
                       >
                          <strong>{alarm.device_name} </strong>
                          <small>{alarm.time_from}</small>
                       </Paper>
                      </Link>
             })}

              <Paper
                  square
                  className={classes.headers}>
                  <h5>
                    Checks
                  </h5>
              </Paper>

              { this.props.organizations && this.state.service_alarms &&
              this.state.service_alarms.map(alarm => {

              let classAssociations = {
                "3": "#e53935",
                "2": "#e53935",
                "1": "#fdd835",
              }

              return <Link
                        to={`/device-board?org=${alarm.cluster}&device=${alarm.device}`}
                        style={{textDecoration: 'none', color: '#000'}}
                      >
                      <Paper
                        square
                        style={{
                          borderLeft: alarm.state ? `10px solid ${classAssociations[alarm.state]}`: `10px solid `
                        }}
                        className={classes.listItem}
                        >
                          <strong  style={{left: '0px'}} >{alarm.device_name}</strong>
                          <div style={{left: '0px', fontSize: '12px'}} >{alarm.service} </div>
                          <small style={{left: '0px'}}>
                            {alarm.time_from}
                          </small>
                       </Paper>
                      </Link>
              })}

            </List>

      </React.Fragment>
    );
  }
}


DefaultAside.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withAuth,
  withStyles(styles)
  )(DefaultAside);
