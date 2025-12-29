import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Avatar,
  Row,
  Col,
  List,
  Skeleton,
  Empty,
  Tag,
  Button,
  Space,
  Form,
  Input,
  message,
} from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getAllPosts, deletePost } from '../../services/postService';
import { Post } from '../../types';
import dayjs from 'dayjs';
import { updateProfileApi } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@/utils/image';

import '../css/ProfilePage.css';

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const [profileForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await getAllPosts();
        setPosts(res.data.filter((p: Post) => p.user_id === user.id));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    setPreviewAvatar(user.avatar || null);
  }, [user]);

  if (!user) return <Empty description="Bạn cần đăng nhập" />;
  const onFinishProfile = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await updateProfileApi(formData);

      updateUser(res.data);

      setPreviewAvatar(res.data.avatar || null);
      setAvatarFile(null);
      setEditingProfile(false);

      profileForm.setFieldsValue({
        username: res.data.username,
        email: res.data.email,
      });

      message.success('Cập nhật thông tin thành công');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể cập nhật thông tin');
    }
  };
  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      message.success('Xóa bài viết thành công');
    } catch {
      message.error('Xóa bài viết thất bại');
    }
  };
  const handleEditProfile = () => {
    setEditingProfile(true);
    profileForm.setFieldsValue({
      username: user.username,
      email: user.email,
    });
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    setAvatarFile(null);
    setPreviewAvatar(user.avatar || null);
    profileForm.setFieldsValue({
      username: user.username,
      email: user.email,
    });
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={onFinishProfile}
        >
          <Row gutter={24} align="middle" className="profile-header">
            <Col>
              <Avatar
                size={96}
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : previewAvatar
                    ? getImageUrl(previewAvatar)
                    : undefined
                }
                icon={<UserOutlined />}
              />
            </Col>

            <Col flex="auto">
              {!editingProfile ? (
                <>
                  <Title level={3}>{user.username}</Title>
                  <Text type="secondary">
                    <MailOutlined /> {user.email}
                  </Text>

                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{posts.length} bài viết</Tag>
                  </div>

                  <Space style={{ marginTop: 16 }}>
                    <Button onClick={handleEditProfile}>
                      Chỉnh sửa thông tin
                    </Button>
                    <Button type="primary" onClick={() => navigate('/posts/new')}>
                      Thêm bài viết mới
                    </Button>
                  </Space>
                </>
              ) : (
                <>
                  <Form.Item
                    label="Tên người dùng"
                    name="username"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên người dùng' },
                      { min: 3, message: 'Tối thiểu 3 ký tự' },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="Đổi avatar (tùy chọn)">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0] || null;
                        setAvatarFile(file);
                      }}
                    />
                  </Form.Item>

                  <Space>
                    <Button type="primary" htmlType="submit">
                      Lưu
                    </Button>
                    <Button onClick={handleCancelEdit}>
                      Hủy
                    </Button>
                  </Space>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="Bài viết của bạn" className="profile-posts-card">
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : posts.length === 0 ? (
          <Empty description="Chưa có bài viết nào" />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={posts}
            renderItem={post => (
              <List.Item
                key={post.id}
                actions={[
                  <Button
                    type="link"
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                  >
                    Sửa
                  </Button>,
                  <Button
                    type="link"
                    danger
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Xóa
                  </Button>,
                ]}
              >
               {post.image && (
                <div className="profile-post-image-wrapper">
                  <img src={getImageUrl(post.image)} alt="" />
                </div>
              )}


                <List.Item.Meta
                  title={<Text strong>{post.title}</Text>}
                  description={dayjs(post.created_at).format('DD/MM/YYYY HH:mm')}
                />

                <Paragraph ellipsis={{ rows: 2 }}>
                  {post.content}
                </Paragraph>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
