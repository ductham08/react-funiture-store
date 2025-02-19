import styles from "../../pages/about/about.module.css";

export default function WhatTell() {
  return (
    <div className={`${styles.thecontent} container`}>
      <h1 className={`pt-5`}> Khách hàng của chúng tôi nói gì</h1>
      <p className={`pb-3 pt-5`}>
        "Gần đây tôi đã mua một chiếc ghế sofa từ Comfy và tôi không thể hạnh phúc hơn với kinh nghiệm của mình. Quá trình đặt hàng trực tuyến rất dễ dàng và không căng thẳng, và nhóm dịch vụ khách hàng cực kỳ hữu ích khi tôi có một số câu hỏi về giao hàng. Khi ghế sofa đến, tôi đã bị thổi bay bởi sự thoải mái như thế nào. Những chiếc đệm rất sang trọng và ấm cúng, và vải mềm khi chạm vào. Bây giờ nó trở thành địa điểm yêu thích của tôi để thư giãn và thư giãn vào cuối ngày. Tôi đánh giá cao sự thoải mái cho bất cứ ai đang tìm kiếm đồ nội thất sành điệu và thoải mái"
      </p>
      <h5>Anh Hải</h5>
      <div>
        <h6 className="mb-4">Cầu Giấy - Hà Nội</h6>
      </div>
    </div>
  );
}
