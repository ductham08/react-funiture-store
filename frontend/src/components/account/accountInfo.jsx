import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

//component

// style
import axios from "axios";
import styles from "../../pages/account/account.module.css";

const AccountInfo = ({ user, token, setUser }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showBtnSpinner, SetShowBtnSpinner] = useState(false);

  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataWard, setDataWard] = useState([]);
  const [cityUser, setCityUser] = useState('');
  const [districtUser, setDistrictUser] = useState('');
  const [wardUser, setWardUser] = useState('');

  const [updateUser, setUpdateUser] = useState({
    id: id,
    fullName: user?.fullName,
    email: user?.email,
    phone: user?.phone,
    address: {
      city: user?.address?.city,
      street: user?.address?.street,
      district: user?.address?.district,
      ward: user?.address?.street,
      apartment: user?.address?.apartment,
    },
  });

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/?depth=1")
      .then(res => setDataCity(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (updateUser?.address?.city) {
      axios.get(`https://provinces.open-api.vn/api/p/${updateUser?.address?.city}?depth=2`)
        .then(res => setDataDistrict(res.data.districts))
        .catch(err => console.log(err));
    } else {
      setDataDistrict([]);
      setDataWard([]);
    }
  }, [updateUser]);

  useEffect(() => {
    if (updateUser?.address?.district) {
      axios.get(`https://provinces.open-api.vn/api/d/${updateUser?.address?.district}?depth=2`)
        .then(res => setDataWard(res.data.wards))
        .catch(err => console.log(err));
    } else {
      setDataWard([]);
    }
  }, [updateUser]);

  const updateUserSubmit = (updateUser) => {
    // SetShowBtnSpinner(true);

    console.log(updateUser);
    
    // axiosInstance
    //   .patch("/users", updateUser, {
    //     params: {
    //       id: id
    //     },
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //       "x-access-token": token,
    //     },
    //   })
    //   .then((res) => {
    //     dispatch(showToast("Account Updated successfully!"));
    //     SetShowBtnSpinner(false);
    //     setUser(updateUser)
    //   })
    //   .catch((err) => {
    //     dispatch(showToast("Unable to update, please try again."));
    //     SetShowBtnSpinner(false);
    //   });
  };

  return (
    <div>
      <h2 className={`${styles["text-2xl"]} ${styles.subTitle}`}>
        Thông tin tài khoản
      </h2>
      <Formik
        initialValues={{
          ...updateUser,
        }}
        validationSchema={Yup.object({
          fullName: Yup.string()
            .required("Họ và tên là bắt buộc")
            .matches(/^[a-zA-Z ]+$/, "Họ và tên không được có số hoặc ký tự đặc biệt")
            .min(3, "Full name must be at least 3 characters")
            .max(50, "Full name must be less than 50 characters"),
          email: Yup.string()
            .required("Email is required")
            .matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Email must be a valid email address")
            .test("email-username-length", "Sorry, email username must be between 6 and 30 characters long", function (value) {
              const username = value.split("@")[0];
              return username.split("@")[0].length >= 6 && username.length <= 30;
            })
            .test("lowercase", "Email must be lowercase", function (value) {
              return value.toLowerCase() === value;
            }),

          phone: Yup.string()
            .optional()
            .nullable()
            .matches(
              /^(0[0-9]{9}|\+84[0-9]{9})$/,
              "Vui lòng nhập đúng định dạng số điện thoại."
            ),
          address: Yup.object({
            city: Yup.string().optional().nullable().label("City"),
            street: Yup.string().optional().nullable().label("Street"),
            building: Yup.number()
              .optional()
              .nullable()
              .min(1, "Building can't be 0")
              .integer("Building must be an integer number.")
              .label("Building"),
            governorate: Yup.string()
              .optional()
              .nullable()
              .label("Governorate"),
            apartment: Yup.string().optional().nullable().label("Apartment"),
            postalCode: Yup.string()
              .optional()
              .length(5, "Postal code must be exactly 5 digits")
              .matches(/(?!0)[0-9]{5}/, "Postal code must not start with zero")
              .label("Postal Code"),
          })
            .optional()
            .nullable()
            .label("Address"),
        })}
        onSubmit={updateUserSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={styles.label}>
            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label>Họ và tên</label>
              <Field as="input" name="fullName" className="form-control" placeholder="Họ và tên" />
              {errors.fullName && touched.fullName && <div className="invalid-feedback d-block">{errors.fullName}</div>}
            </div>
            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label>Số điện thoại</label>
              <Field as="input" name="phone" className="form-control" placeholder="Số điện thoại" />
              {errors.phone && touched.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
            </div>
            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label>Email</label>
              <Field as="input" name="email" className="form-control " placeholder="Email" />
              {errors.email && touched.email && <div className="invalid-feedback d-block">{errors.email}</div>}
            </div>
            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label className="mb-1" htmlFor="phone">
                Số điện thoại
              </label>
              <Field
                className={`form-control ${styles.input}`}
                name="phone"
                type="text"
                id="phone"
                placeholder="Please enter your phone number"
              />
              {errors?.phone && touched?.phone ? (
                <span className="text-danger ms-2">{errors.phone}</span>
              ) : null}
            </div>

            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label>Tỉnh/Thành Phố</label>
              <Field
                as="select"
                name="address.city"
                className="form-control"
                value={values.address.city}
                onChange={(e) => {
                  const value = e.target.value;
                  setCityUser(value);
                  setFieldValue("address.city", value);
                  setFieldValue("address.district", "");
                  setFieldValue("address.ward", "");
                }}
              >
                <option value="" disabled>Chọn Tỉnh/Thành Phố</option>
                {dataCity.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </Field>
              {errors.address?.city && touched.address?.city && <div className="invalid-feedback d-block">{errors.address.city}</div>}
            </div>

            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label>Quận/Huyện</label>
              <Field
                as="select"
                name="address.district"
                className="form-control"
                value={values.address.district}
                onChange={(e) => {
                  const value = e.target.value;
                  setDistrictUser(value);
                  setFieldValue("address.district", value);
                  setFieldValue("address.ward", "");
                }}
                disabled={!cityUser}
              >
                <option value="" disabled>Chọn Quận/Huyện</option>
                {dataDistrict.map(d => (
                  <option key={d.code} value={d.code}>{d.name}</option>
                ))}
              </Field>
              {errors.address?.district && touched.address?.district && <div className="invalid-feedback d-block">{errors.address.district}</div>}
            </div>

            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label>Xã/Phường</label>
              <Field
                as="select"
                name="address.ward"
                className="form-control"
                value={values.address.ward}
                onChange={(e) => {
                  const value = e.target.value;
                  setWardUser(value);
                  setFieldValue("address.ward", value);
                }}
                disabled={!districtUser}
              >
                <option value="" disabled>Chọn Xã/Phường</option>
                {dataWard.map(w => (
                  <option key={w.code} value={w.code}>{w.name}</option>
                ))}
              </Field>
              {errors.address?.ward && touched.address?.ward && <div className="invalid-feedback d-block">{errors.address.ward}</div>}
            </div>

            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label>Địa chỉ</label>
              <Field name="address.apartment" className="form-control" placeholder="Địa chỉ" />
              {errors.address?.apartment && touched.address?.apartment && <div className="invalid-feedback d-block">{errors.address.apartment}</div>}
            </div>

            <div className={`pt-3`}>
              {!showBtnSpinner ?
                <input
                  type="submit"
                  className={`btn-bg-dark text-center ${styles.button}`}
                  value="Cập nhật thông tin"
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

export default AccountInfo;
