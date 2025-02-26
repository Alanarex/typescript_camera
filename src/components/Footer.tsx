import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import '../styles/Footer.css'; 

const Footer = () => {
    const navigate = useNavigate();

    const handleHomeRedirect = () => {
        // Redirect to the home page
        navigate('/home');
    };

    return (
        <footer className="footer">
            <button className="home-button" onClick={handleHomeRedirect}>
                <FontAwesomeIcon icon={faHome} size="2x" />
            </button>
        </footer>
    );
};

export default Footer;
