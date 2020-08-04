import React from 'react';
import {
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import MaterialTable from 'material-table';
import UserGroupsEditor from './UserGroupsEditor.js'
import UserGroupsRemove from './UserGroupsRemove.js'

export default function UserGroupsTable(props){

  const [openGroup, setOpenGroup] = React.useState(false);
  const [newGroup, setNewGroup] = React.useState(false);
  const [rowData, setRowData] = React.useState({
    group_name: '',
    group_users: [],
    group_ids: []
  })
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClose = () => {
    setRowData({
        group_name: '',
        group_users: [],
        group_ids: []})
    setNewGroup(false);
    setOpenGroup(false);
    setOpenDelete(false);

  };

  function createData(props) {

    if(props.group_data.groups[0].name === undefined){

    } else {
        for(let i=0; i<props.group_data.groups.length; i++ ){
          var group_name = props.group_data.groups[i].name
          // var group_users = []
          // group_users.push(props.group_data.groups[i].users)
          var user_json = props.group_data.groups[i].users

          var group_users = []
          var group_ids = []

          if(user_json.length === 0 ){
            data.push({ group_name: group_name, group_users: group_users, group_ids: group_ids})
          } else {
            for(let user_counter=0; user_counter<user_json.length; user_counter++){
              group_users.push(props.group_data.groups[i].users[user_counter].display_name)
              group_ids.push(props.group_data.groups[i].users[user_counter].id)
            }
            data.push({ group_name: group_name, group_users: group_users, group_ids: group_ids })
          }
        }
      }
  }

  const data = [];

  createData(props);

  return (
    <div>
    <MaterialTable
      columns={[
        { title: 'Group Name', field: 'group_name' }
      ]}
      data={data}
      detailPanel={[
        {
          tooltip: 'List Users',
          render: rowData => {
            return (
              <List>
              { rowData.group_users.map((user) =>
                <ListItem >
                  <ListItemText primary={user} />
                </ListItem >
              )}
              </List>
            )
          }
        }
      ]}
      options={{
        sorting: true,
        paging: true,
        search: true,
        showTitle: false,
        toolbar: true,
        headerStyle: {
          backgroundColor: '#3667A6',
          color: '#FFF',
          fontWeight: "bold"
        }
      }}
      actions={[
        {
        icon: 'search',
        tooltip: 'Profile',
        onClick: (event, rowData) =>{
          setRowData(rowData)
          setOpenGroup(true)
          }
        },
        {
        icon: 'delete',
        tooltip: 'Delete Group',
        onClick: (event, rowData) =>{
          setRowData(rowData)
          setOpenDelete(true)
          }
        },
        {
          icon: 'add',
          tooltip: 'Add Group',
          isFreeAction: true,
          onClick: (event) => {
            setRowData(rowData)
            setOpenGroup(true)
            setNewGroup(true)
            }
        }
      ]}
      />

      <UserGroupsEditor
        open={openGroup}
        new_group={newGroup}
        row_data={rowData}
        onClose={handleClose}
        refresh_groups={props.refresh_groups}
        customer_group={props.customer_group}
        user_list={props.group_data.customer_users}
        aria-labelledby="responsive-dialog-title"/>

      <UserGroupsRemove
        open={openDelete}
        row_data={rowData}
        onClose={handleClose}
        refresh_groups={props.refresh_groups}
        customer_group={props.customer_group}
        aria-labelledby="responsive-dialog-title"/>

    </div>
  )
}
