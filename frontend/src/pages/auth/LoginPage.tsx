import { Form, Input, Button, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    await login(values.email, values.password);
    navigate('/');
  };

  return (
    <>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input size="large" prefix={<MailOutlined />} placeholder="you@example.com" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••••" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <Button type="primary" htmlType="submit" size="large" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Text type="secondary">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </Text>
      </div>
    </>
  );
};

export default LoginPage;


