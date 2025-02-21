import { Link } from "react-router-dom";
import style from "../../pages/checkout/checkout.module.css";

const OrderInfo = ({ formData }) => {
  return (
    <div className={`${style.orderInfo} row mr-5 `}>
      <div className={`${style.first} row mr-5 `}>
        <div className={`${style.gray} col-3 mt-3`}>Điện thoại</div>
        <div className="col-6 mt-3"> {formData?.phone}</div>
        <div className="col-3 mt-3">
          <Link to="/checkout " className={`${style.linkclass} `}>
            {" "}
            Thay đổi{" "}
          </Link>
        </div>
      </div>
      <hr className="border mb-2 mt-3" />
      <div className={`${style.last} row mb-2`}>
        <div className={`${style.gray} col-3`}>Địa chỉ nhận</div>
        <div className="col-6">
          {" "}
          {formData?.address?.apartment}, {formData?.address?.street}, {formData?.address?.district}, {formData?.address?.city}
        </div>
        <div className="col-3">
          <Link to="/checkout" className={`${style.linkclass}`}>
            {" "}
            Thay đổi{" "}
          </Link>
        </div>{" "}
      </div>
    </div>
  );
};

export default OrderInfo;
