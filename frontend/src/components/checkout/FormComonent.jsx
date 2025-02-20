import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import jwtDecode from "jwt-decode";
import axiosInstance from "../../apis/config";
import Spinner from "../common/spinner";
import style from "../../pages/checkout/checkout.module.css";
import { tinh_tp } from "../../apis/tinh_tp";
import { quan_huyen } from "../../apis/quan_huyen";
import { xa_phuong } from "../../apis/xa_phuong";

export default function FormComonent() {
  const [saveInfo, setSaveInfo] = useState(true);
  const [user, setUser] = useState("");

  const navigate = useNavigate();
  const cart = useSelector(state => state.cart.cart);

  const token = localStorage.getItem("userToken");
  const decoded = jwtDecode(token);

  const savedFormData = localStorage.getItem("localFormData");

  const [theintialvalue, settheIntialvalue] = useState(() => {
    if (savedFormData) {
      return JSON.parse(savedFormData);
    } else {
      return {
        fullName: user.fullName || "",
        phone: user?.phone || "",
        address: {
          city: tinh_tp.find(item => item.code == user?.address?.city)?.name ,
          district: quan_huyen.find(item => item.code == user?.address?.district)?.name,
          street: xa_phuong.find(item => item.code == user?.address?.street)?.name,
          apartment: user?.address?.apartment,
        },
      };
    }
  });

  useEffect(() => {
    axiosInstance
      .get(`/users/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-access-token": token,
        },
      })
      .then(res => {
        setUser(res.data);
        if (savedFormData) {
          settheIntialvalue(JSON.parse(savedFormData));
        } else {
          settheIntialvalue(res.data);
        }
      })
      .catch(err => console.log(err));
  }, [decoded.id, token]);

  const formSubmit = (submitdata) => {

    let theSendData = {
        id: decoded.id,
        phone: submitdata?.phone,
        address: {
          city: tinh_tp.find(item => item.code == submitdata?.address?.city)?.name ,
          district: quan_huyen.find(item => item.code == submitdata?.address?.district)?.name,
          street: xa_phuong.find(item => item.code == submitdata?.address?.street)?.name,
          apartment: submitdata?.address?.apartment,
        },
    };

    localStorage.setItem("localFormData", JSON.stringify(theSendData));

    if (saveInfo) {
      axiosInstance
        .patch("/users", theSendData, {
          params: {
            id: decoded.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        })
        .then(res => { })
        .catch(err => console.log(err));
    }

    navigate(`/checkout/shipping`);
  };
  if (!user) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }


  return (
    <div className="p-4">
      <Formik
        initialValues={theintialvalue}
        // validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={formSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="form-group form-floating ">
              <Field
                name="phone"
                placeholder="Số điện thoại"
                className="form-control"
                type="text"
                id="phone"
              />{" "}
              <label htmlFor="phone">Số điện thoại </label>
              {touched.phone && errors.phone && (
                <div className="text-danger ms-2">{errors.phone}</div>
              )}
            </div>
            <div className="form-group form-floating ">
              <Field
                name="fullName"
                placeholder="Họ và tên"
                className="form-control"
                type="text"
                id="fullName"
              />
              <label htmlFor="fullName">Họ và tên </label>
              {touched.fullName && errors.fullName && (
                <div className="text-danger ms-2">{errors.fullName}</div>
              )}
            </div>

            {/* ADDRESS START */}
            <div className="row mb-3 mt-0  form-floating ">
              <div className="form-group form-floating  col-lg-6  col-sm-12">
                <Field
                  className={`form-control ${style.input} ${style.gray} `}
                  name="address.city"
                  type="text"
                  id="city"
                  as="select"
                >
                  <option value="" id="0" disabled>
                    Tỉnh/Thành Phố
                  </option>
                  {tinh_tp.map(city => {
                    return (
                      <option
                        key={city.code}
                        id={city.code}
                        value={city.code}
                      >
                        {city.name}
                      </option>
                    );
                  })}
                </Field>
                <label htmlFor="city">Tỉnh/Thành Phố</label>

                {errors.address?.city && touched.address?.city ? (
                  <span className="text-danger ms-2">
                    {errors.address?.city}
                  </span>
                ) : null}
              </div>

              <div className="form-group form-floating  col-lg-6  col-sm-12">
                <Field
                  className={`form-control ${style.input} ${style.gray} `}
                  name="address.district"
                  type="text"
                  id="district"
                  as="select"
                >
                  <option value="" id="0" disabled>
                    Quận/Huyện
                  </option>
                  {
                    quan_huyen.map(quan_huyen => {
                      const selecteddistrictValue = document.querySelector("#city")?.value;
                      if (quan_huyen?.parent_code === selecteddistrictValue) {
                        return (
                          <option
                            key={quan_huyen.code}
                            id={quan_huyen.code}
                            value={quan_huyen.code}
                          >
                            {quan_huyen.name}
                          </option>
                        );
                      }

                      return null;
                    })

                  }
                </Field>
                <label htmlFor="district">Quận/Huyện</label>

                {errors.address?.city && touched.address?.district ? (
                  <span className="text-danger ms-2">
                    {errors.address?.city}
                  </span>
                ) : null}
              </div>

              <div className="form-group form-floating  col-lg-6  col-sm-12">
                <Field
                  className={`form-control ${style.input} ${style.gray} `}
                  name="address.street"
                  type="text"
                  id="street"
                  as="select"
                >
                  <option value="" id="0" disabled>
                    Xã/Phường
                  </option>
                  {
                    xa_phuong.map(xa_phuong => {
                      const selecteddistrictValue = document.querySelector("#district")?.value;
                      if (xa_phuong?.parent_code === selecteddistrictValue) {
                        return (
                          <option
                            key={xa_phuong.code}
                            id={xa_phuong.code}
                            value={xa_phuong.code}
                          >
                            {xa_phuong.name}
                          </option>
                        );
                      }

                      return null;
                    })

                  }
                </Field>
                <label htmlFor="street">Xã/Phường</label>

                {touched.address?.street && errors.address?.street && (
                  <div className="text-danger ms-2">{errors.address?.street}</div>
                )}
              </div>

              <div className="form-group form-floating  col-lg-6  col-sm-12">
                <Field
                  name="address.apartment"
                  placeholder="Địa chỉ"
                  className="form-control"
                  type="text"
                  id="apartment"
                />
                <label htmlFor="apartment" className="address">Địa chỉ </label>
                {touched.address?.apartment && errors.address?.apartment && (
                  <div className="text-danger ms-2">
                    {errors.address?.apartment}
                  </div>
                )}
              </div>
            </div>

            {/* SAVE ADDRESS */}
            <div className="form-check my-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
                checked={saveInfo}
                onChange={e => setSaveInfo(e.target.checked)}
              />

              <label
                className={`${style.checklabal} form-check-label mt-2`}
                htmlFor="exampleCheck1"
              >
                Lưu thông tin địa chỉ lại để dùng cho lần sau{" "}
              </label>
            </div>

            <div className="row mb-4  w-100 m-auto">
              <Link
                className={`col-lg-6  col-md-6 col-sm-12  col-12  mt-2 mb-3 mt-4 ${style.returnLink} text-decoration-none `}
                to="/cart"
              >
                {" "}Quay về giỏ hàng{" "}
              </Link>

              <button
                type="submit"
                disabled={cart?.totalPrice === 0}
                className={`${style.formbtn} 
                 col-lg-6  col-md-6 col-sm-12  col-12  btn  h-100  ws-100 me-0 `}
              >
                Tiếp tục mua hàng
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
