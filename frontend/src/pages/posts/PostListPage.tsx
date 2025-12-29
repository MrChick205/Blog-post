import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Typography, Tag, Skeleton, Empty, Button, Space } from "antd";
import { MessageOutlined, LikeOutlined, LikeFilled } from "@ant-design/icons";
import dayjs from "dayjs";

import { getAllPosts } from "../../services/postService";
import { getLikeStatus, getLikeCount, toggleLike } from "../../services/likeService";
import { Post } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import useLoginModal from "../auth/UseLoginModal";
import { getImageUrl } from "@/utils/image";

import "../css/PostListPage.css";

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
                ? getLikeStatus(post.id).catch(() => ({ data: { liked: false } }))
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
    <div className="page-container">
      <Title level={2} className="page-title">Bài viết mới nhất</Title>

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
            <Card key={post.id} hoverable className="post-card">
              {post.image ? (
                <Link to={`/posts/${post.id}`}>
                  <div className="post-image-wrapper">
                    <img alt={post.title} src={getImageUrl(post.image)} />
                  </div>
                </Link>
              ) : (
                <div className="no-image">Không có hình ảnh</div>
              )}

              <div className="post-content">
                <Space size="middle" className="post-tags">
                  <Tag color="blue">{post.username}</Tag>
                  <Text type="secondary">{dayjs(post.created_at).format("DD/MM/YYYY HH:mm")}</Text>
                </Space>

                <Link to={`/posts/${post.id}`}>
                  <Title level={3} className="post-title">{post.title}</Title>
                </Link>

                <Link to={`/posts/${post.id}`}>
                  <Paragraph ellipsis={{ rows: 3 }} className="post-paragraph">{post.content}</Paragraph>
                </Link>

                <div className="post-actions">
                  <Button
                    type="text"
                    icon={post.liked ? <LikeFilled /> : <LikeOutlined />}
                    loading={likingId === post.id}
                    onClick={() => handleLike(post.id)}
                    className={`like-button ${post.liked ? "liked" : ""}`}
                  >
                    {post.likeCount} Thích
                  </Button>

                  <div className="comment-info">
                    <MessageOutlined />
                    <Text className="comment-count">{post.comment_count} Bình luận</Text>
                  </div>
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
