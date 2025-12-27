// pages/ModelListPage.tsx
import React from 'react';
import { Layout, Typography, Segmented, Space, Button, theme } from 'antd';
import { AppstoreOutlined, BarsOutlined, SettingOutlined } from '@ant-design/icons';
import { useModelListLogic } from '@/components/Cms/hooks/useModelListLogic';
import { ModelCardView } from '@/components/Cms/ModelCardView';
import { ModelListView } from '@/components/Cms/ModelListView';

const { Header, Content } = Layout;
const { Title } = Typography;

const ModelListPage: React.FC = () => {
  // 1. 获取 Data Layer
  const { models, viewMode, actions } = useModelListLogic();

  // AntD 样式 Token
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Header
        style={{
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          模型管理 (Content Types)
        </Title>
        <Space>
          {/* 视图切换器 */}
          <Segmented
            value={viewMode}
            onChange={(val) => actions.toggleViewMode(val as any)}
            options={[
              { value: 'card', icon: <AppstoreOutlined />, label: '卡片' },
              { value: 'list', icon: <BarsOutlined />, label: '列表' },
            ]}
          />
          <Button icon={<SettingOutlined />}>设置</Button>
        </Space>
      </Header>

      <Content style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* 2. 根据状态渲染 Presentation Layer */}
        {viewMode === 'card' ? (
          <ModelCardView models={models} onCreate={actions.navigateToCreate} onEdit={actions.navigateToEdit} />
        ) : (
          <ModelListView models={models} onCreate={actions.navigateToCreate} onEdit={actions.navigateToEdit} />
        )}
      </Content>
    </Layout>
  );
};

export default ModelListPage;
