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
import {
  getLikeStatus,
  getLikeCount,
  toggleLike,
} from '../../services/likeService';
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

      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likeCount: Number(countRes.data.like_count),
              }
            : post
        )
      );
    } finally {
      setLikingId(null);
    }
  };

  return (
    <Card
      style={{
        minHeight: '80vh',
        maxWidth: 900,
        margin: '0 auto',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        borderRadius: 12,
      }}
    >
      <Title level={3} style={{ marginBottom: 24 }}>
        📰 Bài viết mới nhất
      </Title>

      {loading ? (
        <>
          <Skeleton active paragraph={{ rows: 4 }} />
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
                padding: '20px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
              actions={[
                <Button
                  key="like"
                  type="text"
                  icon={
                    post.liked ? (
                      <LikeFilled style={{ color: '#1677ff' }} />
                    ) : (
                      <LikeOutlined />
                    )
                  }
                  loading={likingId === post.id}
                  onClick={() => handleLike(post.id)}
                >
                  {post.likeCount}
                </Button>,
                <Space key="comment">
                  <MessageOutlined />
                  <Text type="secondary">
                    {Number(post.comment_count)}
                  </Text>
                </Space>,
              ]}
            >
              <Space align="start" size="large">
                {/* IMAGE */}
                {post.image && (
                  <Link to={`/posts/${post.id}`}>
                    <Image
                      src={post.image}
                      width={160}
                      height={110}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                      preview={false}
                    />
                  </Link>
                )}

                {/* CONTENT */}
                <div style={{ flex: 1 }}>
                  <List.Item.Meta
                    title={
                      <Link to={`/posts/${post.id}`}>
                        <Text strong style={{ fontSize: 16 }}>
                          {post.title}
                        </Text>
                      </Link>
                    }
                    description={
                      <Space size="middle">
                        <Tag color="blue">{post.username}</Tag>
                        <Text type="secondary">
                          {dayjs(post.created_at).format(
                            'DD/MM/YYYY HH:mm'
                          )}
                        </Text>
                      </Space>
                    }
                  />

                  <Link to={`/posts/${post.id}`}>
                    <Paragraph ellipsis={{ rows: 3 }}>
                      {post.content}
                    </Paragraph>
                  </Link>
                </div>
              </Space>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default PostListPage;
