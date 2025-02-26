import { useNavigate } from 'react-router-dom';

const VideoCall = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Video Call</h1>
      <button onClick={() => navigate('/home')}>Exit</button>
    </div>
  );
};

export default VideoCall;
