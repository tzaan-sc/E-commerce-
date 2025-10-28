import React, { useState } from "react";
import "./style.scss";

const ChangePasswordForm = () => {
  const [values, setValues] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!values.current) err.current = "Vui lòng nhập mật khẩu hiện tại";
    if (!values.newPass) err.newPass = "Vui lòng nhập mật khẩu mới";
    else if (values.newPass.length < 6)
      err.newPass = "Mật khẩu mới phải có ít nhất 6 ký tự";
    if (!values.confirm) err.confirm = "Vui lòng nhập lại mật khẩu mới";
    else if (values.confirm !== values.newPass)
      err.confirm = "Mật khẩu xác nhận không khớp";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      alert("Đổi mật khẩu thành công!");
      setValues({ current: "", newPass: "", confirm: "" });
    }
  };

  return (
    <div className="change-password-container">
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <label>Mật khẩu hiện tại:</label>
        <input
          type="password"
          name="current"
          value={values.current}
          onChange={handleChange}
        />
        {errors.current && <div className="err">{errors.current}</div>}

        <label>Mật khẩu mới:</label>
        <input
          type="password"
          name="newPass"
          value={values.newPass}
          onChange={handleChange}
        />
        {errors.newPass && <div className="err">{errors.newPass}</div>}

        <label>Xác nhận mật khẩu mới:</label>
        <input
          type="password"
          name="confirm"
          value={values.confirm}
          onChange={handleChange}
        />
        {errors.confirm && <div className="err">{errors.confirm}</div>}

        <button type="submit">Đổi mật khẩu</button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
