import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export default function TabsContainer() {
  return (
    <div className="tabsContainer mt-0">
      <Tabs
        defaultActiveKey="History"
        id="uncontrolled-tab-example"
        className="mb-3 Tabs"
        transition={true}
        fill
      >
        <Tab eventKey="History" title="Quá trình">
          <p className="mb-2">
            Công ty chúng tôi được thành lập vào năm <b>2019</b> bởi một nhóm các nhà thiết kế trẻ, những người đam mê tạo ra đồ nội thất hiện đại, giá cả phải chăng. Họ bắt đầu với một dòng nhỏ đồ nội thất tối giản, bao gồm bàn, ghế và ghế sofa, nhanh chóng trở nên phổ biến trong những người đam mê thiết kế.
          </p>
          <p className="mb-2">
            Trong năm<b> 2020</b>, chúng tôi đã ra mắt một cửa hàng trực tuyến và bắt đầu vận chuyển đồ nội thất của chúng tôi trên toàn thế giới. Chúng tôi cũng đã mở rộng dòng sản phẩm của mình để bao gồm các mặt hàng trang trí nhà, chẳng hạn như nghệ thuật treo tường và ánh sáng, giúp thu hút nhiều đối tượng hơn.
          </p>
          <p className="mb-0">
            <b>Hiện tại</b>, công ty chúng tôi tiếp tục phát triển và phát triển, nhờ cam kết của chúng tôi về đổi mới, khả năng chi trả và tính bền vững. Chúng tôi vẫn dành riêng để cung cấp cho khách hàng của chúng tôi đồ nội thất đẹp, chức năng giúp tăng cường ngôi nhà và cuộc sống của họ, đồng thời tạo ra tác động tích cực đến môi trường.
          </p>
        </Tab>
        <Tab eventKey="Mission" title="Nhiệm vụ">
          <p className="mb-2">
            Nhiệm vụ của chúng tôi là kết hợp thiết kế đẹp với sự khéo léo chất lượng cao, đồng thời giảm thiểu tác động của chúng tôi đối với môi trường. Để đạt được điều này, chúng tôi nắm lấy các giá trị cốt lõi sau:
          </p>
          <p className="mb-2">
            <b>Đổi mới: </b>Chúng tôi liên tục đẩy các ranh giới của thiết kế và sản xuất, sử dụng công nghệ và sáng tạo để tạo ra đồ nội thất vừa chức năng vừa đẹp.
          </p>
          <p className="mb-2">
            <b>Chất lượng: </b>Chúng tôi tin rằng đồ nội thất chất lượng cao, phong cách nên có thể truy cập được cho mọi người. Đó là lý do tại sao chúng tôi cố gắng giữ giá của chúng tôi giá cả phải chăng, mà không ảnh hưởng đến chất lượng hoặc thiết kế.
          </p>
          <p className="mb-0">
            <b>Sự hài lòng của khách hàng: </b>Chúng tôi ưu tiên các nhu cầu và sở thích của khách hàng và cố gắng tạo ra đồ nội thất phù hợp với phong cách và nhu cầu độc đáo của họ.
          </p>
        </Tab>
        <Tab eventKey="Design" title="Thiết kế">
          <p className="mb-2">
          Tại công ty của chúng tôi, chúng tôi tin rằng thiết kế tuyệt vời nên vừa đẹp vừa chức năng. Cách tiếp cận của chúng tôi để thiết kế đồ nội thất tập trung vào các nguyên tắc sau:
          </p>
          <p className="mb-2">
            <b>Đơn giản: </b>Chúng tôi tin rằng đồ nội thất nên đơn giản và không lộn xộn, với các đường nét sạch sẽ và trang trí tối thiểu. Chúng tôi cố gắng tạo ra đồ nội thất vừa vượt thời gian vừa đương đại, để nó có thể phù hợp liền mạch vào bất kỳ môi trường nhà hoặc văn phòng nào.
          </p>
          <p className="mb-2">
            <b>Chức năng: </b>Chúng tôi thiết kế đồ nội thất với người dùng trong tâm trí, ưu tiên chức năng và sự thoải mái. Chúng tôi tin rằng đồ nội thất không chỉ trông tuyệt vời mà còn phục vụ mục đích và làm cho cuộc sống của mọi người dễ dàng và thoải mái hơn.
          </p>
          <p className="mb-0">
            <b>Trang trí: </b>Chúng tôi hiểu rằng hương vị và phong cách của mỗi người là duy nhất và chúng tôi cung cấp các tùy chọn tùy chỉnh để cho phép khách hàng của chúng tôi tạo ra đồ nội thất thực sự phản ánh sở thích và nhu cầu cá nhân của họ.
          </p>
        </Tab>
      </Tabs>
    </div>
  );
}
