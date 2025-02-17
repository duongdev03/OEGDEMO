import { Link, useParams } from "react-router-dom";
import { HomeOutlined, RightOutlined, EditOutlined, HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Input, Form, Modal } from 'antd';
import { useState, useEffect, useMemo } from "react";
import styles from './DetailAndUpdate.module.css';

const AssetDetail = () => {
    const { code } = useParams();

    const initialBasicInfo = useMemo(() => ({
        assetCode: code,
        brandCode: '',
        brandName: '',
        managementRoom: '',
        nearestAppraiser: '',
        CIFCode: '',
        customerName: '',
        CIFGuarantor: '',
        ownerName: ''
    }), [code]);

    const initialAdditionalInfo = useMemo(() => ({
        registrationPlace: '',
        notaryPlace: '',
        province: '',
        district: '',
        ward: '',
        houseNumber: '',
        legalProjectName: '',
        assetStatus: '',
        legalStatus: '',
        actualProvince: '',
        actualDistrict: '',
        actualWard: '',
        actualHouseNumber: '',
        actualProjectName: ''
    }), []);

    const initialDetailInfo = useMemo(() => ({
        certificateNumber: '',
        frontage: '',
        alleyWidth: '',
        numberOfFrontages: '',
        roadType: '',
        width: '',
        length: '',
        privateArea: '',
        totalValue: '',
        usagePurpose: '',
        usageDuration: '',
        area: '',
        valueArea: '',
        unitPrice: '',
        constructionType: '',
        constructionName: '',
        constructionArea: ''
    }), []);

    const initialValuationResult = useMemo(() => ({
        valuationDate: '',
        longitude: '',
        latitude: '',
        notes: '',
        noInfoReason: '',
        climStatus: '',
        climDetails: ''
    }), []);

    const [basicInfo, setBasicInfo] = useState(initialBasicInfo);
    const [additionalInfo, setAdditionalInfo] = useState(initialAdditionalInfo);
    const [detailInfo, setDetailInfo] = useState(initialDetailInfo);
    const [valuationResult, setValuationResult] = useState(initialValuationResult);
    const [isChanged, setIsChanged] = useState({
        basicInfo: false,
        additionalInfo: false,
        detailInfo: false,
        valuationResult: false
    });

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
            [name]: value
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
            onOk() {},
            onCancel() {},
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
    }, [basicInfo, additionalInfo, detailInfo, valuationResult, initialBasicInfo, initialAdditionalInfo, initialDetailInfo, initialValuationResult]);

    return (
        <div>
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
                                <Input type="text" name="assetCode" value={basicInfo.assetCode} disabled />
                            </Form.Item>
                            <Form.Item label="Mã chi nhánh">
                                <Input type="text" name="brandCode" value={basicInfo.brandCode} onChange={handleBasicInfoChange} />
                            </Form.Item>
                            <Form.Item label="Chi nhánh">
                                <Input type="text" name="brandName" value={basicInfo.brandName} onChange={handleBasicInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Phòng quản lý">
                                <Input type="text" name="managementRoom" value={basicInfo.managementRoom} onChange={handleBasicInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Cán bộ định giá gần nhất">
                                <Input type="text" name="nearestAppraiser" value={basicInfo.nearestAppraiser} onChange={handleBasicInfoChange}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="CIF khách hàng vay">
                                <Input type="text" name="CIFCode" value={basicInfo.CIFCode} onChange={handleBasicInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Tên khách hàng vay">
                                <Input type="text" name="customerName" value={basicInfo.customerName} onChange={handleBasicInfoChange}/>
                            </Form.Item>
                            <Form.Item label="CIF bên đảm bảo">
                                <Input type="text" name="CIFGuarantor" value={basicInfo.CIFGuarantor} onChange={handleBasicInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Tên chủ tài sản">
                                <Input type="text" name="ownerName" value={basicInfo.ownerName} onChange={handleBasicInfoChange}/>
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
                                <Input type="text" name="registrationPlace" value={additionalInfo.registrationPlace} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Nơi công chứng">
                                <Input type="text" name="notaryPlace" value={additionalInfo.notaryPlace} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Tỉnh/ Thành phố">
                                <Input type="text" name="province" value={additionalInfo.province} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Quận/ Huyện">
                                <Input type="text" name="district" value={additionalInfo.district} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Phường/ Xã">
                                <Input type="text" name="ward" value={additionalInfo.ward} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Số nhà">
                                <Input type="text" name="houseNumber" value={additionalInfo.houseNumber} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Tên pháp lý dự án theo GCN (nếu có)">
                                <Input type="text" name="legalProjectName" value={additionalInfo.legalProjectName} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="Tình trạng tài sản">
                                <Input type="text" name="assetStatus" value={additionalInfo.assetStatus} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Tính chất pháp lý">
                                <Input type="text" name="legalStatus" value={additionalInfo.legalStatus} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Tỉnh/ Thành phố thực tế">
                                <Input type="text" name="actualProvince" value={additionalInfo.actualProvince} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Quận/ Huyện thực tế">
                                <Input type="text" name="actualDistrict" value={additionalInfo.actualDistrict} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Phường/ Xã thực tế">
                                <Input type="text" name="actualWard" value={additionalInfo.actualWard} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Số nhà thực tế">
                                <Input type="text" name="actualHouseNumber" value={additionalInfo.actualHouseNumber} onChange={handleAdditionalInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Tên thương mại dự án thực tế">
                                <Input type="text" name="actualProjectName" value={additionalInfo.actualProjectName} onChange={handleAdditionalInfoChange}/>
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
                            <Input type="text" name="certificateNumber" value={detailInfo.certificateNumber} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <Form.Item label="Mặt tiền tiếp giáp">
                            <Input type="text" name="frontage" value={detailInfo.frontage} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <div className={styles.locationDescription}>
                            <Form.Item label="Độ rộng mặt ngõ/ hẻm/ đường nội bộ nhỏ nhất (m)">
                                <Input type="text" name="alleyWidth" value={detailInfo.alleyWidth} onChange={handleDetailInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Số mặt tiếp giáp">
                                <Input type="text" name="numberOfFrontages" value={detailInfo.numberOfFrontages} onChange={handleDetailInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Loại đường tiếp giáp">
                                <Input type="text" name="roadType" value={detailInfo.roadType} onChange={handleDetailInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Kích thước chiều rộng(m)">
                                <Input type="text" name="width" value={detailInfo.width} onChange={handleDetailInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Kích thước chiều dài(m)">
                                <Input type="text" name="length" value={detailInfo.length} onChange={handleDetailInfoChange}/>
                            </Form.Item>
                        </div>

                        <Form.Item label="Diện tích sử dụng riêng theo GCN(m2)">
                            <Input type="text" name="privateArea" value={detailInfo.privateArea} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <Form.Item label="Tổng giá trị">
                            <Input type="text" name="totalValue" value={detailInfo.totalValue} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <Form.Item label="Mục đích sử dụng">
                            <Input type="text" name="usagePurpose" value={detailInfo.usagePurpose} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <Form.Item label="Thời hạn sử dụng">
                            <Input type="text" name="usageDuration" value={detailInfo.usageDuration} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <Form.Item label="Diện tích (m2)">
                            <Input type="text" name="area" value={detailInfo.area} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <div className={styles.landValue}>
                            <Form.Item label="Diện tích tính giá trị (m2)">
                                <Input type="text" name="valueArea" value={detailInfo.valueArea} onChange={handleDetailInfoChange}/>
                            </Form.Item>
                            <Form.Item label="Đơn giá (đ/m2)">
                                <Input type="text" name="unitPrice" value={detailInfo.unitPrice} onChange={handleDetailInfoChange}/>
                            </Form.Item>
                        </div>
                        <Form.Item label="Loại công trình">
                            <Input type="text" name="constructionType" value={detailInfo.constructionType} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <Form.Item label="Tên công trình">
                            <Input type="text" name="constructionName" value={detailInfo.constructionName} onChange={handleDetailInfoChange}/>
                        </Form.Item>
                        <Form.Item label="Diện tích sàn CTXD (m2)">
                            <Input type="text" name="constructionArea" value={detailInfo.constructionArea} onChange={handleDetailInfoChange}/>
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
                            <Input type="text" name="valuationDate" value={valuationResult.valuationDate} onChange={handleValuationResultChange}/>
                        </Form.Item>
                        <div className={styles.coordinates}>
                            <Form.Item label="Kinh độ">
                                <Input type="text" name="longitude" value={valuationResult.longitude} onChange={handleValuationResultChange}/>
                            </Form.Item>
                            <Form.Item label="Vĩ độ">
                                <Input type="text" name="latitude" value={valuationResult.latitude} onChange={handleValuationResultChange}/>
                            </Form.Item>
                        </div>
                        <Form.Item label="Ghi chú">
                            <Input type="text" name="notes" value={valuationResult.notes} onChange={handleValuationResultChange}/>
                        </Form.Item>
                        <Form.Item label="Lý do không nhập thông tin">
                            <Input type="text" name="noInfoReason" value={valuationResult.noInfoReason} onChange={handleValuationResultChange}/>
                        </Form.Item>
                        <Form.Item label="Tình trạng hồ sơ trên CLIM">
                            <Input type="text" name="climStatus" value={valuationResult.climStatus} onChange={handleValuationResultChange}/>
                        </Form.Item>
                        <Form.Item label="Chi tiết hồ sơ đã scan trên CLIM">
                            <Input type="text" name="climDetails" value={valuationResult.climDetails} onChange={handleValuationResultChange}/>
                        </Form.Item>
                    </div>
                </Card>
            </Space>
        </div>
    )
};

export default AssetDetail;