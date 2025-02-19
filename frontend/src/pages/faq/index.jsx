import styles from "./faq.module.css";
import { list } from "./paragraphs";

const FAQ = () => {
  return (
    <div className={`${styles.mainFaqContainer} container my-5  `}>
      <div className={`${styles.faqcontainer}  row my-5   w-100 m-s-5`}>
        <div
          className={`${styles.smallcolumn}  mt-5 col-md-6 col-sm-12 col-lg-4  
          `}
        >
          <h1> Câu hỏi thường gặp</h1>
          <p>Các trang FAQ tiếp tục là một lĩnh vực ưu tiên cho các chuyên gia tiếp thị kỹ thuật số và SEO. Một trang FAQ là một trong những cách đơn giản nhất để cải thiện trang web của bạn và giúp khách truy cập và người dùng trang web. Phần Câu hỏi thường gặp của bạn nên được xem là một nguồn giá trị mở rộng liên tục được cung cấp cho khán giả của bạn.</p>
          <div className={`${styles.listoquestion}   mb-5`}>
            <a href="#faqpara3">Các đơn hàng lớn </a>
            <a href="#faqpara5">Lắp ráp & Vận chuyển</a>
            <a href="#faqpara6">Giới hạn </a>
            <a href="#faqpara7">Ưu tiên</a>
            <a href="#faqpara8">Ý tưởng</a>
            <a href="#faqpara9">Thân thiện với môi trường</a>
          </div>
        </div>

        <div
          className={`${styles.largecolumn}  col-md-6 col-sm-12 col-lg-8     mt-5  `}
        >
          {list.map((item, index) => (
            <div
              key={item.id}
              className={index > 0 ? "pt-5" : ""}
              id={`faqpara${item.id}`}
            >
              <h2 className={`text-uppercase h6 ${index > 0 ? "pt-3" : ""}`}>
                {" "}
                {item.id}- {item.heading}{" "}
              </h2>
              <p className="mb-0"> {item.content} </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
