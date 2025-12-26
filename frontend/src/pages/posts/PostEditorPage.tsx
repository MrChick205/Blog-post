import { Card, Form, Input, Button, Typography, message, Divider, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPostById, createPost, updatePost } from '../../services/postService';
import { Post } from '../../types';
const { Title } = Typography;
const { TextArea } = Input;
interface PostEditorPageProps {
  mode: 'create' | 'edit';
}
interface PostFormValues {
  title: string;
  content: string;
  image?: string;
}

const PostEditorPage = ({ mode }: PostEditorPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm<PostFormValues>();
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchPost = async () => {
      if (mode === 'edit' && id) {
        setLoading(true);
        try {
          const res = await getPostById(id);
          const post: Post = res.data;
          form.setFieldsValue({ title: post.title, content: post.content, image: post.image });
        } catch {
          message.error('Không thể tải bài viết');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [mode, id, form]);

  const onFinish = async (values: PostFormValues) => {
    setSubmitting(true);
    try {
      if (mode === 'create') {
        await createPost(values);
        message.success('Đã tạo bài viết');
        navigate(`/posts/`);
      } else if (mode === 'edit' && id) {
        await updatePost(id, values);
        message.success('Đã cập nhật bài viết');
        navigate(`/posts/${id}`);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (mode === 'edit' && id) {
      navigate(`/posts/${id}`);
    } else {
      navigate('/posts');
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        padding: '0 16px',
      }}
    >
      <Card
        loading={loading}
        style={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          borderRadius: 12,
          backgroundColor: '#fdfdfd',
          padding: 24,
        }}
      >
        <Title level={3} style={{ marginBottom: 8 }}>
          {mode === 'create' ? 'Viết bài mới' : 'Chỉnh sửa bài viết'}
        </Title>
        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input
              placeholder="Nhập tiêu đề bài viết"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea
              rows={8}
              placeholder="Nội dung bài viết..."
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item label="Ảnh (URL)" name="image">
            <Input
              placeholder="https://example.com/image.jpg"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <Space size="middle" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel} style={{ borderRadius: 8 }}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ borderRadius: 8 }}
              >
                {mode === 'create' ? 'Đăng bài' : 'Lưu thay đổi'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PostEditorPage;
