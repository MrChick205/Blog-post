import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />

      <Content style={{ padding: '24px 0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Outlet />
        </div>
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
