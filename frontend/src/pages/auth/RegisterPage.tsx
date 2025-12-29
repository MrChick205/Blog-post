import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Text } = Typography;
interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      await register(values.username, values.email, values.password);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login'); 
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Đăng ký thất bại';
      message.error(msg);
    }
  };

  return (
    <>
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ username: '', email: '', phone: '', password: '' }}
    >
      <Form.Item
        label="Tên người dùng"
        name="username"
        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
      >
        <Input
          size="large"
          prefix={<UserOutlined />}
          placeholder="Tên hiển thị"
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' },
          {
            pattern: /^[a-zA-Z0-9][\w.-]*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
            message: 'Email không được bắt đầu bằng ký tự đặc biệt',
          },
        ]}
      >
        <Input
          size="large"
          prefix={<MailOutlined />}
          placeholder="you@example.com"
        />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại' },
          { pattern: /^[0-9]{10,15}$/, message: 'Số điện thoại không hợp lệ' },
        ]}
      >
        <Input size="large" placeholder="Số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          { min: 6, message: 'Tối thiểu 6 ký tự' },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined />}
          placeholder="••••••••"
        />
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
