import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import UsersTable from './UsersTable.js'
import {
  Card,
  CardContent,
} from '@material-ui/core';
import { SwapSpinner } from "react-spinners-kit";

import {
  Row
} from 'reactstrap';

export default withAuth( class Users extends Component{

  constructor(props) {
    super(props);
    this.state = { userInfo: {}
      };
    this.getOktaUsers = this.getOktaUsers.bind(this);
  }

  async componentDidMount(){
    const userInfo = await this.props.auth.getUser();
    this.getOktaUsers(userInfo.customer_group);
    this.setState({
      userInfo: userInfo
    })
  }

  getOktaUsers(customer_group, reload) {
    if(reload){
      this.setState({
        reload: false
      })
    }
    fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'okta_users',
        group: customer_group
      }
    })
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        user_list: json,
        reload: true
      })
    })

  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Card style={{maxHeight: '725px', width: '100%', overflowY: 'scroll'}}
          raised={true}>
            <CardContent>
            { this.state.user_list && this.state.reload ?
              <UsersTable
              user_list={this.state.user_list}
              customer_group={this.state.userInfo.customer_group}
              cluster_access={this.state.userInfo.cluster_access}
              refresh_users={this.getOktaUsers}
              />
              :
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
                <SwapSpinner
                  size={75}
                  color="rgb(242,97,39)"
                  loading={true}
                />
              </div>
            }
            </CardContent>
          </Card>
        </Row>
      </div>
    )
  }

})
