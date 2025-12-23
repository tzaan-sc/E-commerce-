import React from 'react';
import './style.scss';

const ActionBar = ({ children }) => (
  <div className="action-bar">
    {children}
  </div>
);

export default ActionBar;