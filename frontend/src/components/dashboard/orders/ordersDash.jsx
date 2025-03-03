import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// component
import DashPagination from "./../dashPagination";
//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { showToast } from "../../../store/slices/toastSlice";

//style
import dashStyle from "./../../../pages/dashboard/dashboard.module.css";
import axiosInstance from "../../../apis/config";
import ConfirmPopup from "../../common/confirmPopup";
import Spinner from "./../../common/spinner";

const OrdersDash = () => {
  const [showSpinner, setShowSpinner] = useState(true);

  const [allorders, setAllorders] = useState([]);
  const [allOrdersInPage, setAllordersInPage] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState("");
  const [totalOrders, setTotaOrders] = useState(0);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("userToken");
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchQuery === "") {
      // If search query is empty, show all order
      axiosInstance
        .get(`/orders`, {
          params: {
            page: currentPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "x-access-token": token,
          },
        })
        .then(res => {
          setAllordersInPage(res.data);
          setAllorders(res.data.data);
          setTotaOrders(res.data.totalOrders);
          setShowSpinner(false);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      // If search query is not empty
      axiosInstance
        .get(`/orders/search`, {
          params: {
            search: searchQuery,
            page: currentPage,
          },
        })
        .then(res => {
          setAllordersInPage(res.data);
          setAllorders(res.data.data);
          setTotaOrders(res.data.totalOrders);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [currentPage, searchQuery]);

  // delete order
  function deleteOrder(id) {
    setShowWarning(false);
    axiosInstance
      .delete(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-access-token": token,
        },
      })
      .then(res => {
        axiosInstance
          .get(`/orders`, {
            params: {
              page: currentPage,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "x-access-token": token,
            },
          })
          .then(res => {
            setAllordersInPage(res.data);
            setAllorders(res.data.data);
            setTotaOrders(res.data.totalOrders);
            dispatch(showToast("Xóa đơn đặt hàng thành công!"));
            setOrderIdToDelete("");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
        dispatch(
          showToast(`Có lỗi trong quá trình xóa đơn hhàng ${id} !vui lòng thử lại `)
        );
      });
  }
  // expand object id
  function showAllId(event) {
    const id = event.currentTarget.dataset.id;
    event.currentTarget.textContent = id;
  }
  // Update current page state when page number is clicked
  function onPageChange(page) {
    setCurrentPage(page);
  }
  // search for id
  function handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    setCurrentPage(1);
    setSearchQuery(query);
    if (query === "") {
      // If search query is empty, show all users
      setAllordersInPage(allorders);
    } else {
      // If search query is not empty, fetch search results
      setAllordersInPage(allorders);
    }
  }

  return (
    <div>
      <div className={`py-4`}>
        <h4 className={`mb-2 py-3 ps-4 ${dashStyle["fw-bold"]}`}>
          Đơn hàng (Hiện có: {totalOrders})
        </h4>
        {deleteStatus ? (
          <div
            className={`alert alert-success alert-dismissible fade show ms-4 w-50`}
          >
            {deleteStatus}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => setDeleteStatus(null)}
            ></button>
          </div>
        ) : (
          ""
        )}
        <div className="row ms-4 me-3">
          <div className="my-4 col-12 col-md-6 d-flex align-items-center justify-content-start ">
            <input
              className="form-control"
              type="search"
              placeholder="Tìm kiếm theo id đơn hàng, tên người dùng hoặc đơn giá"
              aria-controls="DataTables_Table_0"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="overflow-x-auto pb-3 mb-3">
          {!showSpinner ? (
            <table className="table border-top" id="DataTables_Table_0">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Giá trị</th>
                  <th scope="col">Điện thoại</th>
                  <th scope="col">Ngày đặt hàng</th>
                  <th scope="col">Địa chỉ nhận</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {allorders?.length > 0 ? (
                  allorders.map((order, index) => {
                    console.log(order);
                    
                    return (
                      <tr key={order?._id}>
                        <td
                          className={`ps-4`}
                          data-id={order?._id}
                          onClick={showAllId}
                        >
                          {order?._id.substring(0, 8) + "..."}
                        </td>
                        <td>{order?.totalPrice.toLocaleString('vi-VN')} đ</td>
                        <td className={order?.phone !== "" ? "text-start" : "text-center"} >
                          {order?.phone !== "" ? order?.phone : "x"}
                        </td>
                        <td className="text-start"> {new Date(order.date).toLocaleDateString()} | {new Date(order.date).toLocaleTimeString()} </td>
                        <td className="text-start">
                          {order?.address?.apartment} | {order?.address?.street} | {order?.address?.district} | {order?.address?.city}
                        </td>
                        <td className="text-start">
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            type="button"
                            className="text-danger"
                            onClick={() => {
                              setShowWarning(true);
                              setOrderIdToDelete(order._id);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <Spinner />
          )}
        </div>

        <DashPagination
          totalPages={allOrdersInPage.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          className="mt-5"
        />
        {showWarning && orderIdToDelete && (
          <ConfirmPopup
            msg={"Bạn có chắc chắn muốn xóa đơn hàng này?"}
            onConfirm={() => deleteOrder(orderIdToDelete)}
            onCancel={() => {
              setShowWarning(false);
              setOrderIdToDelete("");
            }}
          />
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default OrdersDash;
