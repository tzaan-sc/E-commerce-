import React from 'react';
import './style.scss';

const FormGrid = ({ children, onChange }) => (
  <div className="form-grid" onChange={onChange}>
    {children}
  </div>
);

export default FormGrid;