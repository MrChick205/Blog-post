import {
  Card,
  Typography,
  Tag,
  Skeleton,
  Empty,
  Button,
  Space,
} from "antd";
import { MessageOutlined, LikeOutlined, LikeFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getAllPosts } from "../../services/postService";
import {
  getLikeStatus,
  getLikeCount,
  toggleLike,
} from "../../services/likeService";
import { Post } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import useLoginModal from "../auth/UseLoginModal";
import { getImageUrl } from "@/utils/image";

const { Title, Paragraph, Text } = Typography;

interface PostUI extends Post {
  liked: boolean;
  likeCount: number;
}

const PostListPage = () => {
  const [posts, setPosts] = useState<PostUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { showLoginModal } = useLoginModal();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPosts();

        const postsWithLike = await Promise.all(
          res.data.map(async (post: Post) => {
            const [statusRes, countRes] = await Promise.all([
              user
                ? getLikeStatus(post.id).catch(() => ({
                    data: { liked: false },
                  }))
                : Promise.resolve({ data: { liked: false } }),
              getLikeCount(post.id),
            ]);

            return {
              ...post,
              liked: statusRes.data.liked,
              likeCount: Number(countRes.data.like_count),
            };
          })
        );

        setPosts(postsWithLike);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handleLike = async (postId: string) => {
    if (!user) {
      showLoginModal();
      return;
    }
    try {
      setLikingId(postId);
      await toggleLike(postId);
      const countRes = await getLikeCount(postId);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, liked: !post.liked, likeCount: Number(countRes.data.like_count) }
            : post
        )
      );
    } finally {
      setLikingId(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        maxWidth: 1100,
        margin: "40px auto",
        padding: "0 24px",
        background: "#fafafa",
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: "#1677ff",
          marginBottom: 48,
          fontWeight: 600,
        }}
      >
        Bài viết mới nhất
      </Title>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Skeleton active avatar={{ size: "large" }} paragraph={{ rows: 4 }} />
          <Skeleton active avatar={{ size: "large" }} paragraph={{ rows: 4 }} />
          <Skeleton active avatar={{ size: "large" }} paragraph={{ rows: 4 }} />
        </div>
      ) : posts.length === 0 ? (
        <Empty description="Chưa có bài viết nào" style={{ marginTop: 100 }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {posts.map((post) => (
            <Card
              key={post.id}
              hoverable
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
              styles={{ body: { padding: 0 } }}
            >
              {post.image ? (
                <Link to={`/posts/${post.id}`}>
                  <div
                    style={{
                      width: "100%",
                      background: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "24px 0", // khoảng cách đẹp khi ảnh nhỏ
                      maxHeight: 600, // giới hạn để card không quá cao
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt={post.title}
                      src={getImageUrl(post.image)}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: 8, // bo góc nhẹ cho đẹp
                      }}
                    />
                  </div>
                </Link>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 300,
                    background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 20 }}>
                    Không có hình ảnh
                  </Text>
                </div>
              )}

              <div style={{ padding: "24px" }}>
                <Space size="middle" style={{ marginBottom: 12 }}>
                  <Tag color="blue">{post.username}</Tag>
                  <Text type="secondary">
                    {dayjs(post.created_at).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </Space>

                <Link to={`/posts/${post.id}`}>
                  <Title
                    level={3}
                    style={{
                      margin: "12px 0 16px",
                      color: "#0a1f44",
                      fontWeight: 600,
                    }}
                  >
                    {post.title}
                  </Title>
                </Link>

                <Link to={`/posts/${post.id}`}>
                  <Paragraph
                    ellipsis={{ rows: 3 }}
                    style={{
                      color: "#555",
                      fontSize: 16,
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    {post.content}
                  </Paragraph>
                </Link>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: 16,
                  }}
                >
                  <Button
                    type="text"
                    icon={
                      post.liked ? (
                        <LikeFilled style={{ color: "#1677ff" }} />
                      ) : (
                        <LikeOutlined />
                      )
                    }
                    loading={likingId === post.id}
                    onClick={() => handleLike(post.id)}
                    style={{
                      color: post.liked ? "#1677ff" : "#666",
                      fontSize: 15,
                    }}
                  >
                    {post.likeCount} Thích
                  </Button>

                  <Space size="small">
                    <MessageOutlined style={{ fontSize: 18, color: "#666" }} />
                    <Text type="secondary" style={{ fontSize: 15 }}>
                      {post.comment_count} Bình luận
                    </Text>
                  </Space>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostListPage;