import { useState } from "react";
import { useDispatch } from "react-redux";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// component
import axiosInstance from "../../../apis/config";
import { showToast } from "../../../store/slices/toastSlice";
import { setBrands } from "../../../store/slices/brandsSlice";

// style
import dashStyle from "./../../../pages/dashboard/dashboard.module.css";

const BrandsAdd = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(null);
  const [showBtnSpinner, SetShowBtnSpinner] = useState(false);
  const dispatch = useDispatch();

  const token = localStorage.getItem("userToken");
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  const addBrandSubmit = () => {
    if (image === "") {
      setImageError("Image is reqiured");
      return;
    }
    SetShowBtnSpinner(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("image", image);
    // create a FormData object to send the form data and file
    axiosInstance
      .post("/brands", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "x-access-token": token,
        },
      })
      .then((res) => {
        dispatch(showToast("Thương hiệu được thêm thành công!"));
        SetShowBtnSpinner(false);
        setName("");
        setCategory("");
        setImage("");
        dispatch(setBrands(res.data));
      })
      .catch((err) => {
        console.log(err);
        SetShowBtnSpinner(false);
        // handle error, e.g. show error message
        dispatch(showToast("Không thể thêm thương hiệu mới, vui lòng thử lại."));
      });
  };

  return (
    <div className="px-3 px-md-4 py-4">
      <h1 className={`py-3 h4 ${dashStyle["fw-bold"]}`}>Thêm thương hiệu mới</h1>
      <div>
        <Formik
          initialValues={{ name: name, category: category, image: image }}
          validationSchema={Yup.object({
            name: Yup.string().required("Tên thương hiệu là bắt buộc"),
            category: Yup.string().required("Danh mục của thương hiệu là bắt buộc"),
          })}
          onSubmit={addBrandSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form encType="multipart/form-data">
              <div className={`mb-4`}>
                <label className="mb-1" htmlFor="name">
                  Thương hiệu
                </label>
                <Field
                  className={`form-control`}
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setFieldValue("name", event.target.value);
                  }}
                  placeholder="Vui lòng điền tên thương hiệu"
                />
                {errors.name && touched.name ? (
                  <span className="text-danger ms-2"> {errors.name}</span>
                ) : null}
              </div>
              <div className={`mb-4`}>
                <label className="mb-1" htmlFor="category">
                  Danh mục
                </label>
                <Field
                  type="text"
                  className={`form-control me-2`}
                  name="category"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setFieldValue("category", event.target.value);
                  }}
                  placeholder="Vui lòng điền danh mục của thương hiệu"
                />
                {errors.category && touched.category ? (
                  <span className="text-danger ms-2">{errors.category}</span>
                ) : null}
              </div>
              <div className={`mb-4`}>
                <label className="mb-1" htmlFor="image">
                  Ảnh
                </label>
                <div>
                  {image !== "" ? (
                    <img
                      alt="brand"
                      src={URL.createObjectURL(image)}
                      className="img-thumbnail mb-2"
                      width="100"
                      name="image"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <Field
                  type="file"
                  className={`form-control`}
                  name="image"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file && allowedTypes.includes(file.type)) {
                      setImage(file);
                      setImageError(null);
                    } else {
                      setImage("");
                      setImageError(
                        "Chỉ được phép cho phép các tệp PNG, JPEG hoặc JPG"
                      );
                    }
                  }}
                />
                {imageError && (
                  <span className="text-danger ms-2">{imageError}</span>
                )}
              </div>

              <div className="mb-4">
                {!showBtnSpinner ? (
                  <input
                    type="submit"
                    className={`btn px-3 rounded-pill ${dashStyle["dash-btn"]}`}
                    value="add brand"
                  />
                ) : (
                  <button
                    type="button"
                    className={`btn px-3 rounded-pill ${dashStyle["dash-btn"]}`}
                  >
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BrandsAdd;
