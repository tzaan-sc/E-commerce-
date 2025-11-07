import React from 'react';
import './style.scss';

const FormGroup = ({ 
  label, 
  type = 'text', 
  defaultValue, 
  placeholder, 
  options,
  name,
  readOnly = false
}) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {type === 'select' ? (
      <select 
        className="form-input" 
        defaultValue={defaultValue}
        name={name}
      >
        {options?.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input 
        type={type}
        className="form-input"
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
        readOnly={readOnly}
      />
    )}
  </div>
);

export default FormGroup;