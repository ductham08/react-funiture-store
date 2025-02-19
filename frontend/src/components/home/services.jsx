// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-regular-svg-icons";

// style
import styles from "./../../pages/home/home.module.css"

const Services = () => {
  return (
    <div className="container">
      <div className={`row ${styles.services}`}>
        <div className={`col-sm-12 col-md-4 mb-md-0 mb-4 col-lg-4 text-center ${styles.item}`}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
          <h3>Thanh toán linh hoạt & dễ dàng</h3>
          <p>Thông tin thanh toán của bạn luôn được chúng tôi bảo mật ở mức độ cao nhất</p>
        </div>
        <div className={`col-sm-12 col-md-4 mb-md-0 mb-4 col-lg-4 text-center ${styles.item}`}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faCube} />
          </div>
          <h3>Miễn phí vận chuyển tận nơi</h3>
          <p>Đối với mọi đơn hàng giá trị trên 5.000.000đ</p>
        </div>

        <div className={`col-sm-12 col-md-4 col-lg-4 text-center ${styles.item}`}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faRefresh} />
          </div>
          <h3>Hoàn tiền trong 30 ngày</h3>
          <p>Chúng tôi sẵn sàng hoàn tiền lại cho bạn trong vòng 30 ngày nếu sản phẩm gặp bất cứ lỗi nào từ nhà sản xuất</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
