import { useEffect, useState } from 'react';
import '../styles/Settings.css';

const Settings = () => {
    const [login, setLogin] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

    useEffect(() => {
        const savedLogin = localStorage.getItem('login');
        const savedPhoneNumber = localStorage.getItem('phoneNumber');
        console.log('Retrieved login:', savedLogin);
        console.log('Retrieved phone number:', savedPhoneNumber);
        setLogin(savedLogin);
        setPhoneNumber(savedPhoneNumber);
    }, []);

    return (
        <div className="settings">
            <div className="user-info">
                <h2>User Information</h2>
                <hr />
                <p>Login: {login}</p>
                <p>Phone Number: {phoneNumber}</p>
            </div>
            <div className="app-info">
                <h2>App Information</h2>
                <hr />
                <p>Version: 1.0.0</p>
                <p>Author: Your Name</p>
                <p>GitHub: <a href="https://github.com/Alanarex" target="_blank" rel="noopener noreferrer">github.com/Alanarex</a></p>
            </div>
        </div>
    );
};

export default Settings;
