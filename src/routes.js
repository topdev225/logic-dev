import React from 'react';

const Home = React.lazy(() => import('./views/Home'));
const UserManagement = React.lazy(() => import('./views/UserManagement'));
const IndividualDeviceBoard = React.lazy(() => import('./views/DeviceList/IndividualDeviceBoard'));
const Inventory = React.lazy(() => import('./views/Inventory'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Profile = React.lazy(() => import('./views/UserManagement/Profile'));
const UserGroups = React.lazy(() => import('./views/UserManagement/UserGroups'));
const Reports = React.lazy(() => import('./views/Reports'));

const routes = [
  { path: '/', exact: true, name: 'Main' },
  { path: '/home', name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/device-board', exact: true, name: 'DeviceBoard', component: IndividualDeviceBoard },
  { path: '/inventory', name: 'Inventory', component: Inventory },
  { path: '/reports', name: 'Reports', component: Reports },
  { path: '/usermanagement', name: 'UserManagement', component: UserManagement },
  { path: '/usermanagement/profile', name: 'Profile', component: Profile },
  { path: '/usermanagement/user-groups', name: 'UserGroups', component: UserGroups },
];

export default routes;
