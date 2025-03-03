// style
import style from "../../pages/productDetails/productDetails.module.css";

const Price = ({ price, discount }) => {
  return (
    <>
      {discount > 0 && (
        <span className={`color-yellow ${style.discount}`}>
          Giảm tới: ({discount}%)
        </span>
      )}
      {discount > 0 ? (
        <div className="d-flex gap-2 align-items-center">
          <span className="color-yellow fw-semibold">
            {((price - (price * discount) / 100).toFixed(2)).toLocaleString('vi-VN')} đ
          </span>
          <span className="color-old-price text-decoration-line-through">
            {(price.toFixed(2)).toLocaleString('vi-VN')} đ
          </span>
        </div>
      ) : (
        <span className="fw-semibold">{(price.toFixed(2)).toLocaleString('vi-VN')} đ</span>
      )}
    </>
  );
};

export default Price;
