import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
//
import axiosInstance from "../../apis/config";
import { emptyCart } from "../../functions/cart";
import { showToast } from "../../store/slices/toastSlice.js";

import OrderInfo from "./orderInfo";
import Spinner from "../common/spinner";
import ConfirmPopup from "../common/confirmPopup";
//style
import style from "../../pages/checkout/checkout.module.css";

export default function PaymentMethod() {
  const [showWarning, setShowWarning] = useState(false);
  const [showBtnSpinner, SetShowBtnSpinner] = useState(false);
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [buttonText, setButtonText] = useState("Xác nhận đặt hàng");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");
  const shippingValue = 30000;

  const cart = useSelector(state => state.cart.cart);

  let totalPrice = 0;
  const updatedAvailableItems = cart?.items?.filter(item => {
    const color = item?.color;
    const stock = item?.product_id?.colors.find(c => c.color === color)?.stock;

    if (stock >= item?.quantity) {
      totalPrice +=
        item?.product_id.price *
        (1 - item.product_id.discount / 100) *
        item.quantity;
      return item;
    }
  });
  const shipping = totalPrice >= 1200 ? 0 : 15;

  const priceWithShapping = (shipping + +totalPrice).toFixed(2);
  const formData = JSON.parse(localStorage.getItem("localFormData"));
  const onConfirmClick = () => {
    SetShowBtnSpinner(true);
    setShowWarning(false);

    const additionalInfo = {
      address: formData?.address,
      phone: formData?.phone,
      totalPrice: priceWithShapping,
      userId: cart?.user_id,
      items: updatedAvailableItems?.map(item => ({
        product_id: item?.product_id._id,
        quantity: item.quantity,
        color: item.color,
        price: item.product_id.price,
      })),
    };
    const newObjectData = {
      address: formData?.address,
      phone: formData?.phone,
      ...additionalInfo,
    };

    axiosInstance
      .post(`/orders`, newObjectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
      .then(res => {
        navigate(`/order-confirmed/${res.data._id}`, { replace: true });
        emptyCart(cart._id);
        setIsAddingOrder(true);
        SetShowBtnSpinner(false);

        // delete form data from localStorage
        localStorage.removeItem("localFormData");
        setButtonText("order Done");
      })
      .catch(error => {
        console.log(error.response);
        dispatch(showToast("Unable to make order, please try again."));
        SetShowBtnSpinner(false);
      });
  };
  return formData ? (
    <div className="">
      <div className={`${style.PaymentMethod}  container `}>
        <div className="container">
          <div className="form-control mr-5 ps-4">
            <OrderInfo formData={formData} />
          </div>
          <p className="mt-5 ms-1"> Vận chuyển</p>
          <div
            className={`${style.shippingMethod}   form-control active-input mb-5`}
          >
            <div className="row">
              <div className="col-4 ">Giao hàng tiêu chuẩn</div>
              <div className="col-5"> </div>
              <div className="col-2"> {shippingValue.toLocaleString('vi-VN')} đ</div>
            </div>
          </div>
          <div className="row mb-4  w-100 mx-auto  ">
            <Link
              to="/checkout"
              className={` col-lg-6  col-md-6 col-sm-12  col-12  mt-2 mb-3  mt-4 ${style.returnLink} text-decoration-none `}
            >
              Chỉnh sửa thông tin
            </Link>
            {!showBtnSpinner ? (
              <button
                className={`${style.orderbtn} col-lg-6  col-md-6 col-sm-12  col-12  btn  h-100  ws-100 me-0 `}
                onClick={() => {
                  setShowWarning(true);
                }}
                disabled={isAddingOrder}
              >
                {buttonText}
              </button>
            ) : (
              <button
                className={`${style.orderbtn} col-lg-6  col-md-6 col-sm-12  col-12  btn  h-100  ws-100 me-0 `}
                onClick={() => {
                  setShowWarning(true);
                }}
                disabled={isAddingOrder}
              >
                {buttonText}
                <div className="spinner-border spinner-border-sm"></div>
              </button>
            )}{" "}
          </div>
          <hr className="border" />
          <small className={`${style.gray} mt-2`}>
            * Miễn phí vận chuyển với các đơn hàng có giá trị lớn hơn 1.000.000đ
          </small>
        </div>
      </div>

      {showWarning && (
        <ConfirmPopup
          msg={"Bạn chắc chắn muốn đặt hàng?"}
          onConfirm={() => {
            onConfirmClick();
            setIsAddingOrder(true);
          }}
          onCancel={() => {
            setShowWarning(false);
            setIsAddingOrder(false);
          }}
        />
      )}
    </div>
  ) : (
    <Spinner />
  );
}
