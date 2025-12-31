import React, { useState } from 'react';
import {
    Layout,
    Menu,
    Button,
    Input,
    Select,
    DatePicker,
    Table,
    Tag,
    Avatar,
    Tabs,
    Card,
    Row,
    Col,
    Space,
    Typography,
    Dropdown,
    Badge,
    theme
} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SearchOutlined,
    BellOutlined,
    SettingOutlined,
    MessageOutlined,
    PhoneOutlined,
    AudioOutlined,
    DownloadOutlined,
    PlusOutlined,
    MoreOutlined,
    EditOutlined,
    FileTextOutlined,
    GlobalOutlined,
    CarOutlined,
    AppstoreOutlined,
    DollarOutlined,
    RiseOutlined,
    FileProtectOutlined,
    UserOutlined,
    FilterOutlined,
    DownOutlined
} from '@ant-design/icons';
import { cn } from '@/utils/cn';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// --- Mock Data & Interfaces ---

interface Invoice {
    key: string;
    id: string;
    customer: string;
    status: 'Draft' | 'Paid' | 'Sent';
    createDate: string;
    invoiceDate: string;
    payDate: string;
    amount: string;
    createBy: string; // url or name
}

const invoiceData: Invoice[] = [
    { key: '1', id: '#QW0012', customer: 'EPES Logistics', status: 'Draft', createDate: 'Jun 18, 2022', invoiceDate: 'Jun 18, 2022', payDate: 'Jun 18, 2022', amount: '$11,134', createBy: 'Chase' },
    { key: '2', id: '#QW0012', customer: 'USA Trucks', status: 'Paid', createDate: 'Jan 11, 2022', invoiceDate: 'Jan 11, 2022', payDate: 'Jan 11, 2022', amount: '$4,000', createBy: 'Chase' },
    { key: '3', id: '#QW0012', customer: 'Surge Transportation', status: 'Paid', createDate: 'Jan 23, 2022', invoiceDate: 'Jan 23, 2022', payDate: 'Jan 23, 2022', amount: '$123', createBy: 'Chase' },
    { key: '4', id: '#QW0012', customer: 'Simple Logistics Solutions', status: 'Paid', createDate: 'Jan 11, 2022', invoiceDate: 'Jan 11, 2022', payDate: 'Jan 11, 2022', amount: '$1,220', createBy: 'Chase' },
    { key: '5', id: '#QW0012', customer: 'TA Services', status: 'Paid', createDate: 'Jun 10, 2022', invoiceDate: 'Jun 10, 2022', payDate: 'Jun 10, 2022', amount: '$8,123', createBy: 'Shelly' },
    { key: '6', id: '#QW0012', customer: 'Fifth Wheel Freight', status: 'Paid', createDate: 'Jan 11, 2022', invoiceDate: 'Jan 11, 2022', payDate: 'Jan 11, 2022', amount: '$3,000', createBy: 'Shelly' },
    { key: '7', id: '#QW0012', customer: 'Keller Freight Solutions', status: 'Sent', createDate: 'Jan 11, 2022', invoiceDate: 'Jan 11, 2022', payDate: 'Jan 11, 2022', amount: '$3,234', createBy: 'Wang' },
];

