import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// components
import DashPagination from "../dashPagination";
import axiosInstance from "../../../apis/config";
import Spinner from "../../common/spinner";
import ProductsSearch from "./productsSearch";
import { showToast } from "../../../store/slices/toastSlice";
import ConfirmPopup from "../../common/confirmPopup";

// style
import style from "../../../pages/dashboard/dashboard.module.css";

const ProductsData = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    query: "",
  });
  const dispatch = useDispatch();

  const handlePageChange = (page) => {
    setPage(page);
    setSearchParams({ page, query: searchParams.get("query") });
  };

  const handleRemoveProduct = (id, brand, category) => {
    const token = localStorage.getItem("userToken");
    axiosInstance
      .delete("/products", {
        params: {
          _id: id,
          brand,
          category,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
      .then((res) => {
        dispatch(showToast("Xóa sản phẩm thành công!"));
        setProductToDelete(null);
        getAllData();
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          showToast("Xóa sản phẩm không thành công, vui lòng thử lại sau!")
        );
        setProductToDelete(null);
      });
  };

  const handleSearch = (values, { setSubmitting }) => {
    setSubmitting(false);
    setSearchParams({ page: 1, query: values.searchValue });
  };

  const handleRemoveSearch = () => {
    setSearchParams({ page: 1, query: "" });
  };

  const getResults = (query, page = 1) => {
    setPage(+page);
    axiosInstance
      .get("/products/search", {
        params: {
          search: query,
          page,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalProducts(res.data.totalResults);
        setShowSpinner(false);
      })
      .catch((error) => console.log(error));
  };

  const getAllData = () => {
    setShowSpinner(true);
    if (searchParams.get("page")) {
      setPage(+searchParams.get("page"));
    }
    if (searchParams.get("query")) {
      getResults(searchParams.get("query"), +searchParams.get("page"));
    } else {
      axiosInstance
        .get("/products/dashboard", {
          params: {
            page: searchParams.get("page") ? +searchParams.get("page") : page,
          },
        })
        .then((res) => {
          setData(res.data.data);
          setTotalPages(res.data.totalPages);
          setTotalProducts(res.data.totalProducts);
          setShowSpinner(false);
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    getAllData();
  }, [searchParams]);

  return (
    <>
      <div className="px-4">
        <h1 className="h4 mb-4 py-3">Products (total: {totalProducts})</h1>
        <div className="d-flex flex-md-row flex-column-reverse align-items-md-start justify-content-between px-md-2">
          <ProductsSearch
            onSearch={handleSearch}
            searchParams={searchParams}
            onRemoveSearch={handleRemoveSearch}
          />
          <Link
            to="/dashboard/products/add"
            className={`text-capitalize btn ${style["dash-btn"]} align-self-center align-self-md-start d-flex gap-1 align-items-center mb-md-0 mb-5`}
          >
            <FontAwesomeIcon icon={faPlus} /> <span>Thêm mới</span>
          </Link>
        </div>
      </div>
      {!showSpinner ? (
        <>
          <div className="table-responsive mb-5">
            <table className="table border-top mb-0">
              <thead>
                <tr>
                  <th scope="col" className="ps-4">
                    #ID
                  </th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col">Giá bán</th>
                  <th scope="col">Giảm giá</th>
                  <th scope="col">Danh mục</th>
                  <th scope="col" className="text-center">Thương hiệu</th>
                  <th scope="col">Kho</th>
                  <th scope="col">Ảnh</th>
                  <th scope="col" colSpan={2}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((product) => (
                    <tr key={product._id}>
                      {/* id */}
                      <th
                        scope="row"
                        className={`${style["dash-prod-id-holder"]} ps-4`}
                      >
                        <span className={`d-block ${style["dash-prod-id"]}`}>
                          {product._id}
                        </span>
                      </th>
                      {/* name */}
                      <td>{product.name}</td>
                      {/* description */}
                      <td>{product.description.slice(0, 40)}...</td>
                      {/* price */}
                      <td className="text-center">
                        {product.price.toFixed(2).toLocaleString('vi-VN')} đ
                      </td>
                      {/* disount */}
                      <td className="text-center">
                        {product.discount > 0 ? `${product.discount}%` : 0}
                      </td>
                      {/* category */}
                      <td className="text-center text-capitalize">
                        {product.category ? product.category.name : ''}
                      </td>
                      {/* brand */}
                      <td className="text-center">{product.brand ? product.brand.name : ''}</td>
                      {/* stock */}
                      <td>
                        <div>
                          {product.colors.map((ele) => (
                            <div
                              key={ele.color}
                              className="d-flex justify-content-between gap-2 mb-2"
                            >
                              <span className="d-inline-block ps-1 lh-1 align-middle">
                                {ele.stock}
                              </span>
                              <span
                                className={`${style["dash-prod-clr"]} d-inline-block align-middle rounded-circle border border-2`}
                                style={{ backgroundColor: ele.color }}
                              ></span>
                            </div>
                          ))}
                        </div>
                      </td>
                      {/* images */}
                      <td colSpan={2}>
                        {product.images.map((ele) => (
                          <img
                            key={ele._id}
                            src={process.env.REACT_APP_BASE_URL + "/" + ele.src}
                            alt={product.name}
                            className={`${style["dash-prod-img"]} mx-auto d-block mb-2 border img-fluid rounded-2`}
                          />
                        ))}
                      </td>
                      {/* actions */}
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Link
                            to={`/dashboard/products/update/${product._id}`}
                            className={`btn p-0 border-0 outline-0 ${style["dash-purple"]}`}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span className="visually-hidden">update</span>
                          </Link>
                          {productToDelete === product._id ? (
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="btn d-inline-block p-0 border-0 outline-0 text-danger"
                              onClick={() => {
                                setProductToDelete(product);
                                setShowWarning(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                              <span className="visually-hidden">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan={10}>
                      No products were found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <DashPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <Spinner />
      )}
      {showWarning && productToDelete && (
        <ConfirmPopup
          msg={`Bạn có chắc chắn muốn xóa sản phẩm ${productToDelete.name} khỏi kho hàng không?`}
          onConfirm={() =>
            handleRemoveProduct(
              productToDelete._id,
              productToDelete.brand,
              productToDelete.category
            )
          }
          onCancel={() => {
            setShowWarning(false);
            setProductToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default ProductsData;
