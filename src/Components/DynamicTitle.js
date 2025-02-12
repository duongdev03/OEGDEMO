import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLE_MAP = {
    "/": "Trang Chủ",
    "/AssetManagement": "Quản lý tài sản đảm bảo",
    "/AssetDetail": "Thông tin chi tiết",
    "/addCollateral": "Thêm tài sản đảm bảo",
};

const DynamicTitle = () => {
    const location = useLocation();

    useEffect(() => {
        let title = "My Website";
        if (location.pathname.startsWith("/AssetDetail")) {
            title = "Thông tin chi tiết";
        } else {
            title = TITLE_MAP[location.pathname] || title;
        }
        document.title = title;
    }, [location]);

    return null;
};

export default DynamicTitle;
