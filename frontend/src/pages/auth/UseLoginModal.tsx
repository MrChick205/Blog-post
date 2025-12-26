import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const useLoginModal = () => {
  const navigate = useNavigate();

  const showLoginModal = () => {
    Modal.confirm({
      title: 'Yêu cầu đăng nhập',
      content: 'Bạn cần đăng nhập để thực hiện chức năng này',
      okText: 'Đăng nhập',
      cancelText: 'Huỷ',
      onOk: () => navigate('/login'),
    });
  };

  return { showLoginModal };
};

export default useLoginModal;
