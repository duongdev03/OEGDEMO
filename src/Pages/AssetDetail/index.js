import { Link, useParams } from "react-router-dom";
import { HomeOutlined, RightOutlined, EditOutlined, HistoryOutlined, SyncOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Card, Space, Input, Form, Modal, Select, Spin } from 'antd';
import { useState, useEffect } from "react";
import CurrencyInput from 'react-currency-input-field';
import styles from './DetailAndUpdate.module.css';

const { Option } = Select;
const { TextArea } = Input;

const AssetDetail = () => {
    const { code } = useParams();

    const [assetData, setAssetData] = useState({});
    const [initialAssetData, setInitialAssetData] = useState(null);
    const [isChanged, setIsChanged] = useState(false);

    const [locations, setLocations] = useState([]);  // Lưu toàn bộ dữ liệu tỉnh/thành, quận/huyện, phường/xã
    const [provinces, setProvinces] = useState([]);  // Danh sách tỉnh/thành phố
    const [districts, setDistricts] = useState([]);  // Danh sách quận/huyện (lọc theo tỉnh)
    const [wards, setWards] = useState([]);          // Danh sách phường/xã (lọc theo huyện)
    const [loading, setLoading] = useState(true);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [createdDate, setCreatedDate] = useState('');
    const [modifiedDate, setModifiedDate] = useState('');

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


    useEffect(() => {
        const fetchAssetDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://192.168.1.163:8080/collateral/${code}`);
                const data = await response.json();

                const assetData = {
                    code: data.code,
                    maChiNhanh: data.maChiNhanh || '',
                    organizationValuationName: data.organizationValuationName || '',
                    phongQuanLy: data.phongQuanLy || '',
                    canBoDinhGia: data.canBoDinhGia || '',
                    customerCIF: data.customerCIF || '',
                    customerName: data.customerName || '',
                    ensureCIF: data.ensureCIF || '',
                    ownerName: data.ownerName || '',
                    noiDangKyGDBD: data.noiDangKyGDBD || '',
                    noiCongChung: data.noiCongChung || '',
                    provinceNameOfficial: data.provinceNameOfficial || '',
                    districtNameOfficial: data.districtNameOfficial || '',
                    townNameOfficial: data.townNameOfficial || '',
                    streetNameOfficial: data.streetNameOfficial || '',
                    addressHouseNumberOfficial: data.addressHouseNumberOfficial || '',
                    projectNameOfficial: data.projectNameOfficial || '',
                    assetStateName: data.assetStateName || '',
                    legalStateName: data.legalStateName || '',
                    provinceNameActual: data.provinceNameActual || '',
                    districtNameActual: data.districtNameActual || '',
                    townNameActual: data.townNameActual || '',
                    streetNameActual: data.streetNameActual || '',
                    addressHouseNumberActual: data.addressHouseNumberActual || '',
                    projectNameActual: data.projectNameActual || '',
                    certificateNo: data.certificateNo || '',
                    frontageTypeName: data.frontageTypeName || '',
                    landWidthMin: data.landWidthMin || '',
                    numberOfContiguousStreet: data.numberOfContiguousStreet || '',
                    contiguousStreetTypeName: data.contiguousStreetTypeName || '',
                    width: data.width || '',
                    length: data.length || '',
                    landAreaPrivate: data.landAreaPrivate || '',
                    totalValue: data.totalValue || '',
                    infactPurposeName: data.infactPurposeName || '',
                    useDuration: data.useDuration || '',
                    purposeArea: data.purposeArea || '',
                    constructionValuationArea: data.constructionValuationArea || '',
                    unitPricePurpose: data.unitPricePurpose || '',
                    constructionTypeName: data.constructionTypeName || '',
                    constructionName: data.constructionName || '',
                    constructionArea: data.constructionArea || '',
                    valuationDTG: data.valuationDTG || '',
                    longitude: data.longitude || '',
                    latitude: data.latitude || '',
                    note: data.note || '',
                    noInformationReason: data.noInformationReason || '',
                    profileCLIMStatus: data.profileCLIMStatus || '',
                    scannedCLIMStatus: data.scannedCLIMStatus || '',

                    fullAddressOfficial: data.streetNameOfficial + ', ' + data.addressHouseNumberOfficial || '',
                    fullAddressActual: data.streetNameActual + ', ' + data.addressHouseNumberActual || ''
                }



                setAssetData(assetData);
                setInitialAssetData(assetData);

                setCreatedDate(data.createdDate);
                setModifiedDate(data.modifiedDate);

                const initialProvince = locations.find(item => item.name === assetData.provinceNameOfficial);
                if (initialProvince) {
                    setSelectedProvince(initialProvince.id);
                    const filteredDistricts = initialProvince.data2 || [];
                    setDistricts(filteredDistricts);
                    const initialDistrict = filteredDistricts.find(item => item.name === assetData.districtNameOfficial);
                    if (initialDistrict) {
                        setSelectedDistrict(initialDistrict.id);
                        const filteredWards = initialDistrict.data3 || [];
                        setWards(filteredWards);
                    }
                }

            }
            catch (error) {
                console.error("Error fetching asset detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssetDetail();
    }, [code, locations]);

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setAssetData((prev) => {
            const updatedData = {
                ...prev,
                [name]: value
            };
            setIsChanged(JSON.stringify(updatedData) !== JSON.stringify(initialAssetData));
            return updatedData;
        });
    };

    const showModal = (type) => {
        Modal[type]({
            title: type === 'success' ? 'thành công' : 'thất bại',
            content: type === 'success' ? 'Cập nhật thành công' : 'Có lỗi xảy ra khi cập nhật',
            onOk() { },
            onCancel() { },
        });
        setTimeout(() => {
            Modal.destroyAll();
        }, 2000)
    };

    const getChangedFields = (currentData, initialData) => {
        const changedFields = {};
        for (const key in currentData) {
            if (currentData[key] !== initialData[key]) {
                changedFields[key] = currentData[key];
            }
        }
        return changedFields;
    };

    const handleUpdate = async () => {
        try {
            const updatedData = { ...assetData };

            // Bóc tách giá trị nếu có dấu phẩy
            if (updatedData.fullAddressOfficial.includes(',')) {
                const [streetNameOfficial, ...rest] = updatedData.fullAddressOfficial.split(',');
                updatedData.streetNameOfficial = streetNameOfficial.trim();
                updatedData.addressHouseNumberOfficial = rest.join(',').trim();
            } else {
                updatedData.streetNameOfficial = '';
                updatedData.addressHouseNumberOfficial = updatedData.fullAddressOfficial.trim();
            }

            if (updatedData.fullAddressActual.includes(',')) {
                const [streetNameActual, ...rest] = updatedData.fullAddressActual.split(',');
                updatedData.streetNameActual = streetNameActual.trim();
                updatedData.addressHouseNumberActual = rest.join(',').trim();
            } else {
                updatedData.streetNameActual = '';
                updatedData.addressHouseNumberActual = updatedData.fullAddressActual.trim();
            }

            // Xóa các trường fullAddressOfficial và fullAddressActual trước khi gửi
            delete updatedData.fullAddressOfficial;
            delete updatedData.fullAddressActual;

            const changedFields = getChangedFields(updatedData, initialAssetData);
            if (Object.keys(changedFields).length === 0) {
                showModal('error');
                console.error("No fields have been changed.");
                return;
            }

            const raw = JSON.stringify({
                id: assetData.code,
                ...changedFields
            });

            console.log(raw);

            const response = await fetch('http://192.168.1.163:8080/collateral/create-or-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: raw
            });
            if (response.ok) {
                showModal('success');
                // Cập nhật lại giá trị fullAddressOfficial và fullAddressActual trong assetData
                const newInitialAssetData = {
                    ...updatedData,
                    fullAddressOfficial: `${updatedData.streetNameOfficial}, ${updatedData.addressHouseNumberOfficial}`,
                    fullAddressActual: `${updatedData.streetNameActual}, ${updatedData.addressHouseNumberActual}`
                };
                setAssetData(newInitialAssetData);
                setInitialAssetData(newInitialAssetData);
                setIsChanged(false);
            } else {
                showModal('error');
            }
        } catch (error) {
            console.error("Error updating asset detail:", error);
            showModal('error');
        }
    };

    useEffect(() => {
        if (!loading) {
            const infoChanged = JSON.stringify(assetData) !== JSON.stringify(initialAssetData);
            setIsChanged(infoChanged);
        }
    }, [assetData, initialAssetData, loading]);

    const handleReset = () => {
        setAssetData(initialAssetData);
        setIsChanged(false);
    };

    return (
        <div>
            <Spin className={styles.loading} spinning={loading}></Spin>
            <div className={styles.header}>
                <div className={styles.containerNav}>
                    <nav>
                        <ul className={styles.nav}>
                            <li><HomeOutlined style={{ fontSize: 20, marginTop: 3 }} /></li>
                            <li><Link to="/">Trang chủ <RightOutlined /></Link></li>
                            <li><Link to="/AssetManagement">Quản lý tài sản <RightOutlined /></Link></li>
                            <li><Link to={`/AssetDetail/${code}`}>Chi tiết</Link></li>
                        </ul>
                    </nav>
                    <div className={styles.timeUpdate}>
                        <HistoryOutlined /> Ngày tạo: {createdDate} |
                        <SyncOutlined style={{ backgroundColor: '#00CCFF', fontSize: 12, padding: 3, color: '#fff', borderRadius: 3, marginLeft: 5, marginRight: 5 }} />
                        Cập nhật lần cuối: {modifiedDate}
                    </div>
                </div>
                <div className={styles.containerBtn}>
                    <Button
                        className={styles.buttonUpdate}
                        icon={<EditOutlined />}
                        type={isChanged ? "primary" : "default"}
                        disabled={!isChanged}
                        onClick={handleUpdate}>
                        Cập nhật
                    </Button>
                    <Button
                        className={styles.buttonReset}
                        icon={<RollbackOutlined />}
                        type="primary" danger
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
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
                    style={{ margin: 20, marginTop: 150 }}
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
                                <Input type="number" name="code" value={assetData?.code || ''} disabled />
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
                                <Input type="number" className={styles.noSpinner} name="maChiNhanh" value={assetData.maChiNhanh} onChange={handleInfoChange} />
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
                                <Input type="text" name="organizationValuationName" value={assetData.organizationValuationName} onChange={handleInfoChange} />
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
                                <Input type="text" name="phongQuanLy" value={assetData.phongQuanLy} onChange={handleInfoChange} />
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
                                <Input type="text" name="canBoDinhGia" value={assetData.canBoDinhGia} onChange={handleInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="customerCIF" value={assetData.customerCIF} onChange={handleInfoChange} />
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
                                <Input type="text" name="customerName" value={assetData.customerName} onChange={handleInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="ensureCIF" value={assetData.ensureCIF} onChange={handleInfoChange} />
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
                                <Input type="text" name="ownerName" value={assetData.ownerName} onChange={handleInfoChange} />
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
                                <Input type="text" name="noiDangKyGDBD" value={assetData.noiDangKyGDBD} onChange={handleInfoChange} />
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
                                <Input type="text" name="noiCongChung" value={assetData.noiCongChung} onChange={handleInfoChange} />
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
                                    value={assetData.provinceNameOfficial}
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
                                    value={assetData.districtNameOfficial}
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
                                    value={assetData.townNameOfficial}
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
                                    name="fullAddressOfficial"
                                    value={assetData.fullAddressOfficial || ''}
                                    onChange={handleInfoChange} />
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
                                <Input type="text" name="projectNameOfficial" value={assetData.projectNameOfficial} onChange={handleInfoChange} />
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
                                <Input type="text" name="assetStateName" value={assetData.assetStateName} onChange={handleInfoChange} />
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
                                <Input type="text" name="legalStateName" value={assetData.legalStateName} onChange={handleInfoChange} />
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
                                    value={assetData.provinceNameActual}
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
                                    value={assetData.districtNameActual}
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
                                    value={assetData.townNameActual}
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
                                    name="fullAddressActual"
                                    value={assetData.fullAddressActual || ''}
                                    onChange={handleInfoChange} />
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
                                <Input type="text" name="projectNameActual" value={assetData.projectNameActual} onChange={handleInfoChange} />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin chi tiết TSĐB</span>}
                    size="small"
                >
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
                                <Input type="text" name="certificateNo" value={assetData.certificateNo} onChange={handleInfoChange} />
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
                                <Input type="text" name="frontageTypeName" value={assetData.frontageTypeName} onChange={handleInfoChange} />
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
                                    <Input type="number" className={styles.noSpinner} name="landWidthMin" value={assetData.landWidthMin} onChange={handleInfoChange} />
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
                                    <Input type="number" className={styles.noSpinner} name="numberOfContiguousStreet" value={assetData.numberOfContiguousStreet} onChange={handleInfoChange} />
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
                                    <Input style={{ marginLeft: 6 }} type="text" name="contiguousStreetTypeName" value={assetData.contiguousStreetTypeName} onChange={handleInfoChange} />
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
                                    <Input type="number" className={styles.noSpinner} name="width" value={assetData.width} onChange={handleInfoChange} />
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
                                    <Input type="number" className={styles.noSpinner} name="length" value={assetData.length} onChange={handleInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="landAreaPrivate" value={assetData.landAreaPrivate} onChange={handleInfoChange} />
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
                                    value={assetData.totalValue}
                                    decimalsLimit={2}
                                    onValueChange={(value) => handleInfoChange({ target: { name: 'totalValue', value } })}
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
                                <Input type="text" name="infactPurposeName" value={assetData.infactPurposeName} onChange={handleInfoChange} />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem} label="Thời hạn sử dụng"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input type="text" name="useDuration" value={assetData.useDuration} onChange={handleInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="purposeArea" value={assetData.purposeArea} onChange={handleInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="constructionValuationArea" value={assetData.constructionValuationArea} onChange={handleInfoChange} />
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
                                    value={assetData.unitPricePurpose}
                                    decimalsLimit={2}
                                    onValueChange={(value) => handleInfoChange({ target: { name: 'unitPricePurpose', value } })}
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
                                <Input type="text" name="constructionTypeName" value={assetData.constructionTypeName} onChange={handleInfoChange} />
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
                                <Input type="text" name="constructionName" value={assetData.constructionName} onChange={handleInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="constructionArea" value={assetData.constructionArea} onChange={handleInfoChange} />
                            </Form.Item>
                        </div>

                    </div>
                </Card>

                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin chi tiết TSĐB</span>}
                    size="small"
                >
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
                                <Input type="text" name="valuationDTG" value={assetData.valuationDTG} onChange={handleInfoChange} />
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
                                <Input type="text" name="noInformationReason" value={assetData.noInformationReason} onChange={handleInfoChange} />
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
                                <Input type="text" name="longitude" value={assetData.longitude} onChange={handleInfoChange} />
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
                                <Input type="text" name="latitude" value={assetData.latitude} onChange={handleInfoChange} />
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
                                <Input type="text" name="profileCLIMStatus" value={assetData.profileCLIMStatus} onChange={handleInfoChange} />
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
                                <Input type="text" name="scannedCLIMStatus" value={assetData.scannedCLIMStatus} onChange={handleInfoChange} />
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
                                <TextArea name="note" value={assetData.note} onChange={handleInfoChange} />
                            </Form.Item>
                        </div>
                    </div>
                </Card>
            </Space>
        </div>
    )
};

export default AssetDetail;