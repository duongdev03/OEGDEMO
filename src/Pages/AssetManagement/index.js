import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Table, Input, Select, Button, Space, Modal, message } from 'antd';
import { HomeOutlined, RightOutlined, EllipsisOutlined, FileExcelOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './AssetManagement.module.css';

const { Option } = Select;


const AccsetManagement = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        code: '',
        customerCIF: '',
        legalStateName: '',
        constructionTypeName: ''
        // profileCLIMStatus: ''
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 2,
        },
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [file, setFile] = useState(null);

    const [recordCount, setRecordCount] = useState(0);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);


    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 50,
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Mã tài sản BIDV',
            dataIndex: 'code',
            width: 100,
        },
        {
            title: 'CIF KH vay',
            dataIndex: 'customerCIF',
            render: (text) => text || '',
            width: 100,
        },
        {
            title: 'Tên KH',
            dataIndex: 'customerName',
            render: (text) => text || '',
            width: 150,
        },
        {
            title: 'CIF bên đảm bảo',
            dataIndex: 'ensureCIF',
            render: (text) => text || '',
            width: 100,
        },
        {
            title: 'Tên chủ tài sản',
            dataIndex: 'ownerName',
            render: (text) => text || '',
            width: 150,
        },
        {
            title: 'Nơi đăng ký GDBĐ',
            dataIndex: 'noiDangKyGDBD',
            render: (text) => text || '',
            width: 150,
        },
        {
            title: 'tình trạng tài sản',
            dataIndex: 'assetStateName',
            render: (text) => text || '',
            width: 100,
        },
        {
            title: 'tính chất pháp lý',
            dataIndex: 'legalStateName',
            render: (text) => text || '',
            width: 120,
        },
        {
            title: 'loại công trình',
            dataIndex: 'constructionTypeName',
            render: (text) => text || '',
            width: 100,
        },
        {
            title: 'trạng thái hồ sơ trên CLIM',
            dataIndex: 'profileCLIMStatus',
            render: (text) => text || '',
            width: 100,
        },
        {
            title: 'tác vụ',
            dataIndex: 'action',
            width: 50,
            render: (_, record) => (
                <div onClick={() => navigate(`/AssetDetail/${record.code}`)}>
                    <EllipsisOutlined className={styles.action} />
                </div>
            ),
        },
    ];


    const fetchData = (params = {}) => {
        setLoading(true);
        const { current, pageSize} = tableParams.pagination;
        fetch('http://192.168.1.163:8080/collateral/find', {
            method: 'POST',
            body: JSON.stringify({...params, page: current - 1, size: pageSize}),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('API response:', data);
                setData(data);
                setLoading(false);
                setTableParams((prev) => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: data[0]?.total || 0,
                    },
                }));
                console.log('total:', data[0]?.total);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [tableParams.pagination.current, tableParams.pagination.pageSize]);
    console.log("Data: ", data);

    const [exportData, setExportData] = useState(null);

    useEffect(() => {
        const fetchExportData = () => {
            fetch('http://192.168.1.163:8080/collateral/export-excel', {
                method: 'POST',
                body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.blob()) // Chuyển đổi phản hồi thành Blob
                .then(blob => setExportData(blob)) // Lưu trữ Blob trong state
                .catch(error => console.error('Error fetching export data:', error));
        };

        fetchExportData();
    }, []);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                current: pagination.current,
                pageSize: pagination.pageSize,
            },
            filters,
            sortOrder: sorter?.order,
            sortField: sorter?.field,
        }));

        // `dataSource` is useless since `pageSize` changed
        // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        //     setData([]);
        //     fetchData();
        // }
    };

    const handleSearch = () => {
        const filteredParams = Object.fromEntries(
            Object.entries(searchParams).filter(([_, value]) => value && value.trim())
        );
        fetchData(filteredParams);
        console.log('Data Search:', filteredParams);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value ? value.trim() : ''
        }));
    };

    const handleSelectChange = (name, value) => {
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExport = () => {
        if (exportData) {
            const url = window.URL.createObjectURL(exportData);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'assets.xlsx'); // Tên file bạn muốn lưu
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } else {
            console.error('No export data available');
        }
    };

    const handleImport = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        if (file === null) {
            message.error('Vui lòng chọn file để tải lên');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', new Blob([JSON.stringify({ batchSize: '100' })], { type: "application/json" }));

        fetch('http://192.168.1.163:8080/collateral/import-excel', {
            method: 'POST',
            body: formData,
            // headers: {
            //     'Content-Type':'multipart/form-data',
            // },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Import response:', data);
                message.success('Tải file lên thành công');
                setIsModalVisible(false);
                setFile([]);
                setRecordCount(data.total);
                setIsSuccessModalVisible(true);
                fetchData();
            })
            .catch(error => {
                console.error('Error importing file:', error);
                message.error('Tải file lên thất bại');
            });
        console.log('File:', file);
        console.log("Form Data:", formData);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleUploadChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        } else {
            setFile(null);
        }
    };

    const handleSuccessModalOk = () => {
        setIsSuccessModalVisible(false);
    };

    return (

        <>
            <nav>
                <ul className={styles.nav}>
                    <li><Link to="/"><HomeOutlined />Trang chủ <RightOutlined /></Link></li>
                    <li><Link to="/AssetManagement">Quản lý tài sản</Link></li>
                </ul>
            </nav>

            <h2 className={styles.title}>Quản lý tài sản đảm bảo</h2>
            <Space style={{ marginBottom: 16, marginLeft: 30 }} wrap>
                <Input
                    placeholder="Mã tài sản BIDV"
                    style={{ width: 200 }} name='code'
                    value={searchParams.code}
                    onChange={handleInputChange}
                />
                <Input
                    placeholder="CIF Khách hàng vay"
                    style={{ width: 200 }} name='customerCIF'
                    value={searchParams.customerCIF}
                    onChange={handleInputChange}
                />
                <Select
                    placeholder="Tính chất pháp lý"
                    style={{ width: 200 }}
                    value={searchParams.legalStateName || undefined}
                    onChange={(value) => handleSelectChange('legalStateName', value)}
                    allowClear
                >
                    <Option value="Đã cấp GCN">Đã cấp GCN</Option>
                    <Option value="Chưa cấp GCN">Chưa cấp GCN</Option>
                </Select>
                <Select
                    placeholder="Loại công trình"
                    style={{ width: 200 }}
                    value={searchParams.constructionTypeName || undefined}
                    onChange={(value) => handleSelectChange('constructionTypeName', value)}
                    allowClear
                >
                    <Option value="Nhà ở độc lập/riêng lẻ">Nhà ở độc lập/riêng lẻ</Option>
                    <Option value="nhiều tầng đồng sở hữu">nhiều tầng đồng sở hữu</Option>
                    <Option value="sử dụng">sử dụng</Option>
                    <Option value="Nhà biệt thự">Nhà biệt thự</Option>
                    <Option value="liền kề trong khu đô thị/dự án">liền kề trong khu đô thị/dự án</Option>
                    <Option value="Căn hộ chung cư">Căn hộ chung cư</Option>
                    <Option value="Nhà tập thể">Nhà tập thể</Option>
                    <Option value="Sàn văn phòng">Sàn văn phòng</Option>
                    <Option value="Toà nhà văn phòng">Toà nhà văn phòng</Option>
                    <Option value="Toà nhà hỗn hợp">Toà nhà hỗn hợp</Option>
                    <Option value="Khách sạn">Khách sạn</Option>
                    <Option value="Nhà xưởng/Cửa hàng/Kho">Nhà xưởng/Cửa hàng/Kho</Option>
                    <Option value="CTXD khác">CTXD khác</Option>
                    <Option value="Đất trống">Đất trống</Option>
                </Select>
                <Select
                    placeholder="Tình trạng hồ sơ trên CLIM"
                    style={{ width: 200 }}
                    value={searchParams.profileCLIMStatus || undefined}
                    onChange={(value) => handleSelectChange('profileCLIMStatus', value)}
                    allowClear
                >
                    <Option value="Đã có đầy đủ hồ sơ">Đã có đầy đủ hồ sơ</Option>
                    <Option value="Thiếu hồ sơ">Thiếu hồ sơ</Option>
                </Select>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>Tìm kiếm</Button>
            </Space>
            <Space style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, marginRight: 20 }} wrap>
                <Button
                    onClick={() => navigate('/addCollateral')}
                    type="primary"
                    icon={<PlusOutlined />}>
                    Thêm mới
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={handleExport}>Xuất file</Button>
                <Button icon={<FileExcelOutlined />} onClick={handleImport}>Nhập file</Button>
            </Space>
            <Table
                style={{margin:20}}
                columns={columns}
                rowKey={(record) => record.code}
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['2', '5', '10', '20'],
                }}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />
            <Modal
                title="Nhập file"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <input type="file" accept=".xlsx, .csv" onChange={handleUploadChange} />
            </Modal>

            <Modal
                title="Import thành công"
                type='success'
                open={isSuccessModalVisible}
                onOk={handleSuccessModalOk}
                onCancel={handleSuccessModalOk}
            >
                <p>Số lượng bản ghi: {recordCount}</p>
            </Modal>
        </>

    );
};
export default AccsetManagement;