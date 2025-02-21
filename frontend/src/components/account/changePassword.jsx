import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

//component
import axiosInstance from "../../apis/config";
import { showToast } from "../../store/slices/toastSlice";

//style
import styles from "../../pages/account/account.module.css";


const ChangePasswords = ({ user, token}) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [showBtnSpinner, SetShowBtnSpinner] = useState(false);
    const [updateUser, setUpdateUser] = useState({
      id:id,
      password: "",
      currentPassword: "",
      confirmPassword: "",
    });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const togglePasswordVisibility = (passwordField) => {
    if (passwordField === "currentPassword") {
      setShowCurrentPassword((prevState) => !prevState);
    } else {
      setShowNewPassword((prevState) => !prevState);
    }
  };

  const updateUserSubmit = (updateUser, { resetForm }) => {
    SetShowBtnSpinner(true);
    axiosInstance
      .patch(`/users`, updateUser,
       {
        params:{
          id:id
        },
        headers: {
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json",
            "x-access-token":token
        },
      })
      .then((res) => {
        dispatch(showToast("Cập nhật mật khẩu mới thành công!"));
        SetShowBtnSpinner(false);
        resetForm()
      })
      .catch((err) => {
        dispatch(showToast("Không thể cập nhật / kiểm tra lại mật khẩu hiện tại của bạn và đảm bảo rằng mật khẩu mới khác với hiện tại."));
        SetShowBtnSpinner(false);
      });
  };
  return (
    <div>
      <h2 className={`${styles["text-2xl"]} ${styles.subTitle}`}>
        Đổi mật khẩu
      </h2>

      <Formik
        initialValues={{
          ...updateUser,
        }}
        validationSchema={Yup.object({
            currentPassword: Yup.string().required(
              "Vui lòng nhập mật khẩu hiện tại"
            ).label("Mật khẩu hiện tại"),
          password: Yup.string()
            .required("Mật khẩu là bắt buộc")
            .min(8, "Mật khẩu phải dài ít nhất 8 ký tự")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ cái viết thường, một số và một ký hiệu từ (@$!%*? &)."
            ),
          confirmPassword: Yup.string()
            .required("Xác nhận mật khẩu là bắt buộc")
            .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
            .label("Xác nhận mật khẩu"),
        })}
        onSubmit={updateUserSubmit}
      >
        {({ errors, touched }) => (
          <Form className={styles.label}>
            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label className="mb-1" htmlFor="currentPassword">
                Mật khẩu cũ
              </label>
              <div className={styles.passwordInputWrapper}>
                <Field
                  className={`form-control ${styles.input}`}
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  placeholder="Vui lòng nhập mật khẩu hiện tại của bạn"
                />
                <span
                  className={styles.togglePasswordVisibilityButton}
                  onClick={() => togglePasswordVisibility("currentPassword")}
                >
                  {showCurrentPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                    ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
              {errors.currentPassword && touched.currentPassword ? (
                <span className="text-danger ms-2">{errors.currentPassword}</span>
              ) : null}
            </div>
            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label className="mb-1" htmlFor="password">
                Mật khẩu mới
              </label>
              <div className={styles.passwordInputWrapper}>
                <Field
                  className={`form-control ${styles.input}`}
                  name="password"
                  type={showNewPassword ? "text" : "password"}
                  id="password"
                  placeholder="Vui lòng nhập mật khẩu mới"
                />
                <span
                  className={styles.togglePasswordVisibilityButton}
                  onClick={() => togglePasswordVisibility("password")}
                >
                  {showNewPassword ? (
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

            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label className="mb-1" htmlFor="confirmPassword">
                Xác nhận mật khẩu
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

            <div className={`pt-3`}>
            {!showBtnSpinner ? 
              <input
                type="submit"
                className={`btn-bg-dark text-center ${styles.button}`}
                value="Cập nhật mật khẩu"
              />
              : 
              <button
              type="button"
              className={`btn-bg-dark text-center ${styles.button}`}
            >
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </button>
             
              }
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePasswords;
