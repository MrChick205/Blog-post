import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Card,
  Divider
} from "antd";
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { useAuth } from "@/contexts/AuthContext";
import { getPostById, deletePost } from "@/services/postService";
import {
  getLikeCount,
  getLikeStatus,
  toggleLike,
} from "@/services/likeService";
import { getCommentsByPost, createComment } from "@/services/commentService";
import useLoginModal from "../auth/UseLoginModal";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showLoginModal } = useLoginModal();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // LIKE
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // COMMENT
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
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
            user
              ? getLikeStatus(id).catch(() => ({ data: { liked: false } }))
              : Promise.resolve({ data: { liked: false } }),
            getCommentsByPost(id),
          ]);

        setPost(postRes.data);
        setLikeCount(Number(likeCountRes.data.like_count));
        setLiked(likeStatusRes.data.liked);
        setComments(commentRes.data);
      } catch {
        message.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, user]);

  // LIKE
  const handleLike = async () => {
    if (!user) {
      showLoginModal();
      return;
    }
    if (!id) return;
    try {
      await toggleLike(id);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch {
      message.error("Không thể like");
    }
  };

  // DELETE POST
  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePost(id);
      message.success("Đã xoá bài viết");
      navigate("/posts");
    } catch {
      message.error("Không thể xoá bài viết");
    }
  };

  // SUBMIT COMMENT
  const handleSubmitComment = async () => {
    if (!user) {
      showLoginModal();
      return;
    }
    if (!id || !commentContent.trim()) return;

    setSubmitting(true);
    try {
      await createComment({
        post_id: id,
        content: commentContent,
      });

      setCommentContent("");
      const res = await getCommentsByPost(id);
      setComments(res.data);
    } catch {
      message.error("Gửi bình luận thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <Card
      style={{
        maxWidth: 800,
        margin: "32px auto",
        borderRadius: 16,
        boxShadow: "0 10px 32px rgba(0,0,0,0.08)",
        padding: 24,
      }}
    >
      {/* ===== HEADER ===== */}
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          {post.title}
        </Title>

        <Space wrap>
          <Text type="secondary">
            {post.username} · {dayjs(post.created_at).format("DD/MM/YYYY HH:mm")}
          </Text>

          {isOwner && (
            <Space>
              <Button
                size="small"
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
                <Button
                  size="small"
                  danger
                  type="link"
                  icon={<DeleteOutlined />}
                >
                  Xoá
                </Button>
              </Popconfirm>
            </Space>
          )}
        </Space>
      </Space>

      <Divider />

      {/* ===== IMAGE ===== */}
      {post.image && (
        <Image
          src={post.image}
          style={{
            width: "100%",
            maxHeight: 420,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 16,
          }}
        />
      )}

      {/* ===== CONTENT ===== */}
      <Paragraph style={{ fontSize: 16, lineHeight: 1.7 }}>
        {post.content}
      </Paragraph>

      <Divider />

      {/* ===== ACTIONS ===== */}
      <Space size="large">
        <Button
          type="text"
          icon={
            liked ? (
              <LikeFilled style={{ color: "#1677ff" }} />
            ) : (
              <LikeOutlined />
            )
          }
          onClick={handleLike}
        >
          {likeCount}
        </Button>

        <Space>
          <MessageOutlined />
          <Text>{comments.length}</Text>
        </Space>
      </Space>

      <Divider />

      {/* ===== COMMENT INPUT ===== */}
      <div>
        <Title level={4}>Bình luận</Title>

        <TextArea
          rows={3}
          placeholder="Viết bình luận..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />

        <Button
          type="primary"
          loading={submitting}
          style={{ marginTop: 8 }}
          disabled={!commentContent.trim()}
          onClick={handleSubmitComment}
        >
          Gửi bình luận
        </Button>
      </div>

      {/* ===== COMMENT LIST ===== */}
      <List
        style={{ marginTop: 24 }}
        dataSource={comments}
        locale={{ emptyText: "Chưa có bình luận" }}
        itemLayout="horizontal"
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
                  <Text strong>{comment.username || "Ẩn danh"}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(comment.created_at).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </Space>
              }
              description={
                <Paragraph style={{ marginBottom: 0 }}>
                  {comment.content}
                </Paragraph>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );

};

export default PostDetailPage;
