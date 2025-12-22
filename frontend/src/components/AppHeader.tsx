import { Layout, Button, Space, Typography, Avatar, Tooltip} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px #f0f1f2' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: '#1677ff' }}>
          Blog Platform
        </Link>

        <Space size="middle">
          {!user ? (
            <>
              <Link to="/login"><Button>Đăng nhập</Button></Link>
              <Link to="/register"><Button type="primary">Đăng ký</Button></Link>
            </>
          ) : (
            <>
              <Link to="/posts/new"><Button type="primary">Viết bài</Button></Link>
              <Tooltip title="Xem profile">
                <Avatar
                  style={{ cursor: 'pointer' }}
                  src={user.avatar || undefined}
                  icon={!user.avatar && <UserOutlined />}
                  onClick={() => navigate('/profile')}
                />
              </Tooltip>
              <Text strong>{user.username}</Text>
              <Button danger onClick={handleLogout}>Đăng xuất</Button>
            </>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
