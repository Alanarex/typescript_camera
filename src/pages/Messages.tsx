import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Messages</h1>
      <button onClick={() => navigate('/home')}>Exit</button>
    </div>
  );
};

export default Messages;
