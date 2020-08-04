import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import PermissionsForm from './PermissionsForm.js'


export default withAuth( class Permissions extends Component {

  constructor(props) {
    super(props);
    this.state = { userInfo: {},
                    unchanged: true,
                  };
                  this.handleOktaChanges = this.handleOktaChanges.bind(this)
                  this.updatePermissions = this.updatePermissions.bind(this)
                  this.handleSwitchChanges = this.handleSwitchChanges.bind(this)
                  this.getPermissions = this.getPermissions.bind(this)

  }


  async componentDidMount(){
    const userInfo = await this.props.auth.getUser();
    this.getUserGroupData(userInfo.customer_group);
    this.setState({
      userInfo: userInfo
    })
}

async getUserGroupData(customer_group, reload){
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
      user_list: json.customer_users,
      group_list: json.groups,
      reload: true
    })
  })
}

getPermissions = async (user_list, reload) => {
  if(reload){
    this.setState({
      reload: false
    })
  }
  await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
    headers: {
      function: 'okta_get_permissions',
      user_list: user_list
    }
  })
  .then((res) => res.json())
  .then((json) => {
    this.setState({
      permissions: json,
      reload: true
    })
  })
}

updatePermissions(user_list){

  fetch(`${process.env.REACT_APP_FETCH_URL}`,{
    headers: {
      function: 'okta_update_permissions',
      user_list: user_list,
      permissions: JSON.stringify(this.state.permissions)
    }
  })
  .then((res) => {
    this.setState({
      unchanged: true
    })
  }).catch((err) =>{

  })
}

handleSwitchChanges(rowData){

  if(rowData.current_value === false){
    let permissionsTemp = this.state.permissions
    let field = rowData.field
    let hostgroupIndex = this.state.permissions.hostgroups_permissions.findIndex(i => i.group_name === rowData.group && i.cluster_name === rowData.cluster)
    permissionsTemp.hostgroups_permissions[hostgroupIndex][field] = true
    this.setState({
      permissions: permissionsTemp,
      unchanged: false
    })
  } else {
    let permissionsTemp = this.state.permissions
    let field = rowData.field
    let hostgroupIndex = this.state.permissions.hostgroups_permissions.findIndex(i => i.group_name === rowData.group && i.cluster_name === rowData.cluster)
    permissionsTemp.hostgroups_permissions[hostgroupIndex][field] = false
    this.setState({
      permissions: permissionsTemp,
      unchanged: false
    })
  }
}


handleOktaChanges(event){
  let permissionsTemp = this.state.permissions
  permissionsTemp[event.target.name] = event.target.value
  this.setState({
    permissions: permissionsTemp,
    unchanged: false
  })
}



  render() {
    return (
      <div>
      { (this.state.user_list && this.state.group_list) &&
      <PermissionsForm
        user_list={this.state.user_list}
        group_list={this.state.group_list}
        permissions={this.state.permissions}
        unchanged={this.state.unchanged}
        refresh_permissions={this.getPermissions}
        refresh_data={this.getUserGroupData}
        handleOktaChanges={this.handleOktaChanges}
        updatePermissions={this.updatePermissions}
        handleSwitchChanges={this.handleSwitchChanges}
        />
      }
      </div>
    );
  }
})
