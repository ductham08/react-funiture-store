import { Outlet, useLocation } from "react-router-dom";

// components
import PageHeader from "../common/pageHeader";

const LayoutWithPageHeader = () => {
  const location = useLocation();
  
  let pathName ;
  switch (location.pathname.slice(1)) {
    case 'about':
      pathName = "Giới thiệu"
      break;
    case 'shop':
      pathName = "Cửa hàng"
      break;
    case 'contact':
      pathName = "Liên hệ"
      break;
    case 'faq':
      pathName = "FAQ"
      break;
    case 'search':
      pathName = "Tìm kiếm"
      break;
  
    default:
      break;
  }

  return (
    <>
      <PageHeader path={pathName} />
      <Outlet />
    </>
  );
};

export default LayoutWithPageHeader;
