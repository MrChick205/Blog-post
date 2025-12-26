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

  // LIKE
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // COMMENT
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwner = user && post && user.id === post.user_id;

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        const [
          postRes,
          likeCountRes,
          likeStatusRes,
          commentRes,
        ] = await Promise.all([
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

  // LIKE
  const handleLike = async () => {
    if (!id) return;
    try {
      await toggleLike(id);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch {
      message.error('Không thể like');
    }
  };

  // DELETE POST
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

  // SUBMIT COMMENT
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
    } catch {
      message.error('Gửi bình luận thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* TITLE */}
      <Title level={2}>{post.title}</Title>

      {/* META + OWNER ACTION */}
      <Space wrap style={{ marginBottom: 12 }}>
        <Text type="secondary">
          {post.username} ·{' '}
          {dayjs(post.created_at).format('DD/MM/YYYY HH:mm')}
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
              description="Hành động này không thể hoàn tác"
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
      {post.image && (
        <Image
          src={post.image}
          style={{
            width: '100%',
            maxHeight: 420,
            objectFit: 'cover',
            borderRadius: 12,
            marginBottom: 16,
          }}
        />
      )}

      {/* CONTENT */}
      <Paragraph>{post.content}</Paragraph>

      {/* ACTIONS */}
      <Space size="large" style={{ marginTop: 12 }}>
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

      {/* COMMENT INPUT */}
      <div style={{ marginTop: 32 }}>
        <Title level={4}>Bình luận</Title>

        <TextArea
          rows={3}
          placeholder={
            user ? 'Viết bình luận...' : 'Đăng nhập để bình luận'
          }
          value={commentContent}
          disabled={!user}
          onChange={(e) => setCommentContent(e.target.value)}
        />

        <Button
          type="primary"
          loading={submitting}
          style={{ marginTop: 8 }}
          disabled={!user || !commentContent.trim()}
          onClick={handleSubmitComment}
        >
          Gửi bình luận
        </Button>
      </div>

      {/* COMMENT LIST */}
      <List
        style={{ marginTop: 24 }}
        dataSource={comments}
        locale={{ emptyText: 'Chưa có bình luận' }}
        renderItem={(comment) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={comment.user_avatar}
                  icon={<UserOutlined />}
                />
              }
              title={
                <Space>
                  <Text strong>
                    {comment.username || 'Ẩn danh'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(comment.created_at).format(
                      'DD/MM/YYYY HH:mm'
                    )}
                  </Text>
                </Space>
              }
              description={<Paragraph>{comment.content}</Paragraph>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default PostDetailPage;
