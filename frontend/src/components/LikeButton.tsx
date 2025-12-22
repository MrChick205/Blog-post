import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { toggleLike, getLikeCount, getLikeStatus } from '../services/likeService';
import { useAuth } from '../contexts/AuthContext';

interface LikeButtonProps {
  postId: string;
}

const LikeButton = ({ postId }: LikeButtonProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchLikeData = async () => {
    try {
      const [countRes, statusRes] = await Promise.all([
        getLikeCount(postId),
        user ? getLikeStatus(postId) : Promise.resolve(null),
      ]);

      setCount(countRes.data.count);
      if (statusRes) {
        setLiked(statusRes.data.liked);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchLikeData();
  }, [postId, user]);

  const handleToggleLike = async () => {
    if (!user) {
      message.error('Bạn cần đăng nhập để like');
      return;
    }

    setLoading(true);
    try {
      await toggleLike(postId);
      fetchLikeData();
    } catch {
      message.error('Không thể thực hiện like');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="text"
      icon={liked ? <LikeFilled /> : <LikeOutlined />}
      onClick={handleToggleLike}
      loading={loading}
    >
      {count}
    </Button>
  );
};

export default LikeButton;
