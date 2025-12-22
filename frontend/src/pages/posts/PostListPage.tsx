import { Card, List, Typography, Tag, Skeleton, Empty } from 'antd';
import { MessageOutlined, LikeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getAllPosts } from '../../services/postService';
import { Post } from '../../types';

const { Title, Paragraph, Text } = Typography;

const PostListPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPosts();
        setPosts(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Card style={{ minHeight: '80vh', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <Title level={3} style={{ marginBottom: 24 }}>Bài viết mới nhất</Title>

      {loading ? (
        <>
          <Skeleton active paragraph={{ rows: 3 }} />
          <Skeleton active paragraph={{ rows: 3 }} />
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
              style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}
              actions={[
                <span key="likes"><LikeOutlined /> {post.like_count ?? 0}</span>,
                <span key="comments"><MessageOutlined /> {post.comment_count ?? 0}</span>
              ]}
            >
              <List.Item.Meta
                title={<Link to={`/posts/${post.id}`}><Text strong>{post.title}</Text></Link>}
                description={
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {post.username && <Tag color="blue">{post.username}</Tag>}
                    <Text type="secondary">{dayjs(post.created_at).format('DD/MM/YYYY HH:mm')}</Text>
                  </div>
                }
              />
              <Paragraph ellipsis={{ rows: 3 }}>{post.content}</Paragraph>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default PostListPage;
