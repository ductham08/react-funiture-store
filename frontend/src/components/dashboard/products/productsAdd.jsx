import { useState } from "react";
import { useDispatch } from "react-redux";

// form validation
import { Form, Formik } from "formik";
import * as Yup from "yup";

// components
import axiosInstance from "../../../apis/config";
import ProductForm from "./productForm";
import { showToast } from "../../../store/slices/toastSlice";

// style
import style from "../../../pages/dashboard/dashboard.module.css";

const ProductsAdd = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [stockError, setStockError] = useState(false);
  const [showBtnSpinner, SetShowBtnSpinner] = useState(false);
  const dispatch = useDispatch();

  const formSchema = Yup.object().shape({
    name: Yup.string().required("Tên sản phẩm là bắt buộc"),
    description: Yup.string().required("Mô tả là bắt buộc"),
    price: Yup.number().min(1, "Thấp nhất là 1đ").required("Giá bán là bắt buộc"),
    discount: Yup.number()
      .min(0, "Nhỏ nhất là 0")
      .integer("Giảm giá là số nguyên")
      .required("Discount is required"),
    category: Yup.string().required("Giảm giá là bắt buộc"),
    brand: Yup.string().required("Thương hiệu là bắt buộc"),
    colors: Yup.array()
      .min(1, "Vui lòng chọn một màu")
      .required("Màu sắc là bắt buộc"),
  });

  const handleAddProduct = (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);
    // check if there're errors
    if (imageError || stockError) return;
    if (selectedImages.length === 0) {
      setImageError("Nhập ít nhất một hình ảnh");
      return;
    }
    SetShowBtnSpinner(true);
    const token = localStorage.getItem("userToken");
    // append data to formData
    const formData = new FormData();
    values.colors.forEach((color) =>
      formData.append("colors[]", JSON.stringify(color))
    );
    selectedImages.forEach((image) => formData.append("images", image));
    Object.keys(values).forEach((key) => {
      if (key === "colors") {
        return;
      }
      formData.append(key, values[key]);
    });
    // post data
    axiosInstance
      .post("/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "x-access-token": token,
        },
      })
      .then((res) => {
        dispatch(showToast("Sản phẩm đã được thêm vào thành công!"));
        resetForm();
        setSelectedImages([]);
        SetShowBtnSpinner(false);
      })
      .catch((error) => {
        dispatch(showToast("Không thể thêm sản phẩm! Vui lòng thử lại sau."));
        SetShowBtnSpinner(false);
        console.log(error);
      });
  };

  const onImageInput = (e) => {
    let files = Array.from(e.target.files);
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith("image")) {
        setImageError("Tệp không hợp lệ, chỉ hình ảnh");
        return;
      }
      setImageError("");
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  return (
    <div className="px-3 px-md-4">
      <h1 className="h4 mb-4 py-3">Thêm sản phẩm</h1>
      <Formik
        initialValues={{
          name: "",
          description: "",
          price: 1,
          discount: 0,
          category: "",
          brand: "",
          colors: [],
        }}
        validationSchema={formSchema}
        onSubmit={handleAddProduct}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <ProductForm
              form="add"
              errors={errors}
              touched={touched}
              values={values}
              imageError={imageError}
              onStockError={(value) => setStockError(value)}
              productName={values.name}
              selectedImages={selectedImages}
              onImageInput={onImageInput}
              setFieldValue={setFieldValue}
              setSelectedImages={setSelectedImages}
            />
            {!showBtnSpinner ? (
              <button type="submit" className={`btn ${style["dash-btn"]}`}>
                Thêm
              </button>
            ) : (
              <button
                type="button"
                className={`btn ${style["dash-btn"]} text-center`}
              >
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductsAdd;
