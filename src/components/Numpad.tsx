import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faBackspace } from '@fortawesome/free-solid-svg-icons';
import '../styles/Numpad.css';

const Numpad = ({ onCall }: { onCall: (number: string) => void }) => {
    const [number, setNumber] = useState('');

    const handleButtonClick = (digit: string) => {
        setNumber(prev => prev + digit);
    };

    const handleBackspace = () => {
        setNumber(prev => prev.slice(0, -1));
    };

    const handleCall = () => {
        onCall(number);
    };

    return (
        <div className="numpad">
            <div className="display">{number}</div>
            <div className="buttons">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(digit => (
                    <button key={digit} onClick={() => handleButtonClick(digit)}>
                        {digit}
                    </button>
                ))}
            </div>
            <div className="action-buttons">
                <button className="call-button" onClick={handleCall}>
                    <FontAwesomeIcon icon={faPhone} />
                </button>
                <button
                    className={`backspace-button ${number ? 'visible' : 'hidden'}`}
                    onClick={handleBackspace}>
                    <FontAwesomeIcon icon={faBackspace} />
                </button>
            </div>
        </div>
    );
};

export default Numpad;
