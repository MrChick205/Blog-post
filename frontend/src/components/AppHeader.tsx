import { Layout, Button, Space, Typography, Avatar, Tooltip } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
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
    <Header
      style={{
        position: 'sticky',     
        top: 0,
        zIndex: 1000,
        background: '#f5f9ff',
        padding: '0 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 64,
        }}
      >
        <Link
          to="/"
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: '#1677ff',
            letterSpacing: 0.5,
          }}
        >
          Blog Platform
        </Link>
        <Space size={20} align="center">
          {!user ? (
            <>
              <Link to="/login">
                <Button>Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button type="primary">Đăng ký</Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate('/posts/new')}
              >
                Viết bài
              </Button>

              <Tooltip title="Xem profile">
                <Space
                  size={8}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/profile')}
                >
                  <Avatar
                    size={36}
                    src={user.avatar || undefined}
                    icon={!user.avatar && <UserOutlined />}
                  />
                  <Text strong>{user.username}</Text>
                </Space>
              </Tooltip>

              <Button
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
