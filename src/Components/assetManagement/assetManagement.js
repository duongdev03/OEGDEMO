import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { Table, Input, Select, Button, Space } from 'antd';
import { HomeOutlined, RightOutlined, EllipsisOutlined, FileExcelOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './AssetManagement.module.css';
import qs from 'qs';
const { Option } = Select;
const columns = [
    {
        title: 'STT',
        dataIndex: 'stt',
        width: '5%',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Mã tài sản BIDV',
        dataIndex: 'assetCode',
        width: '15%',
    },
    {
        title: 'CIF KH vay',
        dataIndex: 'cif',
        width: '10%',
    },
    {
        title: 'Tên KH',
        dataIndex: 'name',
        // render: (name) => `${name.first} ${name.last}`,
        width: '20%',
    },
    {
        title: 'CIF bên đảm bảo',
        dataIndex: 'cifGuarantor',
        width: '10%',
    },
    {
        title: 'Tên chủ tài sản',
        dataIndex: 'owner',
        // render: (owner) => `${owner.first} ${owner.last}`,
        width: '20%',
    },
    {
        title: 'Nơi đăng ký GDBĐ',
        dataIndex: 'place',
        width: '15%',
    },
    {
        title: 'tình trạng tài sản',
        dataIndex: 'status',
        width: '15%',
    },
    {
        title: 'tính chất pháp lý',
        dataIndex: 'legal',
        width: '15%',
    },
    {
        title: 'loại công trình',
        dataIndex: 'type',
        width: '15%',
    },
    {
        title: 'trạng thái hồ sơ trên CLIM',
        dataIndex: 'statusClim',
        width: '15%',
    },
    {
        title: 'tác vụ',
        dataIndex: 'action',
        width: '5%',
        render: (_, record) => (
            <div>
                <EllipsisOutlined className={styles.action} />
            </div>
        ),
    },
];
const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

// Dữ liệu mẫu (Mock Data)
const mockData = Array.from({ length: 200 }, (_, index) => ({
    key: index + 1,
    assetCode: `TSBIDV${1000 + index}`,
    cif: `CIF${2000 + index}`,
    name: `Khách hàng ${index + 1}`,
    cifGuarantor: `CIFG${3000 + index}`,
    owner: `Chủ tài sản ${index + 1}`,
    place: `Địa điểm ${index + 1}`,
    status: index % 2 === 0 ? 'Đang sử dụng' : 'Đã bán',
    legal: index % 2 === 0 ? 'Hợp lệ' : 'Chưa hợp lệ',
    type: index % 3 === 0 ? 'Nhà ở' : 'Đất trống',
    statusClim: index % 2 === 0 ? 'Đã duyệt' : 'Chưa duyệt',
    id: index + 1,
}));

const AccsetManagement = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    // const fetchData = () => {
    //     setLoading(true);
    //     fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
    //         .then((res) => res.json())
    //         .then(({ results }) => {
    //             setData(results);
    //             setLoading(false);
    //             setTableParams({
    //                 ...tableParams,
    //                 pagination: {
    //                     ...tableParams.pagination,
    //                     total: 200,
    //                     // 200 is mock data, you should read it from server
    //                     // total: data.totalCount,
    //                 },
    //             });
    //         });
    // };

    // Hàm lấy dữ liệu (dùng mock data)
    const fetchData = () => {
        setLoading(true);
        setTimeout(() => {
            setData(mockData);
            setLoading(false);
            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: mockData.length,
                },
            }));
        }, 500);
    };

    useEffect(fetchData, []);
    // useEffect(fetchData, [
    //     tableParams.pagination?.current,
    //     tableParams.pagination?.pageSize,
    //     tableParams?.sortOrder,
    //     tableParams?.sortField,
    //     JSON.stringify(tableParams.filters),
    // ]);
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
            fetchData();
        }
    };
    return (
        
        <>    
        <nav>
            <ul className={styles.nav}>
                <li><Link to="/"><HomeOutlined />Trang chủ <RightOutlined /></Link></li>
                <li><Link to="/AssetManagement">Quản lý tài sản</Link></li>
            </ul>
        </nav>  

            <h2 style={{ marginLeft: 20 }}>Quản lý tài sản đảm bảo</h2>
            <Space style={{ marginBottom: 16, marginLeft: 30 }} wrap>
                <Input placeholder="Mã tài sản BIDV" style={{ width: 200 }} />
                <Input placeholder="CIF Khách hàng vay" style={{ width: 200 }} />
                <Select placeholder="Tính chất pháp lý" style={{ width: 200 }}>
                    <Option value="Đã cấp GCN">Đã cấp GCN</Option>
                    <Option value="Chưa cấp GCN">Chưa cấp GCN</Option>
                </Select>
                <Select placeholder="Loại công trình" style={{ width: 200 }}>
                    <Option value="Nhà ở riêng lẻ">Nhà ở riêng lẻ</Option>
                    <Option value="Công trình khác">Công trình khác</Option>
                </Select>
                <Select placeholder="Tình trạng hồ sơ trên CLIM" style={{ width: 200 }}>
                    <Option value="Đã có đầy đủ hồ sơ">Đã có đầy đủ hồ sơ</Option>
                    <Option value="Thiếu hồ sơ">Thiếu hồ sơ</Option>
                </Select>
                <Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>
            </Space>
            <Space style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, marginRight: 20 }} wrap>
                <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
                <Button icon={<FileExcelOutlined />}>Xuất file</Button>
            </Space>
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </>

    );
};
export default AccsetManagement;