import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Button,
  Typography
} from '@material-ui/core';
import MaterialTable from 'material-table';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import {
  Row
} from 'reactstrap';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));


export default function PermissionsForm(props){
  const [userGroupType, setUserGroupType] = React.useState('');
  const [user, setUser] = React.useState(null);
  const [group, setGroup] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);

  const classes = useStyles();

  // useEffect(() => {
  // }, []) // End of Use Effect

  const userGroupSwitch = (event) => {
    if(event.target.value === 'Users'){
      setGroup(null)
    } else {
      setUser(null)
    }
    setUserGroupType(event.target.value)
  }

  // const groupSelected = (event) => {
  //   setGroup(event.target.value)
  // }

  const userSelected = (event) => {
    let user_selected_list = []
    user_selected_list.push(event.target.value)
    props.refresh_permissions(user_selected_list)
    setUser(event.target.value)
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }


  const resetForm = (event) => {
      setGroup(null)
      setUser(null)
  }

  function createData(props) {
    if(props.permissions){
      for(let i=0; i<props.permissions.hostgroups_permissions.length; i++){
        data.push(props.permissions.hostgroups_permissions[i])
      }
    } else {
      data.push({cluster_name: 'Loading', group_name: 'Loading', read_value: false, write_value: false})
    }
  }

  const data = [];

  createData(props);

  return (
    <div className="animated fadeIn">
    <Row style={{ padding: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <Card style={{height: '100%', width: window.innerWidth < 930 ? '100%' : '70%', padding: '15px' }}
      raised={true}>
      <form>
      <Grid container alignItems="flex-start" justify="space-around" spacing={2}>
        <Grid item xs={12}  lg={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="select-userGroupType-label">SET PERMISSIONS FOR </InputLabel>
              <Select
                name="userGroupType"
                labelId="select-userGroupType-label"
                value={userGroupType || ''}
                onChange={userGroupSwitch}
              >
                <MenuItem value="Users">Users</MenuItem>
                <MenuItem value="Groups">Groups</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          { userGroupType === 'Users' &&
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="select-userList-label">SELECT USER </InputLabel>
              <Select
                name="userList"
                labelId="select-userList-label"
                value={user || ''}
                onChange={userSelected}
              >
              { props.user_list.map((user) =>
                <MenuItem value={user.id}>{user.display_name}</MenuItem>
              )}
              </Select>
            </FormControl>
          </Grid>
        }
          { userGroupType === 'Groups' &&
          <Grid item xs={8}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '..', height: '..'}}>FEATURE COMING SOON</div>
            {/*// <FormControl fullWidth>
            //   <InputLabel htmlFor="select-groupList-label">Select Group </InputLabel>
            //   <Select
            //     name="groupList"
            //     labelId="select-groupList-label"
            //     value={group || ''}
            //     onChange={groupSelected}
            //   >
            //   { props.group_list.map((group) =>
            //     <MenuItem value={group.name}> {group.name}</MenuItem>
            //   )}
            //   </Select>
            // </FormControl> */}
          </Grid>
        }
        </Grid>
        </form>
      </Card>
    </Row>
    { ((user || group ) && props.permissions) &&
    <Row style={{ padding: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <Card style={{width: window.innerWidth < 930 ? '100%' : '70%', padding: '0px', maxHeight: '700px', overflowY: 'scroll' }}
      raised={true} >
      <CardHeader
      title='PERMISSIONS OVERVIEW'
      subheader='Access options'/>
        <CardContent>
          <form
          autoComplete="true">
              <ExpansionPanel expanded={expanded === 'hostGroups'}
              onChange={handleChange('hostGroups')}
              style={{width: '100%', marginBottom: '30px'}}>
                <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="hostGroupsbh-content"
                        id="hostGroupsbh-header"
                        style={{padding: '0px'}}
                      >
                        <Typography className={classes.heading}>DEVICE GROUPS</Typography>
                        <Typography className={classes.secondaryHeading}>Click to Expand</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{width: '100%', padding: '0px'}}>
                <div style={{width: '100%', maxHeight: '500px', overflowY: 'scroll'}}>
                <MaterialTable
                  columns={[
                    { title: 'SITE', field: 'cluster_name', defaultGroupOrder: 0 },
                    { title: 'GROUP NAME', field: 'group_name' },
                    { title: 'READ', field: 'read_value',
                      render: rowData => (
                        <Switch checked={rowData.read_value}
                          onChange={(e) => props.handleSwitchChanges({field: 'read_value', cluster: rowData.cluster_name, group: rowData.group_name, current_value: rowData.read_value })}
                          name="read_value"
                          color="primary" />

                      )},
                    { title: 'WRITE', field: 'write_value',
                      render: rowData => (
                      <Switch checked={rowData.write_value}
                        onChange={(e) => props.handleSwitchChanges({field: 'write_value', cluster: rowData.cluster_name, group: rowData.group_name, current_value: rowData.write_value })}
                        name="write_value"
                        color="secondary" />

                    )}
                  ]}
                  data={data}
                  components={{
                    Groupbar: props => (
                      <div></div>
                    )
                  }}
                  options={{
                    sorting: true,
                    paging: false,
                    search: true,
                    showTitle: false,
                    toolbar: true,
                    grouping: true,
                    headerStyle: {
                      backgroundColor: '#3667A6',
                      color: '#FFF',
                      fontWeight: "bold"
                    }
                  }}
                  />
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <Grid container alignItems="flex-start" spacing={2} style={{ paddingTop: '5px'}}>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="select-account_settings-label">ACCOUNT SETTINGS</InputLabel>
                  <Select
                    fullWidth
                    name="account_settings"
                    type="string"
                    labelId="select-account_settings-label"
                    value={props.permissions.account_settings || ''}
                    onChange={props.handleOktaChanges}
                  >
                    <MenuItem value='Blocked'> Blocked</MenuItem>
                    <MenuItem value='Read'> Read</MenuItem>
                    <MenuItem value='Configure'> Configure</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="select-system_settings-label">SYSTEM SETTINGS</InputLabel>
                  <Select
                    fullWidth
                    name="system_settings"
                    type="string"
                    labelId="select-system_settings-label"
                    value={props.permissions.system_settings || ''}
                    onChange={props.handleOktaChanges}
                  >
                    <MenuItem value='Blocked'> Blocked</MenuItem>
                    <MenuItem value='Read'> Read</MenuItem>
                    <MenuItem value='Configure'> Configure</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="select-custom_boards-label">CUSTOM BOARDS</InputLabel>
                  <Select
                    fullWidth
                    name="custom_boards"
                    type="string"
                    labelId="select-custom_boards-label"
                    value={props.permissions.custom_boards || ''}
                    onChange={props.handleOktaChanges}
                  >
                    <MenuItem value='Blocked'> Blocked</MenuItem>
                    <MenuItem value='Read'> Read</MenuItem>
                    <MenuItem value='Configure'> Configure</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="select-reports-label">REPORTS</InputLabel>
                  <Select
                    fullWidth
                    name="reports"
                    type="string"
                    labelId="select-reports-label"
                    value={props.permissions.reports || ''}
                    onChange={props.handleOktaChanges}
                  >
                    <MenuItem value='Blocked'> Blocked</MenuItem>
                    <MenuItem value='Read'> Read</MenuItem>
                    <MenuItem value='Configure'> Configure</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="select-inventory_permissions-label">INVENTORY</InputLabel>
                  <Select
                    fullWidth
                    name="inventory_permissions"
                    type="string"
                    labelId="select-inventory_permissions-label"
                    value={props.permissions.inventory_permissions || ''}
                    onChange={props.handleOktaChanges}
                  >
                    <MenuItem value='Blocked'> Blocked</MenuItem>
                    <MenuItem value='Read'> Read</MenuItem>
                    <MenuItem value='Configure'> Configure</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            <Grid item style={{ marginTop: 16 }} xs={12} md={12} sm={12} lg={12}>
              <Button
                style={{marginRight: '10px'}}
                type="button"
                variant="contained"
                onClick={resetForm}
                disabled={props.unchanged}
              >
                Reset
              </Button>
              <Button
                style={{marginRight: '10px'}}
                variant="contained"
                color="primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  props.updatePermissions(user)
                }}
                disabled={props.unchanged}
              >
                Submit
              </Button>
              </Grid>
          </Grid>
          </form>
        </CardContent>
      </Card>
      </Row>
    }
      </div>
  )
}
