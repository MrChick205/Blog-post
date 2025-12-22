import React, { useEffect, useState } from 'react';
import {Card, Typography, Avatar, Row, Col, List, Skeleton, Empty, Tag, Form, Input, Button, message, Upload, Space,} from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getAllPosts } from '../../services/postService';
import { Post } from '../../types';
import dayjs from 'dayjs';
import { updateProfileApi, uploadAvatarApi } from '../../services/authService';
const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await getAllPosts();
        const userPosts = res.data.filter((p: Post) => p.user_id === user.id);
        setPosts(userPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  if (!user) return <Empty description="Bạn cần đăng nhập" />;

  const onFinish = async (values: any) => {
  try {
    const res = await updateProfileApi({
      username: values.username,
      email: values.email,
    });
    updateUser(res.data); 
    message.success('Cập nhật thành công');
    setEditing(false);
  } catch (err: any) {
    console.error(err.response?.data || err);
    message.error(err.response?.data?.message || 'Không thể cập nhật thông tin');
  }
};

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <Card style={{ marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Avatar
              size={100}
              src={user.avatar || undefined}
              icon={!user.avatar && <UserOutlined />}
            />
          </Col>
          <Col flex="auto">
            {!editing ? (
              <>
                <Title level={3}>{user.username}</Title>
                <Text type="secondary">
                  <MailOutlined /> {user.email}
                </Text>
                <div style={{ marginTop: 12 }}>
                  <Tag color="blue">{posts.length} bài viết</Tag>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Button type="default" onClick={() => setEditing(true)}>
                    Chỉnh sửa thông tin
                  </Button>
                </div>
              </>
            ) : (
              <Form
                form={form}
                layout="vertical"
                initialValues={{ username: user.username, email: user.email }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Tên người dùng"
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Avatar" name="avatar">
                  <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false} 
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Lưu thay đổi
                    </Button>
                    <Button onClick={() => setEditing(false)}>Hủy</Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </Col>
        </Row>
      </Card>

      {/* Bài viết của user */}
      <Card title="Bài viết của bạn" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <>
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </>
        ) : posts.length === 0 ? (
          <Empty description="Chưa có bài viết nào" />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={posts}
            split={false}
            renderItem={(post) => (
              <List.Item
                key={post.id}
                style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}
              >
                <List.Item.Meta
                  title={<Text strong>{post.title}</Text>}
                  description={
                    <Text type="secondary">
                      {dayjs(post.created_at).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  }
                />
                <Paragraph ellipsis={{ rows: 2 }}>{post.content}</Paragraph>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
