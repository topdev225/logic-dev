import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box
} from '@material-ui/core';
import {
  AccountBox,
  RecentActors,
  Group,
  Security
} from '@material-ui/icons';

import Profile from './Profile/Profile.js';
import Users from './Users/Users.js';
import UserGroups from './UserGroups/UserGroups.js';
import Permissions from './Permissions/Permissions.js'


function UserManagementTabs(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

UserManagementTabs.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ScrollableTabsButtonForce(props) {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs"
          centered
        >
          <Tab label="Profile" icon={<AccountBox />} {...a11yProps(0)} />
          <Tab label="Users" icon={<RecentActors />} {...a11yProps(1)} />
          <Tab label="Groups" icon={<Group />} {...a11yProps(2)} />
          <Tab label="Permissions" icon={<Security />} {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <UserManagementTabs value={value} index={0}>
        <Profile />
      </UserManagementTabs>
      <UserManagementTabs value={value} index={1}>
        <Users />
      </UserManagementTabs>
      <UserManagementTabs value={value} index={2}>
        <UserGroups />
      </UserManagementTabs>
      <UserManagementTabs value={value} index={3}>
        <Permissions />
      </UserManagementTabs>
    </div>
  );
}
