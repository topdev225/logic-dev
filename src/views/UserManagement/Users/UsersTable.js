import React from 'react';
import * as moment from 'moment';
import MaterialTable from 'material-table';
import UserEditor from './UserEditor.js';
import UserRemove from './UserRemove.js';


export default function UsersTable(props) {

  const [openProfile, setOpenProfile] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [newProfile, setNewProfile] = React.useState(false);
  const [rowData, setRowData] = React.useState({
              id: '',
              cluster_access: [...props.cluster_access],
              email: '',
              given_name: '',
              family_name: '',
              status: '',
              last_login: '',
              organization: '',
              streetAddress: '',
              state: '',
              city: '',
              zipCode: '',
              mobilePhone: '',
              mobileCarrier: '',
              password: '',
              repassword: ''
            })

  const handleClose = () => {
    setRowData({id: '',
                cluster_access: [...props.cluster_access],
                email: '',
                given_name: '',
                family_name: '',
                status: '',
                last_login: '',
                organization: '',
                streetAddress: '',
                state: '',
                city: '',
                zipCode: '',
                mobilePhone: '',
                mobileCarrier: '',
                password: '',
                repassword: ''
              })
    setOpenProfile(false);
    setOpenDelete(false);
    setNewProfile(false);
  };

  function createData(props) {
    for(let i=0; i<props.user_list.users.length; i++ ){
      var id = props.user_list.users[i].id
      var email = props.user_list.users[i].profile.email
      var given_name = props.user_list.users[i].profile.firstName
      var family_name = props.user_list.users[i].profile.lastName
      var status = props.user_list.users[i].status
      var last_login = props.user_list.users[i].last_login
      var organization = props.user_list.users[i].profile.organization
      var streetAddress = props.user_list.users[i].profile.streetAddress
      var state = props.user_list.users[i].profile.state
      var city = props.user_list.users[i].profile.city
      var zipCode = props.user_list.users[i].profile.zipCode
      var mobilePhone = props.user_list.users[i].profile.mobilePhone
      var mobileCarrier = props.user_list.users[i].profile.mobileCarrier
      if(props.user_list.users[i].profile.cluster_access !== undefined ){
        if(props.user_list.users[i].profile.cluster_access.length === 1){
          var cluster_access = props.user_list.users[i].profile.cluster_access
        } else {
          cluster_access =  [...props.user_list.users[i].profile.cluster_access]
        }
      }

      last_login = moment(new Date(last_login)).format('MMM DD, YYYY HH:MM')
      if(last_login === 'Dec 31, 1969 16:12'){
        last_login = 'N/A'
      }

      data.push({ id: id,
                  cluster_access: [...cluster_access],
                  email: email,
                  given_name: given_name,
                  family_name: family_name,
                  status: status,
                  last_login: last_login,
                  organization: organization,
                  streetAddress: streetAddress,
                  state: state,
                  city: city,
                  zipCode: zipCode,
                  mobilePhone: mobilePhone,
                  mobileCarrier: mobileCarrier
                })
    }
  }

  const data = [];

  createData(props);


  return (
    <div>
      <MaterialTable
        title='Users'
        columns={[
          { title: 'FIRST NAME', field: 'given_name' },
          { title: 'LAST NAME', field: 'family_name' },
          { title: 'STATUS', field: 'status' },
          { title: 'LAST LOGIN', field: 'last_login' },
        ]}
        data={data}
        options={{
          sorting: true,
          paging: true,
          search: true,
          showTitle: false,
          toolbar: true,
          exportButton: true,
          pageSize: 10,
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
            setOpenProfile(true)
            }
          },
          {
          icon: 'delete',
          tooltip: 'Delete User',
          onClick: (event, rowData) =>{
            setRowData(rowData)
            setOpenDelete(true)
            }
          },
          {
            icon: 'add',
            tooltip: 'Add User',
            isFreeAction: true,
            onClick: (event) => {
              setRowData(rowData)
              setOpenProfile(true)
              setNewProfile(true)
              }
          }
        ]}
        />

        <UserEditor
          open={openProfile}
          new_profile={newProfile}
          row_data={rowData}
          onClose={handleClose}
          refresh_users={props.refresh_users}
          customer_group={props.customer_group}
          cluster_access={props.cluster_access}
          aria-labelledby="responsive-dialog-title"/>

        <UserRemove
          open={openDelete}
          row_data={rowData}
          onClose={handleClose}
          refresh_users={props.refresh_users}
          customer_group={props.customer_group}
          cluster_access={props.cluster_access}
          aria-labelledby="responsive-dialog-title"/>

      </div>

  );
}
