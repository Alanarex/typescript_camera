import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import '../styles/Footer.css';

const Footer = () => {
    const navigate = useNavigate();

    const handleHomeRedirect = () => {
        navigate('/home');
    };

    return (
        <footer className="footer">
            <div className="home-button" onClick={handleHomeRedirect}>
                <FontAwesomeIcon icon={faHome} size="2x" />
            </div>
        </footer>
    );
};

export default Footer;