export const HomeLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token } = theme.useToken();

    const siderWidth = 260; // Wide sidebar as in design
    const collapsedWidth = 80;

    const statsCards = [
        { title: 'Loads ready for invoicing', value: '1,462', change: '5%', up: true, data: [2, 4, 3, 5, 4, 6, 8] },
        { title: 'Draft Invoice', value: '234', change: '5%', up: true, data: [3, 5, 4, 6, 5, 7, 6] },
        { title: 'Paid Invoice', value: '886', change: '5%', up: true, data: [4, 3, 5, 4, 6, 5, 8] },
    ];

    const columns = [
        {
            title: 'Invoice ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <span className="text-gray-500 font-medium">{text}</span>
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                let dotColor = 'bg-gray-400';
                if (status === 'Draft') { color = 'default'; dotColor = 'bg-gray-400'; }
                if (status === 'Paid') { color = 'success'; dotColor = 'bg-green-500'; }
                if (status === 'Sent') { color = 'processing'; dotColor = 'bg-blue-500'; }

                return (
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                        <span className="font-medium text-gray-700">{status}</span>
                    </div>
                );
            }
        },
        { title: 'Create Date', dataIndex: 'createDate', key: 'createDate', sorter: true },
        { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate', sorter: true },
        { title: 'Pay Date', dataIndex: 'payDate', key: 'payDate', sorter: true },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            sorter: true,
            render: (amount: string) => <span className="font-bold text-gray-800">{amount}</span>
        },
        {
            title: 'Create By',
            dataIndex: 'createBy',
            key: 'createBy',
            render: (name: string) => {
                const colorMap: Record<string, string> = { Chase: '#722ed1', Shelly: '#f5222d', Wang: '#faad14' };
                return (
                    <div className="flex items-center gap-2">
                        <Avatar size="small" style={{ backgroundColor: colorMap[name] || '#1890ff', color: '#fff', fontSize: '10px' }}>
                            <UserOutlined />
                        </Avatar>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${name === 'Chase' ? 'bg-purple-100 text-purple-700' : name === 'Shelly' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                            {name}
                        </span>
                    </div>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space>
                    <Button type="text" icon={<EditOutlined className="text-gray-400" />} />
                    <Button type="text" icon={<MoreOutlined className="text-gray-400" />} />
                </Space>
            )
        }
    ];

    return (
        <Layout className="min-h-screen bg-gray-50/50">
            {/* Top Header */}
            <Header
                className="sticky top-0 z-20 flex w-full items-center justify-between px-6 shadow-sm border-b border-gray-100"
                style={{ background: '#fff', height: 64, paddingInline: 24 }}
            >
                {/* Logo Area */}
                <div className="flex items-center gap-2 min-w-[200px]">
                    <div className="bg-blue-600 text-white p-1 rounded font-bold text-xs h-8 w-8 flex items-center justify-center">TP</div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-bold text-blue-900 tracking-tight">TRUCKER PATH</span>
                        <span className="font-bold text-blue-500 text-[10px] tracking-widest">COMMAND</span>
                    </div>
                </div>

                {/* Top Navigation */}
                <div className="flex-1 flex px-8 overflow-x-auto">
                    <Menu
                        mode="horizontal"
                        selectedKeys={['accounting']}
                        className="border-b-0 w-full min-w-[500px] bg-transparent text-gray-500 font-medium [&_.ant-menu-item-selected]:!text-blue-600 [&_.ant-menu-item-selected]:after:!border-blue-600"
                        items={[
                            { label: 'Dashboard', key: 'dashboard', icon: <AppstoreOutlined /> },
                            { label: 'Trips', key: 'trips', icon: <GlobalOutlined /> }, // Icon approx
                            { label: 'Dispatching', key: 'dispatching', icon: <CarOutlined /> },
                            { label: 'Load Planer', key: 'loadplaner', icon: <FileTextOutlined /> },
                            { label: 'Fleet', key: 'fleet', icon: <CarOutlined /> },
                            { label: 'Accounting', key: 'accounting', icon: <DollarOutlined /> },
                        ]}
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 text-gray-500">
                    <MessageOutlined className="text-lg cursor-pointer hover:text-blue-600" />
                    <PhoneOutlined className="text-lg cursor-pointer hover:text-blue-600" />
                    <AudioOutlined className="text-lg cursor-pointer hover:text-blue-600" />
                    <SettingOutlined className="text-lg cursor-pointer hover:text-blue-600" />
                    <Avatar className="bg-blue-100 text-blue-600 font-bold border border-blue-200 cursor-pointer">DV</Avatar>
                </div>
            </Header>

            <Layout>
                {/* Sidebar */}
                <Sider
                    theme="light"
                    width={siderWidth}
                    className="!bg-white border-r border-gray-100 hidden md:block" // Hidden on small screens for responsiveness
                    style={{ position: 'fixed', left: 0, bottom: 0, top: 64, zIndex: 10, height: 'calc(100vh - 64px)' }}
                >
                    <div className="py-4">
                        <div className="px-6 pb-2 text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                            <DollarOutlined /> Accounting <DownOutlined className="text-[10px]" />
                        </div>
                        <Menu
                            mode="inline"
                            selectedKeys={['invoice']}
                            className="border-r-0 !bg-transparent px-2 gap-1 flex flex-col"
                            items={[
                                { label: 'Driver Settlement', key: 'driver', icon: <FileTextOutlined /> },
                                { label: 'Quickbooks', key: 'quickbooks', icon: <GlobalOutlined /> },
                                { label: 'Invoice', key: 'invoice', icon: <FileProtectOutlined /> }, // Highlighted in blue bg in design
                                { label: 'Expense', key: 'expense', icon: <DollarOutlined /> },
                                { label: 'IFTA', key: 'ifta', icon: <FileTextOutlined /> },
                            ]}
                            // Custom styling for selected item to match 'soft blue' pill in design
                            style={{
                                border: 'none'
                            }}
                        />
                        <style>{`
                            .ant-menu-item-selected {
                                background-color: #e6f7ff !important;
                                color: #1890ff !important;
                                border-radius: 8px;
                                font-weight: 600;
                            }
                        `}</style>
                    </div>
                </Sider>

                {/* Main Content */}
                <Layout style={{ marginLeft: siderWidth, marginTop: 0 }} className="transition-all duration-300">
                    <Content className="p-8 min-h-[calc(100vh-64px)] overflow-x-auto">

                        <div className="flex items-center justify-between mb-6">
                            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Invoice</Title>
                            <div className="flex gap-3">
                                <Button icon={<DownloadOutlined />} className="font-medium text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">DOWNLOAD PDF</Button>
                                <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 hover:bg-blue-700 font-medium px-6">ADD INVOICE</Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs
                            defaultActiveKey="1"
                            className="font-medium mb-6"
                            items={[
                                { label: 'All', key: '1' },
                                { label: 'Draft', key: '2' },
                                { label: 'Send', key: '3' },
                                { label: 'Paid', key: '4' },
                            ]}
                        />

                        {/* Stats Cards */}
                        <Row gutter={24} className="mb-8">
                            {statsCards.map((stat, idx) => (
                                <Col xs={24} sm={12} lg={8} key={idx}>
                                    <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-gray-500 font-medium mb-1">{stat.title}</div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                                                    <span className="text-green-500 text-sm font-semibold flex items-center">
                                                        <RiseOutlined className="mr-1" /> {stat.change}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Simple Sparkline Placeholder */}
                                            <div className="h-12 w-24">
                                                <svg viewBox="0 0 100 40" className="w-full h-full stroke-blue-400 stroke-2 fill-none overflow-visible">
                                                    <path d="M0,35 C10,35 15,20 25,20 C35,20 40,30 50,30 C60,30 65,10 75,10 C85,10 90,25 100,20" />
                                                    <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.2 }} />
                                                        <stop offset="100%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0 }} />
                                                    </linearGradient>
                                                    <path d="M0,35 C10,35 15,20 25,20 C35,20 40,30 50,30 C60,30 65,10 75,10 C85,10 90,25 100,20 V40 H0 Z" style={{ fill: `url(#grad-${idx})`, stroke: 'none' }} />
                                                </svg>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Filters */}
                        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center border border-gray-100">
                            <Input
                                placeholder="Search (Invoice ID)"
                                prefix={<SearchOutlined className="text-gray-400" />}
                                className="w-64 rounded-lg bg-gray-50"
                            />
                            <RangePicker className="rounded-lg bg-gray-50" />

                            <Select defaultValue="status" className="w-32" options={[{ value: 'status', label: 'Status' }]} />
                            <Select defaultValue="carrier" className="w-32" options={[{ value: 'carrier', label: 'Carrier' }]} />

                            <Button icon={<FilterOutlined />} className="text-gray-600 border-gray-300">Filters</Button>
                            <Button type="text" className="text-gray-400 hover:text-gray-600">Clear All</Button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <Table
                                columns={columns}
                                dataSource={invoiceData}
                                rowSelection={{ type: 'checkbox' }}
                                pagination={false}
                                className="[&_.ant-table-thead_th]:!bg-white [&_.ant-table-thead_th]:!text-gray-400 [&_.ant-table-thead_th]:!font-medium"
                            />
                        </div>

                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};
