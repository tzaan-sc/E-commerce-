import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './style.scss';

const DataTable = ({ 
  columns, 
  data, 
  selectedItems, 
  onSelectAll, 
  onSelectItem, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>
                {col.type === 'checkbox' ? (
                  <input 
                    type="checkbox" 
                    onChange={onSelectAll}
                    checked={selectedItems?.length === data.length && data.length > 0}
                  />
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row.id}>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {col.type === 'checkbox' && (
                    <input 
                      type="checkbox"
                      checked={selectedItems?.includes(row.id)}
                      onChange={() => onSelectItem(row.id)}
                    />
                  )}
                  {col.type === 'index' && rowIdx + 1}
                  {col.type === 'image' && (
                    <img 
                      src="https://via.placeholder.com/60" 
                      alt="" 
                      className="img-preview" 
                    />
                  )}
                  {col.type === 'status' && (
                    <span className={`status-badge ${col.getClass(row[col.field])}`}>
                      {row[col.field]}
                    </span>
                  )}
                  {col.type === 'actions' && (
                    <div className="action-buttons">
                      {onEdit && (
                        <button 
                          className="icon-btn edit" 
                          onClick={() => onEdit(row)}
                        >
                          <Edit2 size={16} /> Sửa
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className="icon-btn delete" 
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      )}
                    </div>
                  )}
                  {col.type === 'button' && (
                    <button 
                      className="btn btn-primary" 
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => col.onClick(row)}
                    >
                      {col.buttonLabel}
                    </button>
                  )}
                  {!col.type && col.render 
                    ? col.render(row) 
                    : !col.type && row[col.field]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;