import React, { useEffect, useState } from 'react';
import {
  Card, Typography, Avatar, Row, Col, List,
  Skeleton, Empty, Tag, Button, Space, Form, Input, Upload, message
} from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getAllPosts, deletePost } from '../../services/postService';
import { Post } from '../../types';
import dayjs from 'dayjs';
import { updateProfileApi, getMeApi } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm] = Form.useForm();
  const navigate = useNavigate();

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
  const onFinishProfile = async (values) => {
  try {
    const updatedUser = await updateProfileApi({
      username: values.username,
      email: values.email,
      avatar: values.avatar,
    });
    if (!updatedUser.data.username) {
      const res = await getMeApi();
      updateUser(res.data);
    } else {
      updateUser(updatedUser.data);
    }
    message.success('Cập nhật thông tin thành công');
    setEditingProfile(false);
  } catch (err) {
    message.error(err.response?.data?.message || 'Không thể cập nhật thông tin');
  }
};



  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      message.success('Xóa bài viết thành công');
    } catch (err) {
      console.error(err);
      message.error('Xóa bài viết thất bại');
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={profileForm}
          layout="vertical"
          initialValues={{ username: user.username, email: user.email, avatar: user.avatar }}
          onFinish={onFinishProfile}
        >
          <Row gutter={16} align="middle">
            <Col>
              <Avatar
                size={100}
                src={user.avatar || undefined}
                icon={!user.avatar && <UserOutlined />}
              />
            </Col>
            <Col flex="auto">
              {!editingProfile ? (
                <>
                  <Title level={3}>{user.username}</Title>
                  <Text type="secondary"><MailOutlined /> {user.email}</Text>
                  <div style={{ marginTop: 12 }}>
                    <Tag color="blue">{posts.length} bài viết</Tag>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Space>
                      <Button onClick={() => setEditingProfile(true)}>Chỉnh sửa thông tin</Button>
                      <Button type="primary" onClick={() => navigate('/posts/new')}>
                        Thêm bài viết mới
                      </Button>
                    </Space>
                  </div>
                </>
              ) : (
                <>
                  <Form.Item label="Tên người dùng" name="username" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Avatar URL" name="avatar">
                    <Input placeholder="https://example.com/avatar.jpg" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">Lưu</Button>
                      <Button onClick={() => setEditingProfile(false)}>Hủy</Button>
                    </Space>
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="Bài viết của bạn">
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
            renderItem={post => (
              <List.Item
                key={post.id}
                actions={[
                  <Button
                    type="link"
                    key="edit"
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                  >
                    Sửa
                  </Button>,
                  <Button
                    type="link"
                    danger
                    key="delete"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Xóa
                  </Button>
                ]}
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt="Ảnh bài viết"
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginBottom: 12
                    }}
                  />
                )}
                <List.Item.Meta
                  title={<Text strong>{post.title}</Text>}
                  description={<Text type="secondary">{dayjs(post.created_at).format('DD/MM/YYYY HH:mm')}</Text>}
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
