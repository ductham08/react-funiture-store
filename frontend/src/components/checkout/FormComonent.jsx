import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import jwtDecode from "jwt-decode";
import axiosInstance from "../../apis/config";
import Spinner from "../common/spinner";
import axios from "axios";
import style from "../../pages/checkout/checkout.module.css";
export default function FormComponent() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [saveInfo, setSaveInfo] = useState(true);
  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataWard, setDataWard] = useState([]);
  const [cityUser, setCityUser] = useState('');
  const [districtUser, setDistrictUser] = useState('');
  const [wardUser, setWardUser] = useState('');

  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const cart = useSelector(state => state.cart.cart);
  const token = localStorage.getItem("userToken");
  const decoded = jwtDecode(token);

  useEffect(() => {
    axiosInstance.get(`/users/${decoded.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setUser(res.data);
      setCityUser(res.data.address?.city || "");
      setDistrictUser(res.data.address?.district || "");
      setWardUser(res.data.address?.ward || "");
    })
    .catch(err => console.log(err));
  }, [decoded.id, token]);

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/?depth=1")
      .then(res => setDataCity(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (cityUser) {
      axios.get(`https://provinces.open-api.vn/api/p/${cityUser}?depth=2`)
        .then(res => setDataDistrict(res.data.districts))
        .catch(err => console.log(err));
    } else {
      setDataDistrict([]);
      setDataWard([]);
    }
  }, [cityUser]);

  useEffect(() => {
    if (districtUser) {
      axios.get(`https://provinces.open-api.vn/api/d/${districtUser}?depth=2`)
        .then(res => setDataWard(res.data.wards))
        .catch(err => console.log(err));
    } else {
      setDataWard([]);
    }
  }, [districtUser]);

  useEffect(() => {
    if (cityUser) {
      axios.get(`https://provinces.open-api.vn/api/p/${cityUser}`)
        .then(res => setCityName(res.data.name))
        .catch(err => console.log(err));
    }
  }, [cityUser]);
  
  useEffect(() => {
    if (districtUser) {
      axios.get(`https://provinces.open-api.vn/api/d/${districtUser}`)
        .then(res => setDistrictName(res.data.name))
        .catch(err => console.log(err));
    }
  }, [districtUser]);

  useEffect(() => {
    if (districtUser) {
      axios.get(`https://provinces.open-api.vn/api/d/${districtUser}?depth=2`)
        .then(res => {
          const foundWard = res.data.wards.find(w => w.code == wardUser);

          console.log(foundWard);
          
          setWardName(foundWard ? foundWard.name : "");
        })
        .catch(err => console.log(err));
    }
  }, [districtUser, wardUser]);

  const validationSchema = Yup.object({
    phone: Yup.string().required("Số điện thoại không được bỏ trống"),
    fullName: Yup.string().required("Họ và tên không được bỏ trống"),
    address: Yup.object({
      city: Yup.string().required("Vui lòng chọn Tỉnh/Thành Phố"),
      district: Yup.string().required("Vui lòng chọn Quận/Huyện"),
      ward: Yup.string().required("Vui lòng chọn Xã/Phường"),
      apartment: Yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
    }),
  });

  const handleSubmitForm = (values) => {
    
    let localSaveData = {
      id: decoded.id,
      phone: values.phone,
      address: {
        city: cityName,
        district: districtName,
        street: wardName,
        apartment: values.address.apartment,
      },
    };

    let localSendData = {
        id: decoded.id,
        phone: values.phone,
        address: {
          city: values.address.city ,
          district: values.address.district,
          street: values.address.ward,
          apartment: values.address.apartment,
        },
    };

    localStorage.setItem("localFormData", JSON.stringify(localSaveData));

    if (saveInfo) {
      axiosInstance
        .patch("/users", localSendData, {
          params: {
            id: decoded.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        })
        .then(res => {
          if (cityName && districtName && wardName && values.address.apartment) {
            navigate(`/checkout/shipping`);
          }
        })
        .catch(err => console.log(err));
    } else {
      if (cityName && districtName && wardName && values.address.apartment) {
        navigate(`/checkout/shipping`);
      }
    }
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <Formik
        onSubmit={handleSubmitForm}
        initialValues={{
          phone: user.phone || "",
          fullName: user.fullName || "",
          address: {
            city: user.address?.city || cityUser,
            district: user.address?.district || districtUser,
            ward: user.address?.street || wardUser,
            apartment: user.address?.apartment || "",
          },
        }}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <div className="row form-floating">
              <div className="form-group form-floating col-lg-4 col-sm-12">
                <Field as="input" name="phone" className="form-control input-custom" placeholder="Số điện thoại" />
                <label className="label-custom">Số điện thoại</label>
                {errors.phone && touched.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
              </div>
              <div className="form-group form-floating col-lg-8 col-sm-12">
                <Field as="input" name="fullName" className="form-control input-custom" placeholder="Họ và tên" />
                <label className="label-custom">Họ và tên</label>
                {errors.fullName && touched.fullName && <div className="invalid-feedback d-block">{errors.fullName}</div>}
              </div>

              <div className="form-group form-floating col-lg-4 col-sm-12">
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
                <label>Tỉnh/Thành Phố</label>
                {errors.address?.city && touched.address?.city && <div className="invalid-feedback d-block">{errors.address.city}</div>}
              </div>

              <div className="form-group form-floating col-lg-4 col-sm-12">
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
                <label>Quận/Huyện</label>
                {errors.address?.district && touched.address?.district && <div className="invalid-feedback d-block">{errors.address.district}</div>}
              </div>

              <div className="form-group form-floating col-lg-4 col-sm-12">
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
                <label>Xã/Phường</label>
                {errors.address?.ward && touched.address?.ward && <div className="invalid-feedback d-block">{errors.address.ward}</div>}
              </div>

              <div className="form-group form-floating col-lg-12 col-sm-12">
                <Field as="input" name="address.apartment" className="form-control input-custom" placeholder="Địa chỉ" />
                <label className="label-custom">Địa chỉ</label>
                {errors.address?.apartment && touched.address?.apartment && <div className="invalid-feedback d-block">{errors.address.apartment}</div>}
              </div>
            </div>

            <div className="form-check my-3">
              <input
                id="exampleCheck1"
                type="checkbox"
                className="form-check-input"
                checked={saveInfo}
                onChange={e => setSaveInfo(e.target.checked)}
              />
              <label className={`${style.checklabal} form-check-label`} htmlFor="exampleCheck1">
                Lưu thông tin địa chỉ lại để dùng cho lần sau
              </label>
            </div>

            <div className="row mb-4 w-100 m-auto">
              <Link to="/cart" className={`col-lg-6 col-md-6 col-sm-12 mt-4 ${style.returnLink}`}>
                Quay về giỏ hàng
              </Link>
              <button
                type="submit"
                disabled={cart?.totalPrice === 0}
                className={`${style.formbtn} col-lg-6 col-md-6 col-sm-12 btn`}
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
