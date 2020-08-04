import React from 'react';
import ReactDOM from 'react-dom';
import Users from './Users.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Users />, div);
  ReactDOM.unmountComponentAtNode(div);
});
