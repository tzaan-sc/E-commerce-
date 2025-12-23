import React from 'react';
import { X, Save } from 'lucide-react';
import './style.scss';

const Modal = ({ show, title, onClose, children, onSave, hasChanges }) => {
  if (!show) return null;

  const handleClose = () => {
    if (hasChanges && !window.confirm('Bạn có muốn lưu thông tin đã thay đổi?')) {
      return;
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleClose}>
            {hasChanges ? 'Hủy' : 'Đóng'}
          </button>
          {onSave && (
            <button className="btn btn-success" onClick={onSave}>
              <Save size={18} /> Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;