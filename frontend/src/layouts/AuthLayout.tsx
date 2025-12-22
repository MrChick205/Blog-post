import { Card, Typography } from 'antd';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const AuthLayout = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <Card className="auth-card" style={{ width: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 8 }}>
            Blog Platform
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Chia sẻ ý tưởng, bình luận và tương tác với mọi người.
          </Paragraph>
        </div>
        <Outlet />
      </Card>
    </div>
  );
};

export default AuthLayout;


