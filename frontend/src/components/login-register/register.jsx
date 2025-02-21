import { useState } from "react";
import { useDispatch } from "react-redux";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// component
import axiosInstance from "../../apis/config";
import { showToast } from "../../store/slices/toastSlice";

// style
import styles from "./login-register.module.css";

const Register = ({ onRegistrationSuccess }) => {
  
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = (user, { resetForm }) => {
    axiosInstance
      .post("/register", user)
      .then((response) => {
        // handle response data, e.g. show success message
        dispatch(showToast("Đăng ký tài khoản thành công!"));
        resetForm();
        setTimeout(() => {
          onRegistrationSuccess();
        }, 2000);
      })
      .catch((error) => {
        // handle error, e.g. show error message
        dispatch(showToast("Email đã tồn tại, vui lòng kiểm tra lại!"));
      });
  };
  return (
    <>
      <Formik
        initialValues={{
          ...user,
        }}
        validationSchema={Yup.object({
          fullName: Yup.string()
            .required("Vui lòng nhập đầy đủ họ và tên")
            .matches(/^[a-zA-Z ]+$/,"Họ và tên không được chứa số và ký tự đặc biệt")
            .min(3, "Họ và tên cần có ít nhất 3 ký tự")
            .max(50, "Họ và tên không được nhiều hơn 50 ký tự"),
          email: Yup.string()
            .required("Email là trường thông tin bắt buộc")
            .matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Không đúng định dạng email")
            .test("email-username-length", "Xin lỗi, tên người dùng gửi email phải dài từ 6 đến 30 ký tự", function(value) {
              const username = value.split("@")[0];
              return username.split("@")[0].length >= 6 && username.length <= 30;
            })
            .test("lowercase", "Vui lòng không có ký tự viết hoa trong email", function(value) {
              return value.toLowerCase() === value;
            }),
          password: Yup.string()
            .required("Mật khẩu là trường thông tin bắt buộc")
            .min(8, "Mật khẩu phải dài ít nhất 8 ký tự")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ cái viết thường, một số và một ký hiệu đặc biệt"
            ),
          confirmPassword: Yup.string()
            .required("Xác nhận mật khẩu là bắt buộc")
            .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
            .label("Xác nhận mật khẩu"),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className={styles.label}>
            <div className="mb-3">
              <label className="mb-1" htmlFor="fullName">
                Họ và tên <span>*</span>
              </label>
              <Field
                className={`form-control ${styles.input}`}
                name="fullName"
                type="text"
                id="fullName"
                placeholder="Vui lòng nhập đầy đủ tên của bạn"
              />
              {errors.fullName && touched.fullName ? (
                <span className="text-danger ms-2">{errors.fullName}</span>
              ) : null}
            </div>
            <div className="mb-3">
              <label className="mb-1" htmlFor="email">
                Email <span>*</span>
              </label>
              <Field
                className={`form-control ${styles.input}`}
                name="email"
                type="email"
                id="email"
                placeholder="Vui lòng nhập địa chỉ email"
              />
              {errors.email && touched.email ? (
                <span className="text-danger ms-2">{errors.email}</span>
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
                  placeholder="Vui lòng nhập mật khẩu"
                />
                <span
                  className={styles.togglePasswordVisibilityButton}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </span>
              </div>
              {errors.password && touched.password ? (
                <span className="text-danger ms-2">{errors.password}</span>
              ) : null}
            </div>

            <div className="mb-3">
              <label className="mb-1" htmlFor="confirmPassword">
                Xác nhận mật khẩu <span>*</span>
              </label>
              <Field
                className={`form-control ${styles.input}`}
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="Vui lòng xác nhận mật khẩu của bạn"
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <span className="text-danger ms-2">
                  {errors.confirmPassword}
                </span>
              ) : null}
            </div>
            <div
              className={`${styles["group-button"]} ${styles["button-submit"]}`}
            >
              <input
                type="submit"
                className={`btn-bg-dark ${styles.button}`}
                value="Tạo tài khoản"
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Register;
