import { Link, useParams } from "react-router-dom";
import { HomeOutlined, RightOutlined, EditOutlined, HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Input, Form, Modal, Select, Spin } from 'antd';
import { useState, useEffect } from "react";
import CurrencyInput from 'react-currency-input-field';
import styles from './DetailAndUpdate.module.css';

const { Option } = Select;

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


    return (
        <div>
            <Spin className={styles.loading} spinning={loading}></Spin>
            <nav>
                <ul className={styles.nav}>
                    <li><Link to="/"><HomeOutlined />Trang chủ <RightOutlined /></Link></li>
                    <li><Link to="/AssetManagement">Quản lý tài sản <RightOutlined /></Link></li>
                    <li><Link to={`/AssetDetail/${code}`}>Chi tiết</Link></li>
                </ul>
            </nav>

            <div className={styles.timeUpdate}>
                <HistoryOutlined /> Ngày tạo: 05/02/2025 | <SyncOutlined style={{ backgroundColor: '#00CCFF', fontSize: 12, padding: 3, color: '#fff', borderRadius: 3 }} /> Cập nhật lần cuối: 07/02/2025
            </div>

            <Space
                direction="vertical"
                size="middle"
                style={{
                    display: 'flex',
                }}
            >
                <Card style={{ margin: 20 }} title="Thông tin cơ bản" size="small"
                    extra={
                        <Button
                            icon={<EditOutlined />}
                            type={isChanged.basicInfo ? "primary" : "default"}
                            disabled={!isChanged.basicInfo}
                            onClick={() => handleUpdate('basicInfo')}>
                            Cập nhật
                        </Button>
                    }>
                    <div className={styles.basicInfor}>
                        <div>
                            <Form.Item label="Mã tài sản">
                                <Input type="text" name="code" value={basicInfo?.code || ''} disabled />
                            </Form.Item>
                            <Form.Item label="Mã chi nhánh">
                                <Input type="text" name="maChiNhanh" value={basicInfo.maChiNhanh} onChange={handleBasicInfoChange} />
                            </Form.Item>
                            <Form.Item label="Chi nhánh">
                                <Input type="text" name="organizationValuationName" value={basicInfo.organizationValuationName} onChange={handleBasicInfoChange} />
                            </Form.Item>
                            <Form.Item label="Phòng quản lý">
                                <Input type="text" name="phongQuanLy" value={basicInfo.phongQuanLy} onChange={handleBasicInfoChange} />
                            </Form.Item>
                            <Form.Item label="Cán bộ định giá gần nhất">
                                <Input type="text" name="canBoDinhGia" value={basicInfo.canBoDinhGia} onChange={handleBasicInfoChange} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="CIF khách hàng vay">
                                <Input type="text" name="customerCIF" value={basicInfo.customerCIF} onChange={handleBasicInfoChange} />
                            </Form.Item>
                            <Form.Item label="Tên khách hàng vay">
                                <Input type="text" name="customerName" value={basicInfo.customerName} onChange={handleBasicInfoChange} />
                            </Form.Item>
                            <Form.Item label="CIF bên đảm bảo">
                                <Input type="text" name="ensureCIF" value={basicInfo.ensureCIF} onChange={handleBasicInfoChange} />
                            </Form.Item>
                            <Form.Item label="Tên chủ tài sản">
                                <Input type="text" name="ownerName" value={basicInfo.ownerName} onChange={handleBasicInfoChange} />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card style={{ margin: 20 }} title="Thông tin bổ sung" size="small"
                    extra={
                        <Button
                            icon={<EditOutlined />}
                            type={isChanged.additionalInfo ? "primary" : "default"}
                            disabled={!isChanged.additionalInfo}
                            onClick={() => handleUpdate('additionalInfo')}>
                            Cập nhật
                        </Button>
                    }>
                    <div className={styles.additionalInfor}>
                        <div>
                            <Form.Item label="Nơi đăng ký GDBĐ">
                                <Input type="text" name="noiDangKyGDBD" value={additionalInfo.noiDangKyGDBD} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                            <Form.Item label="Nơi công chứng">
                                <Input type="text" name="noiCongChung" value={additionalInfo.noiCongChung} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                            <Form.Item label="Tỉnh/ Thành phố">
                                <Select
                                    placeholder="Tỉnh/ Thành phố"
                                    style={{ width: 200 }}
                                    value={additionalInfo.provinceNameOfficial}
                                    onChange={handleProvinceOfficialChange}
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
                            <Form.Item label="Phường/ Xã">
                                <Select
                                    placeholder="Phường/ Xã"
                                    style={{ width: 200 }}
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
                            <Form.Item label="Số nhà">
                                <Input type="text" name="addressHouseNumberOfficial" value={additionalInfo.streetNameOfficial + ", " + additionalInfo.addressHouseNumberOfficial} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                            <Form.Item label="Tên pháp lý dự án theo GCN (nếu có)">
                                <Input type="text" name="projectNameOfficial" value={additionalInfo.projectNameOfficial} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="Tình trạng tài sản">
                                <Input type="text" name="assetStateName" value={additionalInfo.assetStateName} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                            <Form.Item label="Tính chất pháp lý">
                                <Input type="text" name="legalStateName" value={additionalInfo.legalStateName} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                            <Form.Item label="Tỉnh/ Thành phố thực tế">
                                <Select
                                    placeholder="Tỉnh/ Thành phố"
                                    style={{ width: 200 }}
                                    value={additionalInfo.provinceNameActual}
                                    onChange={handleProvinceActualChange}
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
                            <Form.Item label="Phường/ Xã thực tế">
                                <Select
                                    placeholder="Phường/ Xã"
                                    style={{ width: 200 }}
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
                            <Form.Item label="Số nhà thực tế">
                                <Input type="text" name="addressHouseNumberActual" value={additionalInfo.streetNameActual + ", " + additionalInfo.addressHouseNumberActual} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                            <Form.Item label="Tên thương mại dự án thực tế">
                                <Input type="text" name="projectNameActual" value={additionalInfo.projectNameActual} onChange={handleAdditionalInfoChange} />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card style={{ margin: 20 }} title="Thông tin chi tiết TSĐB" size="small"
                    extra={
                        <Button
                            icon={<EditOutlined />}
                            type={isChanged.detailInfo ? "primary" : "default"}
                            disabled={!isChanged.detailInfo}
                            onClick={() => handleUpdate('detailInfo')}>
                            Cập nhật
                        </Button>
                    }>
                    <div className={styles.containerDetailInfor}>
                        <Form.Item label="Số GCN">
                            <Input type="text" name="certificateNo" value={detailInfo.certificateNo} onChange={handleDetailInfoChange} />
                        </Form.Item>
                        <Form.Item label="Mặt tiền tiếp giáp">
                            <Input type="text" name="frontageTypeName" value={detailInfo.frontageTypeName} onChange={handleDetailInfoChange} />
                        </Form.Item>
                        <div className={styles.locationDescription}>
                            <Form.Item label="Độ rộng mặt ngõ/ hẻm/ đường nội bộ nhỏ nhất (m)">
                                <Input type="text" name="landWidthMin" value={detailInfo.landWidthMin} onChange={handleDetailInfoChange} />
                            </Form.Item>
                            <Form.Item label="Số mặt tiếp giáp">
                                <Input type="text" name="numberOfContiguousStreet" value={detailInfo.numberOfContiguousStreet} onChange={handleDetailInfoChange} />
                            </Form.Item>
                            <Form.Item label="Loại đường tiếp giáp">
                                <Input type="text" name="contiguousStreetTypeName" value={detailInfo.contiguousStreetTypeName} onChange={handleDetailInfoChange} />
                            </Form.Item>
                            <Form.Item label="Kích thước chiều rộng(m)">
                                <Input type="text" name="width" value={detailInfo.width} onChange={handleDetailInfoChange} />
                            </Form.Item>
                            <Form.Item label="Kích thước chiều dài(m)">
                                <Input type="text" name="length" value={detailInfo.length} onChange={handleDetailInfoChange} />
                            </Form.Item>
                        </div>

                        <Form.Item label="Diện tích sử dụng riêng theo GCN(m2)">
                            <Input type="text" name="landAreaPrivate" value={detailInfo.landAreaPrivate} onChange={handleDetailInfoChange} />
                        </Form.Item>
                        <Form.Item label="Tổng giá trị">
                            <CurrencyInput
                                className={styles.currencyInput}
                                name="totalValue"
                                value={detailInfo.totalValue}
                                decimalsLimit={2}
                                onValueChange={(value) => handleDetailInfoChange({ target: { name: 'totalValue', value } })}
                            />
                        </Form.Item>
                        <Form.Item label="Mục đích sử dụng">
                            <Input type="text" name="infactPurposeName" value={detailInfo.infactPurposeName} onChange={handleDetailInfoChange} />
                        </Form.Item>
                        <Form.Item label="Thời hạn sử dụng">
                            <Input type="text" name="useDuration" value={detailInfo.useDuration} onChange={handleDetailInfoChange} />
                        </Form.Item>
                        <Form.Item label="Diện tích (m2)">
                            <Input type="text" name="purposeArea" value={detailInfo.purposeArea} onChange={handleDetailInfoChange} />
                        </Form.Item>
                        <div className={styles.landValue}>
                            <Form.Item label="Diện tích tính giá trị (m2)">
                                <Input type="text" name="constructionValuationArea" value={detailInfo.constructionValuationArea} onChange={handleDetailInfoChange} />
                            </Form.Item>
                            <Form.Item label="Đơn giá (đ/m2)">
                                <CurrencyInput
                                    className={styles.currencyInput}
                                    name="unitPricePurpose"
                                    value={detailInfo.unitPricePurpose}
                                    decimalsLimit={2}
                                    onValueChange={(value) => handleDetailInfoChange({ target: { name: 'unitPricePurpose', value } })}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item label="Loại công trình">
                            <Input type="text" name="constructionTypeName" value={detailInfo.constructionTypeName} onChange={handleDetailInfoChange} />
                        </Form.Item>
                        <Form.Item label="Tên công trình">
                            <Input type="text" name="constructionName" value={detailInfo.constructionName} onChange={handleDetailInfoChange} />
                        </Form.Item>
                        <Form.Item label="Diện tích sàn CTXD (m2)">
                            <Input type="text" name="constructionArea" value={detailInfo.constructionArea} onChange={handleDetailInfoChange} />
                        </Form.Item>
                    </div>
                </Card>

                <Card style={{ margin: 20 }} title="Thông tin kết quả định giá" size="small"
                    extra={
                        <Button
                            icon={<EditOutlined />}
                            type={isChanged.valuationResult ? "primary" : "default"}
                            disabled={!isChanged.valuationResult}
                            onClick={() => handleUpdate('valuationResult')}>
                            Cập nhật
                        </Button>
                    }>
                    <div className={styles.valuationResult}>
                        <Form.Item label="Ngày thông báo kết quả định giá">
                            <Input type="text" name="valuationDTG" value={valuationResult.valuationDTG} onChange={handleValuationResultChange} />
                        </Form.Item>
                        <div className={styles.coordinates}>
                            <Form.Item label="Kinh độ">
                                <Input type="text" name="longitude" value={valuationResult.longitude} onChange={handleValuationResultChange} />
                            </Form.Item>
                            <Form.Item label="Vĩ độ">
                                <Input type="text" name="latitude" value={valuationResult.latitude} onChange={handleValuationResultChange} />
                            </Form.Item>
                        </div>
                        <Form.Item label="Ghi chú">
                            <Input type="text" name="note" value={valuationResult.note} onChange={handleValuationResultChange} />
                        </Form.Item>
                        <Form.Item label="Lý do không nhập thông tin">
                            <Input type="text" name="noInformationReason" value={valuationResult.noInformationReason} onChange={handleValuationResultChange} />
                        </Form.Item>
                        <Form.Item label="Tình trạng hồ sơ trên CLIM">
                            <Input type="text" name="profileCLIMStatus" value={valuationResult.profileCLIMStatus} onChange={handleValuationResultChange} />
                        </Form.Item>
                        <Form.Item label="Chi tiết hồ sơ đã scan trên CLIM">
                            <Input type="text" name="scannedCLIMStatus" value={valuationResult.scannedCLIMStatus} onChange={handleValuationResultChange} />
                        </Form.Item>
                    </div>
                </Card>
            </Space>
        </div>
    )
};

export default AssetDetail;