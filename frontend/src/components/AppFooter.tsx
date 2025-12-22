import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter = () => (
  <Footer style={{ textAlign: 'center', background: '#fafafa', borderTop: '1px solid #f0f0f0', padding: '16px 0' }}>
    <Text type="secondary">© {new Date().getFullYear()} Blog Platform</Text>
  </Footer>
);

export default AppFooter;
