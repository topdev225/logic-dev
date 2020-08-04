import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import {
  Card,
  CardContent,
} from '@material-ui/core';
import { SwapSpinner } from "react-spinners-kit";

import {
  Row
} from 'reactstrap';

import UserGroupsTable from './UserGroupsTable.js'

export default withAuth( class UserGroups extends Component{

  constructor(props) {
    super(props);
    this.state = { userInfo: {}
      };
    this.getUserGroups = this.getUserGroups.bind(this);
  }

  async componentDidMount(){
    const userInfo = await this.props.auth.getUser();
    this.getUserGroups(userInfo.customer_group);
    this.setState({
      userInfo: userInfo
    })
  }

  getUserGroups(customer_group, reload) {
    if(reload){
      this.setState({
        reload: false
      })
    }
    fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'okta_list_user_groups',
        customer_group: customer_group
      }
    })
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        group_data: json,
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
            { this.state.group_data && this.state.reload ?
              <UserGroupsTable
              group_data={this.state.group_data}
              refresh_groups={this.getUserGroups}
              customer_group={this.state.userInfo.customer_group}
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
