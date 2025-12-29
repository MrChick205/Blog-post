import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Divider,
  Space,
  Image,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getPostById,
  createPost,
  updatePost,
} from '../../services/postService';
import { Post } from '../../types';
import { getImageUrl } from '@/utils/image';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PostEditorPageProps {
  mode: 'create' | 'edit';
}

interface PostFormValues {
  title: string;
  content: string;
}

const PostEditorPage = ({ mode }: PostEditorPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm<PostFormValues>();

  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);

  // ===== IMAGE STATE =====
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

          form.setFieldsValue({
            title: post.title,
            content: post.content,
          });

          // ✅ LƯU ẢNH CŨ
          setCurrentImage(post.image || null);
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
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);

      // ✅ CHỈ GỬI FILE KHI USER CHỌN ẢNH MỚI
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (mode === 'create') {
        await createPost(formData);
        message.success('Đã tạo bài viết');
        navigate('/posts');
      }

      if (mode === 'edit' && id) {
        await updatePost(id, formData);
        message.success('Đã cập nhật bài viết');
        navigate(`/posts/${id}`);
      }
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
    <div style={{ maxWidth: 900, margin: '48px auto', padding: '0 16px' }}>
      <Card
        loading={loading}
        style={{
          borderRadius: 16,
          boxShadow: '0 10px 32px rgba(0,0,0,0.08)',
          padding: 32,
        }}
      >
        {/* ===== HEADER ===== */}
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            {mode === 'create' ? 'Viết bài mới' : 'Chỉnh sửa bài viết'}
          </Title>
          <Text type="secondary">
            {mode === 'create'
              ? 'Soạn nội dung và đăng bài viết mới'
              : 'Cập nhật nội dung bài viết'}
          </Text>
        </Space>

        <Divider style={{ margin: '24px 0' }} />

        {/* ===== FORM ===== */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 720 }}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input size="large" placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={10} />
          </Form.Item>

          {/* ===== ẢNH HIỆN TẠI ===== */}
          {currentImage && !imageFile && (
            <Form.Item label="Ảnh hiện tại">
              <Image
                src={getImageUrl(currentImage) || ''}
                width={240}
                style={{ borderRadius: 12 }}
              />
            </Form.Item>
          )}

          {/* ===== PREVIEW ẢNH MỚI ===== */}
          {imageFile && (
            <Form.Item label="Ảnh mới">
              <Image
                src={URL.createObjectURL(imageFile)}
                width={240}
                style={{ borderRadius: 12 }}
              />
            </Form.Item>
          )}

          {/* ===== FILE INPUT ===== */}
          <Form.Item label="Đổi ảnh (tuỳ chọn)">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
              }}
            />
          </Form.Item>

          {/* ===== ACTIONS ===== */}
          <Form.Item style={{ marginTop: 32 }}>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
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
