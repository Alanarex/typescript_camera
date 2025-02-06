import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

const OtpValidation = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [inputOtp, setInputOtp] = useState("");
    const [validationMessage, setValidationMessage] = useState("");

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const sendOtp = async () => {
        if (/^0[1-9]\d{8}$/.test(phoneNumber)) {
            const generatedOtp = generateOtp();
            setOtp(generatedOtp);
            setInputOtp(generatedOtp); // Automatically set the input field with the generated OTP
            setOtpSent(true);
            setValidationMessage(`OTP sent to ${phoneNumber} (Simulated: ${generatedOtp})`);
        } else {
            setValidationMessage("Enter a valid French phone number.");
        }
    };

    useEffect(() => {
        if ("OTPCredential" in window) {
            (navigator as any).credentials
                .get({ otp: { transport: ["sms"] } })
                .then((otp: any) => {
                    setInputOtp(otp.code);
                    validateOtp(otp.code);
                })
                .catch((err: Error) => console.log("WebOTP Error:", err));
        }
    }, []);

    const validateOtp = (otpToValidate: string) => {
        if (otpToValidate === otp) {
            setValidationMessage('OTP is valid!');
            Swal.fire({
                title: 'Success!',
                text: 'OTP is valid!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            setValidationMessage('Invalid OTP. Please try again.');
        }
    };

    return (
        <div>
            {!otpSent ? (
                <div>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number (e.g., 0766787739)"
                        style={{ marginBottom: '10px', padding: '10px', fontSize: '16px' }}
                    />
                    <button onClick={sendOtp}>Send OTP</button>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value)}
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        placeholder="Enter OTP"
                        style={{ marginBottom: '10px', padding: '10px', fontSize: '16px' }}
                    />
                    <button onClick={() => validateOtp(inputOtp)}>Validate OTP</button>
                </div>
            )}
            {validationMessage && <p>{validationMessage}</p>}
        </div>
    );
};

export default OtpValidation;
