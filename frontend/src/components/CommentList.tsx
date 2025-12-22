import { useEffect, useState } from 'react';
import { Avatar, Button, Form, Input, List, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getCommentsByPost, createComment } from '../services/commentService';
import { useAuth } from '../contexts/AuthContext';
import { Comment } from '../types';

const { TextArea } = Input;

interface CommentListProps {
  postId: string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await getCommentsByPost(postId);
      setComments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const onFinish = async (values: { content: string }) => {
    if (!user) {
      message.error('Bạn cần đăng nhập để bình luận');
      return;
    }

    setSubmitting(true);
    try {
      await createComment({
        post_id: postId,
        content: values.content,
      });
      fetchComments();
      message.success('Đã thêm bình luận');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể thêm bình luận');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Bình luận</h3>

      {user && (
        <Form onFinish={onFinish}>
          <Form.Item name="content" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Viết bình luận..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Gửi
          </Button>
        </Form>
      )}

      <List
        loading={loading}
        dataSource={comments}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.username}
              description={
                <>
                  <div>{item.content}</div>
                  <small>{dayjs(item.created_at).format('DD/MM/YYYY HH:mm')}</small>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentList;
