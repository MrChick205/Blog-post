import { Form, Input, Button, Typography } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Text } = Typography;

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    await register(values.username, values.email, values.password);
    navigate('/');
  };

  return (
    <>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên người dùng"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
        >
          <Input size="large" prefix={<UserOutlined />} placeholder="Tên hiển thị" />
        </Form.Item>
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
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
        >
          <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••••" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <Button type="primary" htmlType="submit" size="large" block>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Text type="secondary">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </Text>
      </div>
    </>
  );
};

export default RegisterPage;


