import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined, RightOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Space, Input, Select, Form, Spin, Modal } from 'antd';
import { useState, useEffect } from "react";
import styles from './AddCollateral.module.css';

const { Option } = Select;

const AddCollateral = () => {
    const [locations, setLocations] = useState([]);  // Lưu toàn bộ dữ liệu tỉnh/thành, quận/huyện, phường/xã
    const [provinces, setProvinces] = useState([]);  // Danh sách tỉnh/thành phố
    const [districts, setDistricts] = useState([]);  // Danh sách quận/huyện (lọc theo tỉnh)
    const [wards, setWards] = useState([]);          // Danh sách phường/xã (lọc theo huyện)
    const [loading, setLoading] = useState(true);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const cachedData = localStorage.getItem("locations");
        if (cachedData) {
            const data = JSON.parse(cachedData);
            setLocations(data);
            setProvinces(data);
            setLoading(false);
        }
        else {
            fetch("https://esgoo.net/api-tinhthanh/4/0.htm")
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Lỗi khi tải dữ liệu từ server: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    if (data && Array.isArray(data.data)) {
                        setLocations(data.data); // Lưu toàn bộ dữ liệu vào state
                        setProvinces(data.data); // Lọc danh sách tỉnh/thành
                        localStorage.setItem("locations", JSON.stringify(data.data)); // Lưu vào localStorage
                    } else {
                        throw new Error("Dữ liệu trả về không hợp lệ");
                    }
                })
                .catch(error => console.error("Lỗi khi tải dữ liệu:", error))
                .finally(() => setLoading(false));
        }
    }, []);

    const handleProvinceChange = (provinceId) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict(null); // Reset quận/huyện
        setWards([]); // Reset danh sách xã
        const filteredDistricts = locations.find(item => item.id === provinceId)?.data2 || [];
        setDistricts(filteredDistricts);
    };

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId);
        setWards([]); // Reset danh sách xã
        const filteredWards = districts.find(item => item.id === districtId)?.data3 || [];
        setWards(filteredWards);
    };

    const showModal = (type) => {
        Modal[type]({
            title: type === 'success' ? 'thành công' : 'thất bại',
            content: type === 'success' ? 'Lưu thành công' : 'đã có lỗi xảy ra. Lưu thất bại',
            onOk() {},
            onCancel() {},
        });
        setTimeout(() => {
            Modal.destroyAll();
        }, 2000)
    };

    const handleSave = () => {
        // Kiểm tra và xác thực dữ liệu đầu vào
        // Gửi dữ liệu đến server hoặc lưu vào localStorage

        const isSuccess = false;
        if (isSuccess) {
            showModal('success');
        } else {
            showModal('error');
        }
    };

    const handleCancel = () => {
        // Đặt lại các trường dữ liệu về giá trị ban đầu

        navigate('/AssetManagement');
    };

    return (
        <div>
            <Spin className={styles.loading} spinning={loading}></Spin>
            <nav>
                <ul className={styles.nav}>
                    <li><Link to="/"><HomeOutlined />Trang chủ <RightOutlined /></Link></li>
                    <li><Link to="/AssetManagement">Quản lý tài sản <RightOutlined /></Link></li>
                    <li><Link to={`/addCollateral`}>Thêm mới</Link></li>
                </ul>
            </nav>
            <div className={styles.title}>
                <h3>Thêm mới tài sản đảm bảo</h3>
                <div className={styles.action}>
                    <Button type="primary" danger icon={<CloseOutlined />} onClick={handleCancel}>Hủy</Button>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Lưu</Button>
                </div>
            </div>
            <Space
                direction="vertical"
                size="middle"
                style={{
                    display: 'flex',
                }}
            >
                <Card style={{ margin: 20 }} title="Thông tin cơ bản" size="small">
                    <div className={styles.basicInfor}>
                        <div>
                            <Form.Item label="Mã tài sản">
                                <Input type="text" name="assetCode" />
                            </Form.Item>
                            <Form.Item label="Mã chi nhánh">
                                <Input type="text" name="brandCode" />
                            </Form.Item>
                            <Form.Item label="Chi nhánh">
                                <Input type="text" name="brandName" />
                            </Form.Item>
                            <Form.Item label="Phòng quản lý">
                                <Input type="text" name="managementRoom" />
                            </Form.Item>
                            <Form.Item label="Cán bộ định giá gần nhất">
                                <Input type="text" name="nearestAppraiser" />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="CIF khách hàng vay">
                                <Input type="text" name="CIFCode" />
                            </Form.Item>
                            <Form.Item label="Tên khách hàng vay">
                                <Input type="text" name="customerName" />
                            </Form.Item>
                            <Form.Item label="CIF bên đảm bảo">
                                <Input type="text" name="CIFGuarantor" />
                            </Form.Item>
                            <Form.Item label="Tên chủ tài sản">
                                <Input type="text" name="ownerName" />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card style={{ margin: 20 }} title="Thông tin bổ sung" size="small">
                    <div className={styles.additionalInfor}>
                        <div>
                            <Form.Item label="Nơi đăng ký GDBĐ">
                                <Input type="text" name="registrationPlace" />
                            </Form.Item>
                            <Form.Item label="Nơi công chứng">
                                <Input type="text" name="notaryPlace" />
                            </Form.Item>
                            <Form.Item label="Tỉnh/ Thành phố">
                                <Select
                                    placeholder="Tỉnh/ Thành phố"
                                    style={{ width: 200 }}
                                    onChange={handleProvinceChange}
                                    allowClear
                                >
                                    {provinces.map(province => (
                                        <Option key={province.id} value={province.id}>{province.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Quận/ Huyện">
                                <Select
                                    placeholder="Quận/ Huyện"
                                    style={{ width: 200 }}
                                    onChange={handleDistrictChange}
                                    allowClear
                                    disabled={!selectedProvince}
                                >
                                    {districts.map((district) => (
                                        <Option key={district.id} value={district.id}>{district.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Phường/ Xã">
                                <Select
                                    placeholder="Phường/ Xã"
                                    style={{ width: 200 }}
                                    onChange={(value) => setSelectedDistrict(value)}
                                    allowClear
                                    disabled={!selectedDistrict}
                                >
                                    {wards.map((ward) => (
                                        <Option key={ward.id} value={ward.id}>{ward.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Số nhà">
                                <Input type="text" name="houseNumber" />
                            </Form.Item>
                            <Form.Item label="Tên pháp lý dự án theo GCN (nếu có)">
                                <Input type="text" name="legalProjectName" />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="Tình trạng tài sản">
                                <Input type="text" name="assetStatus" />
                            </Form.Item>
                            <Form.Item label="Tính chất pháp lý">
                                <Input type="text" name="legalStatus" />
                            </Form.Item>
                            <Form.Item label="Tỉnh/ Thành phố thực tế">
                                <Select
                                    placeholder="Tỉnh/ Thành phố"
                                    style={{ width: 200 }}
                                    onChange={handleProvinceChange}
                                    allowClear
                                >
                                    {provinces.map(province => (
                                        <Option key={province.id} value={province.id}>{province.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Quận/ Huyện thực tế">
                                <Select
                                    placeholder="Quận/ Huyện"
                                    style={{ width: 200 }}
                                    onChange={handleDistrictChange}
                                    allowClear
                                    disabled={!selectedProvince}
                                >
                                    {districts.map((district) => (
                                        <Option key={district.id} value={district.id}>{district.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Phường/ Xã thực tế">
                                <Select
                                    placeholder="Phường/ Xã"
                                    style={{ width: 200 }}
                                    onChange={(value) => setSelectedDistrict(value)}
                                    allowClear
                                    disabled={!selectedDistrict}
                                >
                                    {wards.map((ward) => (
                                        <Option key={ward.id} value={ward.id}>{ward.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Số nhà thực tế">
                                <Input type="text" name="actualHouseNumber" />
                            </Form.Item>
                            <Form.Item label="Tên thương mại dự án thực tế">
                                <Input type="text" name="actualProjectName" />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card style={{ margin: 20 }} title="Thông tin chi tiết TSĐB" size="small">
                    <div className={styles.containerDetailInfor}>
                        <Form.Item label="Số GCN">
                            <Input type="text" name="certificateNumber" />
                        </Form.Item>
                        <Form.Item label="Mặt tiền tiếp giáp">
                            <Input type="text" name="frontage" />
                        </Form.Item>
                        <div className={styles.locationDescription}>
                            <Form.Item label="Độ rộng mặt ngõ/ hẻm/ đường nội bộ nhỏ nhất (m)">
                                <Input type="text" name="alleyWidth" />
                            </Form.Item>
                            <Form.Item label="Số mặt tiếp giáp">
                                <Input type="text" name="numberOfFrontages" />
                            </Form.Item>
                            <Form.Item label="Loại đường tiếp giáp">
                                <Input type="text" name="roadType" />
                            </Form.Item>
                            <Form.Item label="Kích thước chiều rộng(m)">
                                <Input type="text" name="width" />
                            </Form.Item>
                            <Form.Item label="Kích thước chiều dài(m)">
                                <Input type="text" name="length" />
                            </Form.Item>
                        </div>

                        <Form.Item label="Diện tích sử dụng riêng theo GCN(m2)">
                            <Input type="text" name="privateArea" />
                        </Form.Item>
                        <Form.Item label="Tổng giá trị">
                            <Input type="text" name="totalValue" />
                        </Form.Item>
                        <Form.Item label="Mục đích sử dụng">
                            <Input type="text" name="usagePurpose" />
                        </Form.Item>
                        <Form.Item label="Thời hạn sử dụng">
                            <Input type="text" name="usageDuration" />
                        </Form.Item>
                        <Form.Item label="Diện tích (m2)">
                            <Input type="text" name="area" />
                        </Form.Item>
                        <div className={styles.landValue}>
                            <Form.Item label="Diện tích tính giá trị (m2)">
                                <Input type="text" name="valueArea" />
                            </Form.Item>
                            <Form.Item label="Đơn giá (đ/m2)">
                                <Input type="text" name="unitPrice" />
                            </Form.Item>
                        </div>
                        <Form.Item label="Loại công trình">
                            <Select
                                placeholder="Chọn loại công trình"
                                style={{ width: 250 }}
                                allowClear
                            >
                                <Option value="1">Nhà ở riêng lẻ</Option>
                                <Option value="2">Công trình khác</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Tên công trình">
                            <Input type="text" name="constructionName" />
                        </Form.Item>
                        <Form.Item label="Diện tích sàn CTXD (m2)">
                            <Input type="text" name="constructionArea" />
                        </Form.Item>
                    </div>
                </Card>

                <Card style={{ margin: 20 }} title="Thông tin kết quả định giá" size="small">
                    <div className={styles.valuationResult}>
                        <Form.Item label="Ngày thông báo kết quả định giá">
                            <Input type="text" name="valuationDate" />
                        </Form.Item>
                        <div className={styles.coordinates}>
                            <Form.Item label="Kinh độ">
                                <Input type="text" name="longitude" />
                            </Form.Item>
                            <Form.Item label="Vĩ độ">
                                <Input type="text" name="latitude" />
                            </Form.Item>
                        </div>
                        <Form.Item label="Ghi chú">
                            <Input type="text" name="notes" />
                        </Form.Item>
                        <Form.Item label="Lý do không nhập thông tin">
                            <Input type="text" name="noInfoReason" />
                        </Form.Item>
                        <Form.Item label="Tình trạng hồ sơ trên CLIM">
                            <Select
                                placeholder="Tình trạng hồ sơ trên CLIM"
                                style={{ width: 250 }}
                                allowClear
                            >
                                <Option value="1">Đã có đủ hồ sơ</Option>
                                <Option value="2">Thiếu hồ sơ</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Chi tiết hồ sơ đã scan trên CLIM">
                            <Input type="text" name="climDetails" />
                        </Form.Item>
                    </div>
                </Card>
            </Space>
        </div>
    )
};

export default AddCollateral;