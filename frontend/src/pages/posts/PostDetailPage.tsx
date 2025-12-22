import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Spin,
  Space,
  Button,
  Input,
  List,
  Avatar,
  message,
  Popconfirm,
  Image,
} from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { useAuth } from '@/contexts/AuthContext';
import { getPostById, deletePost } from '@/services/postService';
import {
  getLikeCount,
  getLikeStatus,
  toggleLike,
} from '@/services/likeService';
import {
  getCommentsByPost,
  createComment,
} from '@/services/commentService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwner = user && post && user.id === post.user_id;

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        const [postRes, likeCountRes, likeStatusRes, commentRes] =
          await Promise.all([
            getPostById(id),
            getLikeCount(id),
            getLikeStatus(id),
            getCommentsByPost(id),
          ]);

        setPost(postRes.data);
        setLikeCount(Number(likeCountRes.data.like_count));
        setLiked(likeStatusRes.data.liked);
        setComments(commentRes.data);
      } catch {
        message.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const handleLike = async () => {
    if (!id) return;
    try {
      await toggleLike(id);
      setLiked(prev => !prev);
      setLikeCount(prev => (liked ? prev - 1 : prev + 1));
    } catch {
      message.error('Không thể like');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePost(id);
      message.success('Đã xoá bài viết');
      navigate('/posts');
    } catch {
      message.error('Không thể xoá bài viết');
    }
  };

  const handleSubmitComment = async () => {
    if (!id || !commentContent.trim()) return;

    setSubmitting(true);
    try {
      await createComment({
        post_id: id,
        content: commentContent,
      });

      setCommentContent('');
      const res = await getCommentsByPost(id);
      setComments(res.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>{post.title}</Title>

      <Space wrap>
        <Text type="secondary">
          {post.username} · {dayjs(post.created_at).format('DD/MM/YYYY HH:mm')}
        </Text>

        {isOwner && (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/posts/${id}/edit`)}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xoá bài viết?"
              okText="Xoá"
              cancelText="Huỷ"
              onConfirm={handleDelete}
            >
              <Button danger type="link" icon={<DeleteOutlined />}>
                Xoá
              </Button>
            </Popconfirm>
          </Space>
        )}
      </Space>

      {/* IMAGE */}
      {post.image && (
        <Image
          src={post.image}
          style={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 12,
            marginTop: 16,
          }}
        />
      )}

      <Paragraph style={{ marginTop: 16 }}>
        {post.content}
      </Paragraph>

      <Space size="large">
        <Button
          type="text"
          icon={liked ? <LikeFilled /> : <LikeOutlined />}
          onClick={handleLike}
        >
          {likeCount}
        </Button>

        <Button type="text" icon={<MessageOutlined />}>
          {comments.length}
        </Button>
      </Space>

    </div>
  );
};

export default PostDetailPage;
