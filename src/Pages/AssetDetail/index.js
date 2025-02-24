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

    const [basicInfo, setBasicInfo] = useState({});
    const [additionalInfo, setAdditionalInfo] = useState({});
    const [detailInfo, setDetailInfo] = useState({});
    const [valuationResult, setValuationResult] = useState({});

    const [initialBasicInfo, setInitialBasicInfo] = useState(null);
    const [initialAdditionalInfo, setInitialAdditionalInfo] = useState(null);
    const [initialDetailInfo, setInitialDetailInfo] = useState(null);
    const [initialValuationResult, setInitialValuationResult] = useState(null);
    const [isChanged, setIsChanged] = useState({
        basicInfo: false,
        additionalInfo: false,
        detailInfo: false,
        valuationResult: false
    });

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
        setSelectedProvince(provinceId);
        setSelectedDistrict(null); // Reset quận/huyện
        setWards([]); // Reset danh sách xã
        const filteredDistricts = locations.find(item => item.id === provinceId)?.data2 || [];
        setDistricts(filteredDistricts);
        setAdditionalInfo((prev) => ({
            ...prev,
            provinceNameOfficial: provinceId,
            districtNameOfficial: null,
            townNameOfficial: null
        }));
    };

    const handleDistrictOfficialChange = (districtId) => {
        setSelectedDistrict(districtId);
        // setWards([]); // Reset danh sách xã
        const filteredWards = districts.find(item => item.id === districtId)?.data3 || [];
        setWards(filteredWards);
        setAdditionalInfo((prev) => ({
            ...prev,
            districtNameOfficial: districtId,
            townNameOfficial: null
        }));
    };

    const handleWardOfficialChange = (wardId) => {
        setAdditionalInfo((prev) => ({
            ...prev,
            townNameOfficial: wardId
        }));
    };

    const handleProvinceActualChange = (provinceId) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict(null); // Reset quận/huyện
        setWards([]); // Reset danh sách xã
        const filteredDistricts = locations.find(item => item.id === provinceId)?.data2 || [];
        setDistricts(filteredDistricts);
        setAdditionalInfo((prev) => ({
            ...prev,
            provinceNameActual: provinceId,
            districtNameActual: null,
            townNameActual: null
        }));
    };

    const handleDistrictActualChange = (districtId) => {
        setSelectedDistrict(districtId);
        // setWards([]); // Reset danh sách xã
        const filteredWards = districts.find(item => item.id === districtId)?.data3 || [];
        setWards(filteredWards);
        setAdditionalInfo((prev) => ({
            ...prev,
            districtNameActual: districtId,
            townNameActual: null
        }));
    };

    const handleWardActualChange = (wardId) => {
        setAdditionalInfo((prev) => ({
            ...prev,
            townNameActual: wardId
        }));
    };


    useEffect(() => {
        const fetchAssetDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://192.168.1.163:8080/collateral/${code}`);
                const data = await response.json();
                const basicInfoData = {
                    code: data.code,
                    maChiNhanh: data.maChiNhanh || '',
                    organizationValuationName: data.organizationValuationName || '',
                    phongQuanLy: data.phongQuanLy || '',
                    canBoDinhGia: data.canBoDinhGia || '',
                    customerCIF: data.customerCIF || '',
                    customerName: data.customerName || '',
                    ensureCIF: data.ensureCIF || '',
                    ownerName: data.ownerName || ''
                };
                const additionalInfoData = {
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
                    projectNameActual: data.projectNameActual || ''
                };
                const detailInfoData = {
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
                    constructionArea: data.constructionArea || ''
                };
                const valuationResultData = {
                    valuationDTG: data.valuationDTG || '',
                    longitude: data.longitude || '',
                    latitude: data.latitude || '',
                    note: data.note || '',
                    noInformationReason: data.noInformationReason || '',
                    profileCLIMStatus: data.profileCLIMStatus || '',
                    scannedCLIMStatus: data.scannedCLIMStatus || ''
                };

                setBasicInfo(basicInfoData);
                setAdditionalInfo(additionalInfoData);
                setDetailInfo(detailInfoData);
                setValuationResult(valuationResultData);

                setInitialBasicInfo(basicInfoData);
                setInitialAdditionalInfo(additionalInfoData);
                setInitialDetailInfo(detailInfoData);
                setInitialValuationResult(valuationResultData);

                setCreatedDate(data.createdDate);
                setModifiedDate(data.modifiedDate);

                const initialProvince = locations.find(item => item.name === additionalInfoData.provinceNameOfficial);
                if (initialProvince) {
                    setSelectedProvince(initialProvince.id);
                    const filteredDistricts = initialProvince.data2 || [];
                    setDistricts(filteredDistricts);
                    const initialDistrict = filteredDistricts.find(item => item.name === additionalInfoData.districtNameOfficial);
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


    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdditionalInfoChange = (e) => {
        const { name, value } = e.target;
        setAdditionalInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDetailInfoChange = (e) => {
        const { name, value } = e.target;
        setDetailInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleValuationResultChange = (e) => {
        const { name, value } = e.target;
        setValuationResult((prev) => ({
            ...prev,
            [name]: value
        }));
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

    const handleUpdate = (section) => {
        const isSuccess = false;
        if (isSuccess) {
            showModal('success');
        } else {
            showModal('error');
        }
    };

    useEffect(() => {
        if (!loading) {
            const basicInfoChanged = JSON.stringify(basicInfo) !== JSON.stringify(initialBasicInfo);
            const additionalInfoChanged = JSON.stringify(additionalInfo) !== JSON.stringify(initialAdditionalInfo);
            const detailInfoChanged = JSON.stringify(detailInfo) !== JSON.stringify(initialDetailInfo);
            const valuationResultChanged = JSON.stringify(valuationResult) !== JSON.stringify(initialValuationResult);

            setIsChanged({
                basicInfo: basicInfoChanged,
                additionalInfo: additionalInfoChanged,
                detailInfo: detailInfoChanged,
                valuationResult: valuationResultChanged
            });
        }
    }, [basicInfo, additionalInfo, detailInfo, valuationResult, initialBasicInfo, initialAdditionalInfo, initialDetailInfo, initialValuationResult, loading]);

    const handleReset = () => {
        setBasicInfo(initialBasicInfo);
        setAdditionalInfo(initialAdditionalInfo);
        setDetailInfo(initialDetailInfo);
        setValuationResult(initialValuationResult);
        setIsChanged({
            basicInfo: false,
            additionalInfo: false,
            detailInfo: false,
            valuationResult: false
        });
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
                        <SyncOutlined style={{ backgroundColor: '#00CCFF', fontSize: 12, padding: 3, color: '#fff', borderRadius: 3, marginLeft:5 }} />
                        Cập nhật lần cuối: {modifiedDate}
                    </div>
                </div>
                <div className={styles.containerBtn}>
                    <Button
                        className={styles.buttonUpdate}
                        icon={<EditOutlined />}
                        type={Object.values(isChanged).some(value => value) ? "primary" : "default"}
                        disabled={!Object.values(isChanged).some(value => value)}
                        onClick={() => handleUpdate('all')}>
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
                // extra={
                //     <Button
                //         icon={<EditOutlined />}
                //         type={isChanged.basicInfo ? "primary" : "default"}
                //         disabled={!isChanged.basicInfo}
                //         onClick={() => handleUpdate('basicInfo')}>
                //         Cập nhật
                //     </Button>
                // }
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
                                <Input type="number" name="code" value={basicInfo?.code || ''} disabled />
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
                                <Input type="number" className={styles.noSpinner} name="maChiNhanh" value={basicInfo.maChiNhanh} onChange={handleBasicInfoChange} />
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
                                <Input type="text" name="organizationValuationName" value={basicInfo.organizationValuationName} onChange={handleBasicInfoChange} />
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
                                <Input type="text" name="phongQuanLy" value={basicInfo.phongQuanLy} onChange={handleBasicInfoChange} />
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
                                <Input type="text" name="canBoDinhGia" value={basicInfo.canBoDinhGia} onChange={handleBasicInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="customerCIF" value={basicInfo.customerCIF} onChange={handleBasicInfoChange} />
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
                                <Input type="text" name="customerName" value={basicInfo.customerName} onChange={handleBasicInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="ensureCIF" value={basicInfo.ensureCIF} onChange={handleBasicInfoChange} />
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
                                <Input type="text" name="ownerName" value={basicInfo.ownerName} onChange={handleBasicInfoChange} />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin bổ sung</span>}
                    size="small"


                // extra={
                //     <Button
                //         icon={<EditOutlined />}
                //         type={isChanged.additionalInfo ? "primary" : "default"}
                //         disabled={!isChanged.additionalInfo}
                //         onClick={() => handleUpdate('additionalInfo')}>
                //         Cập nhật
                //     </Button>
                // }
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
                                <Input type="text" name="noiDangKyGDBD" value={additionalInfo.noiDangKyGDBD} onChange={handleAdditionalInfoChange} />
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
                                <Input type="text" name="noiCongChung" value={additionalInfo.noiCongChung} onChange={handleAdditionalInfoChange} />
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
                                    value={additionalInfo.provinceNameOfficial}
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
                                    value={additionalInfo.districtNameOfficial}
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
                                    value={additionalInfo.townNameOfficial}
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
                                <Input type="text" name="addressHouseNumberOfficial" value={additionalInfo.streetNameOfficial + ", " + additionalInfo.addressHouseNumberOfficial} onChange={handleAdditionalInfoChange} />
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
                                <Input type="text" name="projectNameOfficial" value={additionalInfo.projectNameOfficial} onChange={handleAdditionalInfoChange} />
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
                                <Input type="text" name="assetStateName" value={additionalInfo.assetStateName} onChange={handleAdditionalInfoChange} />
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
                                <Input type="text" name="legalStateName" value={additionalInfo.legalStateName} onChange={handleAdditionalInfoChange} />
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
                                    value={additionalInfo.provinceNameActual}
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
                                    value={additionalInfo.districtNameActual}
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
                                    value={additionalInfo.townNameActual}
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
                                <Input type="text" name="addressHouseNumberActual" value={additionalInfo.streetNameActual + ", " + additionalInfo.addressHouseNumberActual} onChange={handleAdditionalInfoChange} />
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
                                <Input type="text" name="projectNameActual" value={additionalInfo.projectNameActual} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin chi tiết TSĐB</span>}
                    size="small"


                // extra={
                //     <Button
                //         icon={<EditOutlined />}
                //         type={isChanged.detailInfo ? "primary" : "default"}
                //         disabled={!isChanged.detailInfo}
                //         onClick={() => handleUpdate('detailInfo')}>
                //         Cập nhật
                //     </Button>
                // }
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
                                <Input type="text" name="certificateNo" value={detailInfo.certificateNo} onChange={handleDetailInfoChange} />
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
                                <Input type="text" name="frontageTypeName" value={detailInfo.frontageTypeName} onChange={handleDetailInfoChange} />
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
                                    <Input type="number" className={styles.noSpinner} name="landWidthMin" value={detailInfo.landWidthMin} onChange={handleDetailInfoChange} />
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
                                    <Input type="number" className={styles.noSpinner} name="numberOfContiguousStreet" value={detailInfo.numberOfContiguousStreet} onChange={handleDetailInfoChange} />
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
                                    <Input style={{marginLeft:6}} type="text" name="contiguousStreetTypeName" value={detailInfo.contiguousStreetTypeName} onChange={handleDetailInfoChange} />
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
                                    <Input type="number" className={styles.noSpinner} name="width" value={detailInfo.width} onChange={handleDetailInfoChange} />
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
                                    <Input type="number" className={styles.noSpinner} name="length" value={detailInfo.length} onChange={handleDetailInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="landAreaPrivate" value={detailInfo.landAreaPrivate} onChange={handleDetailInfoChange} />
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
                                    value={detailInfo.totalValue}
                                    decimalsLimit={2}
                                    onValueChange={(value) => handleDetailInfoChange({ target: { name: 'totalValue', value } })}
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
                                <Input type="text" name="infactPurposeName" value={detailInfo.infactPurposeName} onChange={handleDetailInfoChange} />
                            </Form.Item>
                            <Form.Item
                                className={styles.formItem} label="Thời hạn sử dụng"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                                labelWrap={true}
                                colon={false}
                            >
                                <Input type="text" name="useDuration" value={detailInfo.useDuration} onChange={handleDetailInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="purposeArea" value={detailInfo.purposeArea} onChange={handleDetailInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="constructionValuationArea" value={detailInfo.constructionValuationArea} onChange={handleDetailInfoChange} />
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
                                    value={detailInfo.unitPricePurpose}
                                    decimalsLimit={2}
                                    onValueChange={(value) => handleDetailInfoChange({ target: { name: 'unitPricePurpose', value } })}
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
                                <Input type="text" name="constructionTypeName" value={detailInfo.constructionTypeName} onChange={handleDetailInfoChange} />
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
                                <Input type="text" name="constructionName" value={detailInfo.constructionName} onChange={handleDetailInfoChange} />
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
                                <Input type="number" className={styles.noSpinner} name="constructionArea" value={detailInfo.constructionArea} onChange={handleDetailInfoChange} />
                            </Form.Item>
                        </div>

                    </div>
                </Card>

                <Card
                    style={{ margin: 20 }}
                    title={<span className={styles.cardTitle}>Thông tin chi tiết TSĐB</span>}
                    size="small"


                // extra={
                //     <Button
                //         icon={<EditOutlined />}
                //         type={isChanged.valuationResult ? "primary" : "default"}
                //         disabled={!isChanged.valuationResult}
                //         onClick={() => handleUpdate('valuationResult')}>
                //         Cập nhật
                //     </Button>
                // }
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
                                <Input type="text" name="valuationDTG" value={valuationResult.valuationDTG} onChange={handleValuationResultChange} />
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
                                <Input type="text" name="noInformationReason" value={valuationResult.noInformationReason} onChange={handleValuationResultChange} />
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
                                <Input type="text" name="longitude" value={valuationResult.longitude} onChange={handleValuationResultChange} />
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
                                <Input type="text" name="latitude" value={valuationResult.latitude} onChange={handleValuationResultChange} />
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
                                <Input type="text" name="profileCLIMStatus" value={valuationResult.profileCLIMStatus} onChange={handleValuationResultChange} />
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
                                <Input type="text" name="scannedCLIMStatus" value={valuationResult.scannedCLIMStatus} onChange={handleValuationResultChange} />
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
                                <TextArea name="note" value={valuationResult.note} onChange={handleValuationResultChange} />
                            </Form.Item>
                        </div>
                    </div>
                </Card>
            </Space>
        </div>
    )
};

export default AssetDetail;