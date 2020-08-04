import React from 'react';
import ReactDOM from 'react-dom';
import Users from './UserGroups.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserGroups />, div);
  ReactDOM.unmountComponentAtNode(div);
});
