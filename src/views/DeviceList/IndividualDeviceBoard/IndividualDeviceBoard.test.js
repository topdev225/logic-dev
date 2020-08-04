import React from 'react';
import ReactDOM from 'react-dom';
import IndividualDeviceBoard from './IndividualDeviceBoard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IndividualDeviceBoard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
