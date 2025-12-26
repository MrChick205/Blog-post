import {
  Card,
  List,
  Typography,
  Tag,
  Skeleton,
  Empty,
  Button,
  Space,
  Image,
} from 'antd';
import {
  MessageOutlined,
  LikeOutlined,
  LikeFilled,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getAllPosts } from '../../services/postService';
import { getLikeStatus, getLikeCount, toggleLike } from '../../services/likeService';
import { Post } from '../../types';

const { Title, Paragraph, Text } = Typography;

interface PostUI extends Post {
  liked: boolean;
  likeCount: number;
}

const PostListPage = () => {
  const [posts, setPosts] = useState<PostUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPosts();

        const postsWithLike = await Promise.all(
          res.data.map(async (post: Post) => {
            const [statusRes, countRes] = await Promise.all([
              getLikeStatus(post.id),
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
  }, []);

  const handleLike = async (postId: string) => {
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
        maxWidth: 1000,
        margin: '32px auto',
        padding: '0 16px',
        background: '#f0f4f8', 
        minHeight: '80vh',
        borderRadius: 12,
      }}
    >
      <Title level={2} style={{ marginBottom: 24, textAlign: 'center', color: '#1677ff' }}>
        Bài viết mới nhất
      </Title>

      {loading ? (
        <>
          <Skeleton active paragraph={{ rows: 4 }} style={{ marginBottom: 24 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </>
      ) : posts.length === 0 ? (
        <Empty description="Chưa có bài viết nào" />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={posts}
          split={false}
          renderItem={(post) => (
            <List.Item
              key={post.id}
              style={{
                marginBottom: 24,
                padding: 24,
                borderRadius: 12,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                background: '#ffffff', 
                transition: 'all 0.3s',
              }}
              actions={[
                <Button
                  key="like"
                  type="text"
                  icon={post.liked ? <LikeFilled style={{ color: '#1677ff' }} /> : <LikeOutlined />}
                  loading={likingId === post.id}
                  onClick={() => handleLike(post.id)}
                  style={{ color: post.liked ? '#1677ff' : '#555' }}
                >
                  {post.likeCount}
                </Button>,
                <Space key="comment" size={4}>
                  <MessageOutlined style={{ color: '#555' }} />
                  <Text type="secondary">{Number(post.comment_count)}</Text>
                </Space>,
              ]}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 16,
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                {post.image && (
                  <Link to={`/posts/${post.id}`}>
                    <Image
                      src={post.image}
                      width={180}
                      height={120}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                      preview={false}
                    />
                  </Link>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <List.Item.Meta
                    title={
                      <Link to={`/posts/${post.id}`}>
                        <Text strong style={{ fontSize: 18, color: '#0a1f44' }}>
                          {post.title}
                        </Text>
                      </Link>
                    }
                    description={
                      <Space size="small">
                        <Tag color="#66bbe9ff">{post.username}</Tag>
                        <Text type="secondary">
                          {dayjs(post.created_at).format('DD/MM/YYYY HH:mm')}
                        </Text>
                      </Space>
                    }
                  />
                  <Link to={`/posts/${post.id}`}>
                    <Paragraph
                      ellipsis={{ rows: post.image ? 3 : 4 }}
                      style={{ marginBottom: 0, color: '#333' }}
                    >
                      {post.content}
                    </Paragraph>
                  </Link>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default PostListPage;
