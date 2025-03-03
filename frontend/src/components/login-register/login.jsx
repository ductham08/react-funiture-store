import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import jwtDecode from "jwt-decode";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// font awesome
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// component
import { getCart } from "./../../functions/cart";
import axiosInstance from "../../apis/config";
import { showToast } from "../../store/slices/toastSlice";

// style
import styles from "./login-register.module.css";

const Login = ({ closeModal, saveUserData }) => {

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate =useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = (user, { resetForm }) => {
    axiosInstance
      .post("/login", user)
      .then((response) => {
        // handle response data, e.g. show success message
        dispatch(showToast("Đăng nhập thành công!"));
        // store token in local storage
        localStorage.setItem("userToken", response.data.token);
        // save User Data
        getCart(response.data.token);
        saveUserData();
        resetForm();
        closeModal();
        const {role}=jwtDecode(response.data.token)
        if(role === "admin") {
          navigate("/dashboard")
        } 

      })
      .catch((error) => {
        // handle error, e.g. show error message
        dispatch(showToast("Email hoặc mật khẩu không chính xác. Hãy thử lại."));

      });
  };
  return (
    <>
      <Formik
        initialValues={{ ...user }}
        validationSchema={Yup.object({
          email: Yup.string()
            .required("Email is required")
            .matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Email phải là địa chỉ email hợp lệ"),
          password: Yup.string().required("Mật khẩu là bắt buộc"),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className={styles.label}>
            <div className="mb-3">
              <label className="mb-1" htmlFor="email">
                Email <span>*</span>
              </label>
              <Field
                className={`form-control ${styles.input}`}
                name="email"
                type="email"
                placeholder="Vui lòng nhập địa chỉ email"
              />
              {errors.email && touched.email ? (
                <span className="text-danger ms-2"> {errors.email}</span>
              ) : null}
            </div>
            <div className="mb-3">
              <label className="mb-1" htmlFor="password">
                Mật khẩu <span>*</span>
              </label>
              <div className={styles.passwordInputWrapper}>
                <Field
                  className={`form-control ${styles.input}`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Bạn chưa nhập mật khẩu"
                />
                <span
                  className={styles.togglePasswordVisibilityButton}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                    ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
              {errors.password && touched.password ? (
                <span className="text-danger ms-2">{errors.password}</span>
              ) : null}
            </div>
            <div
              className={`${styles["group-button"]} ${styles["button-submit"]}`}
            >
              <input
                type="submit"
                className={`btn-bg-dark ${styles.button}`}
                value="Đăng nhập"
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
