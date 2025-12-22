import React, { useEffect, useState } from 'react';
import {
  Card, Typography, Avatar, Row, Col, List,
  Skeleton, Empty, Tag, Button, Space, Form, Input, Upload, message
} from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getAllPosts, createPost, updatePost, deletePost } from '../../services/postService';
import { uploadAvatarApi, updateProfileApi } from '../../services/authService';
import { Post } from '../../types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingPost, setAddingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [profileForm] = Form.useForm();
  const [postForm] = Form.useForm();
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
  const onFinishProfile = async (values: any) => {
    try {
      if (values.avatar && values.avatar.file) {
        const uploadRes = await uploadAvatarApi(values.avatar.file);
        values.avatar = uploadRes.data.url;
      } else {
        delete values.avatar;
      }
      const res = await updateProfileApi(values);
      updateUser(res.data);
      message.success('Cập nhật thông tin thành công');
      setEditingProfile(false);
    } catch (err: any) {
      console.error(err.response?.data || err);
      message.error(err.response?.data?.message || 'Không thể cập nhật thông tin');
    }
  };
  const onFinishPost = async (values: any) => {
    try {
      if (editingPost) {
        const res = await updatePost(editingPost.id, values);
        setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...res.data } : p));
        message.success('Cập nhật bài viết thành công');
        setEditingPost(null);
      } else {
        const res = await createPost({ ...values, user_id: user.id, username: user.username });
        setPosts(prev => [res.data, ...prev]);
        message.success('Thêm bài viết thành công');
        setAddingPost(false);
      }
      postForm.resetFields();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi lưu bài viết');
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Thông tin user */}
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={profileForm}
          layout="vertical"
          initialValues={{ username: user.username, email: user.email }}
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
                    <Button onClick={() => setEditingProfile(true)}>Chỉnh sửa thông tin</Button>
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
                  <Form.Item label="Avatar" name="avatar">
                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
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

      {/* Thêm / Sửa bài viết */}
      {(addingPost || editingPost) && (
        <Card style={{ marginBottom: 16 }}>
          <Form
            form={postForm}
            layout="vertical"
            initialValues={editingPost ? { title: editingPost.title, content: editingPost.content } : {}}
            onFinish={onFinishPost}
          >
            <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Nội dung" name="content" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">Lưu</Button>
                <Button onClick={() => { setAddingPost(false); setEditingPost(null); postForm.resetFields(); }}>Hủy</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => { setAddingPost(true); postForm.resetFields(); }}>
        Thêm bài viết mới
      </Button>
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
                  <Button type="link" key="edit" onClick={() => {
                    setEditingPost(post);
                    postForm.setFieldsValue({ title: post.title, content: post.content });
                  }}>Sửa</Button>,
                  <Button type="link" danger key="delete" onClick={async () => {
                    try {
                      await deletePost(post.id);
                      setPosts(prev => prev.filter(p => p.id !== post.id));
                      message.success('Xóa bài viết thành công');
                    } catch (err) {
                      console.error(err);
                      message.error('Xóa bài viết thất bại');
                    }
                  }}>Xóa</Button>
                ]}
              >
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
