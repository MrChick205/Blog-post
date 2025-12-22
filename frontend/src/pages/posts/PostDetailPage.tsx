import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Input, Button, message, Typography } from 'antd';
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

  // Chưa login → đá về login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Load bài viết khi edit
  useEffect(() => {
    const fetchPost = async () => {
      if (mode === 'edit' && id) {
        setLoading(true);
        try {
          const res = await getPostById(id);
          const post: Post = res.data;

          form.setFieldsValue({
            title: post.title,
            content: post.content,
            image: post.image || '',
          });
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
        const res = await createPost(values);
        message.success('Đã tạo bài viết');
        navigate(`/posts/${res.data.id}`);
      }

      if (mode === 'edit' && id) {
        await updatePost(id, values);
        message.success('Đã cập nhật bài viết');
        navigate(`/posts/${id}`);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card loading={loading}>
      <Title level={3} style={{ marginBottom: 16 }}>
        {mode === 'create' ? 'Viết bài mới' : 'Chỉnh sửa bài viết'}
      </Title>

      <Form<PostFormValues>
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <TextArea rows={8} placeholder="Nội dung bài viết..." />
        </Form.Item>

        <Form.Item label="Ảnh (URL)" name="image">
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {mode === 'create' ? 'Đăng bài' : 'Lưu thay đổi'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PostEditorPage;
