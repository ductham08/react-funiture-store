import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumbcomponant() {
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/cart" className={`text-decoration-none `}>
              Giỏ hàng
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/checkout" className={`text-decoration-none  `}>
              Thông tin giao hàng
            </Link>
          </li>
          <li className={`breadcrumb-item `} aria-current="page">
            Thanh toán
          </li>
        </ol>
      </nav>
    </>
  );
}
