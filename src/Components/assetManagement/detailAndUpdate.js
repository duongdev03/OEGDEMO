import { Link, useParams } from "react-router-dom";
import { HomeOutlined, RightOutlined, EditOutlined, HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Input, Form, Modal } from 'antd';
import { useState, useEffect } from "react";
import styles from './DetailAndUpdate.module.css';

const AssetDetail = () => {
    const { assetCode } = useParams();
    const initialState = {
        assetCode: assetCode,
        brandCode: '',
        brandName: '',
        managementRoom: '',
        nearestAppraiser: '',
        CIFCode: '',
        customerName: '',
        CIFGuarantor: '',
        ownerName: '',
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
        actualProjectName: '',
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
        constructionArea: '',
        valuationDate: '',
        longitude: '',
        latitude: '',
        notes: '',
        noInfoReason: '',
        climStatus: '',
        climDetails: ''
    }
    const [formData, setFormData] = useState(initialState);
    const [isChanged, setIsChanged] = useState({
        basicInfo: false,
        additionalInfo: false,
        detailInfo: false,
        valuationResult: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

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
        const basicInfoChanged = JSON.stringify({
            assetCode: formData.assetCode,
            brandCode: formData.brandCode,
            brandName: formData.brandName,
            managementRoom: formData.managementRoom,
            nearestAppraiser: formData.nearestAppraiser,
            CIFCode: formData.CIFCode,
            customerName: formData.customerName,
            CIFGuarantor: formData.CIFGuarantor,
            ownerName: formData.ownerName
        }) !== JSON.stringify({
            assetCode: initialState.assetCode,
            brandCode: initialState.brandCode,
            brandName: initialState.brandName,
            managementRoom: initialState.managementRoom,
            nearestAppraiser: initialState.nearestAppraiser,
            CIFCode: initialState.CIFCode,
            customerName: initialState.customerName,
            CIFGuarantor: initialState.CIFGuarantor,
            ownerName: initialState.ownerName
        });

        const additionalInfoChanged = JSON.stringify({
            registrationPlace: formData.registrationPlace,
            notaryPlace: formData.notaryPlace,
            province: formData.province,
            district: formData.district,
            ward: formData.ward,
            houseNumber: formData.houseNumber,
            legalProjectName: formData.legalProjectName,
            assetStatus: formData.assetStatus,
            legalStatus: formData.legalStatus,
            actualProvince: formData.actualProvince,
            actualDistrict: formData.actualDistrict,
            actualWard: formData.actualWard,
            actualHouseNumber: formData.actualHouseNumber,
            actualProjectName: formData.actualProjectName
        }) !== JSON.stringify({
            registrationPlace: initialState.registrationPlace,
            notaryPlace: initialState.notaryPlace,
            province: initialState.province,
            district: initialState.district,
            ward: initialState.ward,
            houseNumber: initialState.houseNumber,
            legalProjectName: initialState.legalProjectName,
            assetStatus: initialState.assetStatus,
            legalStatus: initialState.legalStatus,
            actualProvince: initialState.actualProvince,
            actualDistrict: initialState.actualDistrict,
            actualWard: initialState.actualWard,
            actualHouseNumber: initialState.actualHouseNumber,
            actualProjectName: initialState.actualProjectName
        });

        const detailInfoChanged = JSON.stringify({
            certificateNumber: formData.certificateNumber,
            frontage: formData.frontage,
            alleyWidth: formData.alleyWidth,
            numberOfFrontages: formData.numberOfFrontages,
            roadType: formData.roadType,
            width: formData.width,
            length: formData.length,
            privateArea: formData.privateArea,
            totalValue: formData.totalValue,
            usagePurpose: formData.usagePurpose,
            usageDuration: formData.usageDuration,
            area: formData.area,
            valueArea: formData.valueArea,
            unitPrice: formData.unitPrice,
            constructionType: formData.constructionType,
            constructionName: formData.constructionName,
            constructionArea: formData.constructionArea
        }) !== JSON.stringify({
            certificateNumber: initialState.certificateNumber,
            frontage: initialState.frontage,
            alleyWidth: initialState.alleyWidth,
            numberOfFrontages: initialState.numberOfFrontages,
            roadType: initialState.roadType,
            width: initialState.width,
            length: initialState.length,
            privateArea: initialState.privateArea,
            totalValue: initialState.totalValue,
            usagePurpose: initialState.usagePurpose,
            usageDuration: initialState.usageDuration,
            area: initialState.area,
            valueArea: initialState.valueArea,
            unitPrice: initialState.unitPrice,
            constructionType: initialState.constructionType,
            constructionName: initialState.constructionName,
            constructionArea: initialState.constructionArea
        });

        const valuationResultChanged = JSON.stringify({
            valuationDate: formData.valuationDate,
            longitude: formData.longitude,
            latitude: formData.latitude,
            notes: formData.notes,
            noInfoReason: formData.noInfoReason,
            climStatus: formData.climStatus,
            climDetails: formData.climDetails
        }) !== JSON.stringify({
            valuationDate: initialState.valuationDate,
            longitude: initialState.longitude,
            latitude: initialState.latitude,
            notes: initialState.notes,
            noInfoReason: initialState.noInfoReason,
            climStatus: initialState.climStatus,
            climDetails: initialState.climDetails
        });

        setIsChanged({
            basicInfo: basicInfoChanged,
            additionalInfo: additionalInfoChanged,
            detailInfo: detailInfoChanged,
            valuationResult: valuationResultChanged
        });
    }, [formData]);

    return (
        <div>
            <nav>
                <ul className={styles.nav}>
                    <li><Link to="/"><HomeOutlined />Trang chủ <RightOutlined /></Link></li>
                    <li><Link to="/AssetManagement">Quản lý tài sản <RightOutlined /></Link></li>
                    <li><Link className={styles.textDetail} to={`/AssetDetail/${assetCode}`}>Chi tiết</Link></li>
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
                                <Input type="text" name="assetCode" value={assetCode} disabled />
                            </Form.Item>
                            <Form.Item label="Mã chi nhánh">
                                <Input type="text" name="brandCode" value={formData.brandCode} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Chi nhánh">
                                <Input type="text" name="brandName" value={formData.brandName} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Phòng quản lý">
                                <Input type="text" name="managementRoom" value={formData.managementRoom} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Cán bộ định giá gần nhất">
                                <Input type="text" name="nearestAppraiser" value={formData.nearestAppraiser} onChange={handleChange}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="CIF khách hàng vay">
                                <Input type="text" name="CIFCode" value={formData.CIFCode} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Tên khách hàng vay">
                                <Input type="text" name="customerName" value={formData.customerName} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="CIF bên đảm bảo">
                                <Input type="text" name="CIFGuarantor" value={formData.CIFGuarantor} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Tên chủ tài sản">
                                <Input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange}/>
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
                                <Input type="text" name="registrationPlace" value={formData.registrationPlace} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Nơi công chứng">
                                <Input type="text" name="notaryPlace" value={formData.notaryPlace} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Tỉnh/ Thành phố">
                                <Input type="text" name="province" value={formData.province} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Quận/ Huyện">
                                <Input type="text" name="district" value={formData.district} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Phường/ Xã">
                                <Input type="text" name="ward" value={formData.ward} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Số nhà">
                                <Input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Tên pháp lý dự án theo GCN (nếu có)">
                                <Input type="text" name="legalProjectName" value={formData.legalProjectName} onChange={handleChange}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="Tình trạng tài sản">
                                <Input type="text" name="assetStatus" value={formData.assetStatus} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Tính chất pháp lý">
                                <Input type="text" name="legalStatus" value={formData.legalStatus} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Tỉnh/ Thành phố thực tế">
                                <Input type="text" name="actualProvince" value={formData.actualProvince} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Quận/ Huyện thực tế">
                                <Input type="text" name="actualDistrict" value={formData.actualDistrict} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Phường/ Xã thực tế">
                                <Input type="text" name="actualWard" value={formData.actualWard} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Số nhà thực tế">
                                <Input type="text" name="actualHouseNumber" value={formData.actualHouseNumber} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Tên thương mại dự án thực tế">
                                <Input type="text" name="actualProjectName" value={formData.actualProjectName} onChange={handleChange}/>
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
                            <Input type="text" name="certificateNumber" value={formData.certificateNumber} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Mặt tiền tiếp giáp">
                            <Input type="text" name="frontage" value={formData.frontage} onChange={handleChange}/>
                        </Form.Item>
                        <div className={styles.locationDescription}>
                            <Form.Item label="Độ rộng mặt ngõ/ hẻm/ đường nội bộ nhỏ nhất (m)">
                                <Input type="text" name="alleyWidth" value={formData.alleyWidth} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Số mặt tiếp giáp">
                                <Input type="text" name="numberOfFrontages" value={formData.numberOfFrontages} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Loại đường tiếp giáp">
                                <Input type="text" name="roadType" value={formData.roadType} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Kích thước chiều rộng(m)">
                                <Input type="text" name="width" value={formData.width} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Kích thước chiều dài(m)">
                                <Input type="text" name="length" value={formData.length} onChange={handleChange}/>
                            </Form.Item>
                        </div>

                        <Form.Item label="Diện tích sử dụng riêng theo GCN(m2)">
                            <Input type="text" name="privateArea" value={formData.privateArea} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Tổng giá trị">
                            <Input type="text" name="totalValue" value={formData.totalValue} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Mục đích sử dụng">
                            <Input type="text" name="usagePurpose" value={formData.usagePurpose} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Thời hạn sử dụng">
                            <Input type="text" name="usageDuration" value={formData.usageDuration} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Diện tích (m2)">
                            <Input type="text" name="area" value={formData.area} onChange={handleChange}/>
                        </Form.Item>
                        <div className={styles.landValue}>
                            <Form.Item label="Diện tích tính giá trị (m2)">
                                <Input type="text" name="valueArea" value={formData.valueArea} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Đơn giá (đ/m2)">
                                <Input type="text" name="unitPrice" value={formData.unitPrice} onChange={handleChange}/>
                            </Form.Item>
                        </div>
                        <Form.Item label="Loại công trình">
                            <Input type="text" name="constructionType" value={formData.constructionType} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Tên công trình">
                            <Input type="text" name="constructionName" value={formData.constructionName} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Diện tích sàn CTXD (m2)">
                            <Input type="text" name="constructionArea" value={formData.constructionArea} onChange={handleChange}/>
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
                            <Input type="text" name="valuationDate" value={formData.valuationDate} onChange={handleChange}/>
                        </Form.Item>
                        <div className={styles.coordinates}>
                            <Form.Item label="Kinh độ">
                                <Input type="text" name="longitude" value={formData.longitude} onChange={handleChange}/>
                            </Form.Item>
                            <Form.Item label="Vĩ độ">
                                <Input type="text" name="latitude" value={formData.latitude} onChange={handleChange}/>
                            </Form.Item>
                        </div>
                        <Form.Item label="Ghi chú">
                            <Input type="text" name="notes" value={formData.notes} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Lý do không nhập thông tin">
                            <Input type="text" name="noInfoReason" value={formData.noInfoReason} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Tình trạng hồ sơ trên CLIM">
                            <Input type="text" name="climStatus" value={formData.climStatus} onChange={handleChange}/>
                        </Form.Item>
                        <Form.Item label="Chi tiết hồ sơ đã scan trên CLIM">
                            <Input type="text" name="climDetails" value={formData.climDetails} onChange={handleChange}/>
                        </Form.Item>
                    </div>
                </Card>
            </Space>
        </div>
    )
};

export default AssetDetail;