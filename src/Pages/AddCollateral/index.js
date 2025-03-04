import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined, RightOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Space, Input, Select, Form, Spin, Modal } from 'antd';
import { useState, useEffect } from "react";
import CurrencyInput from 'react-currency-input-field';
import styles from './AddCollateral.module.css';

const { Option } = Select;
const { TextArea } = Input;

const AddCollateral = () => {

    const [loading, setLoading] = useState(true);

    const [assetData, setAssetData] = useState({});

    const [locations, setLocations] = useState([]);  // Lưu toàn bộ dữ liệu tỉnh/thành, quận/huyện, phường/xã
    const [provinces, setProvinces] = useState([]);  // Danh sách tỉnh/thành phố
    const [districts, setDistricts] = useState([]);  // Danh sách quận/huyện (lọc theo tỉnh)
    const [wards, setWards] = useState([]);          // Danh sách phường/xã (lọc theo huyện)

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const navigate = useNavigate();

    // lấy API tỉnh thành và lưu vào localStorage 
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

    const handleProvinceOfficialChange = (provinceId) => {
        const province = locations.find(item => item.id === provinceId);
        setSelectedProvince(provinceId);
        setSelectedDistrict(null); // Reset quận/huyện
        setWards([]); // Reset danh sách xã
        const filteredDistricts = province?.data2 || [];
        setDistricts(filteredDistricts);
        setAssetData((prev) => ({
            ...prev,
            provinceNameOfficial: province?.name || '',
            districtNameOfficial: '',
            townNameOfficial: ''
        }));
    };
    
    const handleDistrictOfficialChange = (districtId) => {
        const district = districts.find(item => item.id === districtId);
        setSelectedDistrict(districtId);
        const filteredWards = district?.data3 || [];
        setWards(filteredWards);
        setAssetData((prev) => ({
            ...prev,
            districtNameOfficial: district?.name || '',
            townNameOfficial: ''
        }));
    };
    
    const handleWardOfficialChange = (wardId) => {
        const ward = wards.find(item => item.id === wardId);
        setAssetData((prev) => ({
            ...prev,
            townNameOfficial: ward?.name || ''
        }));
    };
    
    const handleProvinceActualChange = (provinceId) => {
        const province = locations.find(item => item.id === provinceId);
        setSelectedProvince(provinceId);
        setSelectedDistrict(null); // Reset quận/huyện
        setWards([]); // Reset danh sách xã
        const filteredDistricts = province?.data2 || [];
        setDistricts(filteredDistricts);
        setAssetData((prev) => ({
            ...prev,
            provinceNameActual: province?.name || '',
            districtNameActual: '',
            townNameActual: ''
        }));
    };
    
    const handleDistrictActualChange = (districtId) => {
        const district = districts.find(item => item.id === districtId);
        setSelectedDistrict(districtId);
        const filteredWards = district?.data3 || [];
        setWards(filteredWards);
        setAssetData((prev) => ({
            ...prev,
            districtNameActual: district?.name || '',
            townNameActual: ''
        }));
    };
    
    const handleWardActualChange = (wardId) => {
        const ward = wards.find(item => item.id === wardId);
        setAssetData((prev) => ({
            ...prev,
            townNameActual: ward?.name || ''
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssetData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTrimOnBlur = (e) => {
        const { name, value } = e.target;
        setAssetData((prev) => ({
            ...prev,
            // Loại bỏ khoảng trắng đầu & cuối khi và null nếu là giá trị '' mất focus
            [name]: value.trim() === "" ? null : value.trim(), 
        }));
    };

    const showModal = (type) => {
        Modal[type]({
            title: type === 'success' ? 'thành công' : 'thất bại',
            content: type === 'success' ? 'Lưu thành công' : 'đã có lỗi xảy ra. Lưu thất bại',
            onOk() { },
            onCancel() { },
        });
        setTimeout(() => {
            Modal.destroyAll();
        }, 2000)
    };

    const handleSave = async () => {
        try {
            const addData = { ...assetData };
    
            // Bóc tách giá trị nếu có dấu phẩy
            if (addData.addressHouseNumberOfficial.includes(',')) {
                const [streetNameOfficial, ...rest] = addData.addressHouseNumberOfficial.split(',');
                addData.streetNameOfficial = streetNameOfficial.trim();
                addData.addressHouseNumberOfficial = rest.join(',').trim();
            } else {
                addData.streetNameOfficial = '';
                addData.addressHouseNumberOfficial = addData.addressHouseNumberOfficial.trim();
            }
    
            if (addData.addressHouseNumberActual.includes(',')) {
                const [streetNameActual, ...rest] = addData.addressHouseNumberActual.split(',');
                addData.streetNameActual = streetNameActual.trim();
                addData.addressHouseNumberActual = rest.join(',').trim();
            } else {
                addData.streetNameActual = '';
                addData.addressHouseNumberActual = addData.addressHouseNumberActual.trim();
            }
    
            const response = await fetch('http://192.168.1.163:8080/collateral/create-or-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addData)
            });
    
            if (response.ok) {
                showModal('success');
                setAssetData({}); // Đặt lại trạng thái assetData về giá trị ban đầu
            } else {
                showModal('error');
            }
        } catch (error) {
            console.error("Error saving asset detail:", error);
            showModal('error');
        }
    };

    const handleCancel = () => {
        navigate('/AssetManagement');
    };

    return (
        <div>
            <Spin className={styles.loading} spinning={loading}></Spin>
            <div className={styles.header}>
                <nav>
                    <ul className={styles.nav}>
                        <li><HomeOutlined style={{ fontSize: 20, marginTop: 3 }} /></li>
                        <li><Link to="/">Trang chủ <RightOutlined /></Link></li>
                        <li><Link to="/AssetManagement">Quản lý tài sản <RightOutlined /></Link></li>
                        <li><Link to={`/addCollateral`}>Thêm mới</Link></li>
                    </ul>
                </nav>
            </div>
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
                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin cơ bản</span>}
                    size="small"
                >
                    <div className={styles.basicInfor}>
                        <div>
                            <Form.Item
                                label="Mã tài sản"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="number"
                                    className={styles.noSpinner}
                                    name="code"
                                    value={assetData.code || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Mã chi nhánh"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="number"
                                    className={styles.noSpinner}
                                    name="maChiNhanh"
                                    value={assetData.maChiNhanh || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Chi nhánh"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="organizationValuationName"
                                    value={assetData.organizationValuationName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Phòng quản lý"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="phongQuanLy"
                                    value={assetData.phongQuanLy || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Cán bộ định giá gần nhất"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="canBoDinhGia"
                                    value={assetData.canBoDinhGia || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item
                                label="CIF khách hàng vay"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="number"
                                    className={styles.noSpinner}
                                    name="customerCIF"
                                    value={assetData.customerCIF || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tên khách hàng vay"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="customerName"
                                    value={assetData.customerName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                label="CIF bên đảm bảo"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="number"
                                    className={styles.noSpinner}
                                    name="ensureCIF"
                                    value={assetData.ensureCIF || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tên chủ tài sản"
                                className={styles.formItem}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="ownerName"
                                    value={assetData.ownerName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin bổ sung</span>}
                    size="small"
                >
                    <div className={styles.additionalInfor}>
                        <div>
                            <Form.Item
                                className={styles.formItem}
                                label="Nơi đăng ký GDBĐ"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="noiDangKyGDBD"
                                    value={assetData.noiDangKyGDBD || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Nơi công chứng"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="noiCongChung"
                                    value={assetData.noiCongChung || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Tỉnh/ Thành phố"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Select
                                    placeholder="Tỉnh/ Thành phố"
                                    onChange={handleProvinceOfficialChange}
                                    allowClear
                                >
                                    {provinces.map(province => (
                                        <Option key={province.id} value={province.id}>{province.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Quận/ Huyện"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Select
                                    placeholder="Quận/ Huyện"
                                    onChange={handleDistrictOfficialChange}
                                    allowClear
                                    disabled={!selectedProvince}
                                >
                                    {districts.map((district) => (
                                        <Option key={district.id} value={district.id}>{district.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Phường/ Xã"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Select
                                    placeholder="Phường/ Xã"
                                    onChange={handleWardOfficialChange}
                                    allowClear
                                    disabled={!selectedDistrict}
                                >
                                    {wards.map((ward) => (
                                        <Option key={ward.id} value={ward.id}>{ward.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Số nhà"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="addressHouseNumberOfficial"
                                    placeholder="Nhập tên đường, số nhà. VD: Lê Đức Thọ, 63/57/23..."
                                    value={assetData.addressHouseNumberOfficial || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Tên pháp lý dự án theo GCN:"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="projectNameOfficial"
                                    value={assetData.projectNameOfficial || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item
                                className={styles.formItem}
                                label="Tình trạng tài sản"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="assetStateName"
                                    value={assetData.assetStateName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Tính chất pháp lý"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="legalStateName"
                                    value={assetData.legalStateName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Tỉnh/ Thành phố thực tế"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Select
                                    placeholder="Tỉnh/ Thành phố"
                                    onChange={handleProvinceActualChange}
                                    allowClear
                                >
                                    {provinces.map(province => (
                                        <Option key={province.id} value={province.id}>{province.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Quận/ Huyện thực tế"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Select
                                    placeholder="Quận/ Huyện"
                                    onChange={handleDistrictActualChange}
                                    allowClear
                                    disabled={!selectedProvince}
                                >
                                    {districts.map((district) => (
                                        <Option key={district.id} value={district.id}>{district.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Phường/ Xã thực tế"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Select
                                    placeholder="Phường/ Xã"
                                    onChange={handleWardActualChange}
                                    allowClear
                                    disabled={!selectedDistrict}
                                >
                                    {wards.map((ward) => (
                                        <Option key={ward.id} value={ward.id}>{ward.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Số nhà thực tế"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="addressHouseNumberActual"
                                    placeholder="Nhập tên đường, số nhà. VD: Lê Đức Thọ, 63/57/23..."
                                    value={assetData.addressHouseNumberActual || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Tên thương mại dự án thực tế"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="projectNameActual"
                                    value={assetData.projectNameActual || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin chi tiết TSĐB</span>}
                    size="small">
                    <div className={styles.containerDetailInfor}>
                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Số GCN"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="certificateNo"
                                    value={assetData.certificateNo || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Mặt tiền tiếp giáp"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="frontageTypeName"
                                    value={assetData.frontageTypeName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>
                        <div className={styles.locationDescription}>

                            <div className={styles.grid2}>
                                <Form.Item
                                    className={styles.formItem}
                                    label="Độ rộng mặt ngõ/ hẻm/ đường nội bộ nhỏ nhất(m)"
                                    colon={false}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    labelAlign="left"
                                    labelWrap={true}
                                >
                                    <Input
                                        type="number"
                                        className={styles.noSpinner}
                                        name="landWidthMin"
                                        value={assetData.landWidthMin || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleTrimOnBlur}
                                        suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                    />
                                </Form.Item>
                                <Form.Item
                                    className={styles.formItem}
                                    label="Số mặt tiếp giáp"
                                    colon={false}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    labelAlign="left"
                                    labelWrap={true}
                                >
                                    <Input
                                        type="number"
                                        className={styles.noSpinner}
                                        name="numberOfContiguousStreet"
                                        value={assetData.numberOfContiguousStreet || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleTrimOnBlur}
                                        suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                    />
                                </Form.Item>
                            </div>

                            <div className={styles.grid3}>
                                <Form.Item
                                    className={styles.formItem}
                                    label="Loại đường tiếp giáp"
                                    colon={false}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 15 }}
                                    labelAlign="left"
                                    labelWrap={true}
                                >
                                    <Input
                                        style={{ marginLeft: 12 }}
                                        type="text"
                                        name="contiguousStreetTypeName"
                                        value={assetData.contiguousStreetTypeName || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleTrimOnBlur}
                                        suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                    />
                                </Form.Item>
                                <Form.Item
                                    className={styles.formItem}
                                    label="Kích thước chiều rộng(m)"
                                    colon={false}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 15 }}
                                    labelAlign="left"
                                    labelWrap={true}
                                >
                                    <Input
                                        type="number"
                                        className={styles.noSpinner}
                                        name="width"
                                        value={assetData.width || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleTrimOnBlur}
                                        suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                    />
                                </Form.Item>
                                <Form.Item
                                    className={styles.formItem}
                                    label="Kích thước chiều dài(m)"
                                    colon={false}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 15 }}
                                    labelAlign="left"
                                    labelWrap={true}
                                >
                                    <Input
                                        type="number"
                                        className={styles.noSpinner}
                                        name="length"
                                        value={assetData.length || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleTrimOnBlur}
                                        suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Diện tích sử dụng riêng theo GCN(m2)"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="number"
                                    className={styles.noSpinner}
                                    name="landAreaPrivate"
                                    value={assetData.landAreaPrivate || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Tổng giá trị"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <CurrencyInput
                                    type="text"
                                    className={`${styles.currencyInput} ${styles.noSpinner}`}
                                    name="totalValue"
                                    decimalsLimit={2}
                                    value={assetData.totalValue || ''}
                                    onValueChange={(value) => handleInputChange({ target: { name: 'totalValue', value } })}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Mục đích sử dụng"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="infactPurposeName"
                                    value={assetData.infactPurposeName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem} label="Thời hạn sử dụng"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="useDuration"
                                    value={assetData.useDuration || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem} label="Diện tích (m2)"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="number"
                                    className={styles.noSpinner}
                                    name="purposeArea"
                                    value={assetData.purposeArea || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>

                            <Form.Item
                                className={styles.formItem}
                                label="Diện tích tính giá trị (m2)"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="number"
                                    className={styles.noSpinner}
                                    name="constructionValuationArea"
                                    value={assetData.constructionValuationArea || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Đơn giá (đ/m2)"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <CurrencyInput
                                    type="text"
                                    className={`${styles.currencyInput} ${styles.noSpinner}`}
                                    name="unitPricePurpose"
                                    decimalsLimit={2}
                                    value={assetData.unitPricePurpose || ''}
                                    onValueChange={(value) => handleInputChange({ target: { name: 'unitPricePurpose', value } })}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Loại công trình"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="constructionTypeName"
                                    value={assetData.constructionTypeName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Tên công trình"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="constructionName"
                                    value={assetData.constructionName || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Diện tích sàn CTXD (m2)"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="number"
                                    className={styles.noSpinner}
                                    name="constructionArea"
                                    value={assetData.constructionArea || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>

                    </div>
                </Card>

                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin chi tiết TSĐB</span>}
                    size="small">
                    <div className={styles.valuationResult}>
                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Ngày thông báo kết quả định giá"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="valuationDTG"
                                    value={assetData.valuationDTG || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Lý do không nhập thông tin"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="noInformationReason"
                                    value={assetData.noInformationReason || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                        </div>
                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Kinh độ"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="longitude"
                                    value={assetData.longitude || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Vĩ độ"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="latitude"
                                    value={assetData.latitude || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                    suffix={<span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                                />
                            </Form.Item>
                        </div>
                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Tình trạng hồ sơ trên CLIM"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="profileCLIMStatus"
                                    value={assetData.profileCLIMStatus || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem}
                                label="Chi tiết hồ sơ đã scan trên CLIM"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input
                                    type="text"
                                    name="scannedCLIMStatus"
                                    value={assetData.scannedCLIMStatus || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                        </div>
                        <div className={styles.grid2}>
                            <Form.Item
                                className={styles.formItem}
                                label="Ghi chú"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <TextArea
                                    name="note"
                                    value={assetData.note || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleTrimOnBlur}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Card>
            </Space>
        </div>
    )
};

export default AddCollateral;