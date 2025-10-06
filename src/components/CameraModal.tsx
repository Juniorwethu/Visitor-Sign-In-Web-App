import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import './CameraModal.css';

interface CameraModalProps {
    onCapture: (imageSrc: string) => void;
    onClose: () => void;
}

const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
};

const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
    const webcamRef = useRef<Webcam>(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            onCapture(imageSrc);
            onClose();
        }
    }, [webcamRef, onCapture, onClose]);

    return (
        <div className="modal-overlay">
            <div className="camera-modal-content">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="webcam-feed"
                />
                <div className="camera-controls">
                    <button onClick={capture} className="capture-button">Capture photo</button>
                    <button onClick={onClose} className="close-camera-button">Close</button>
                </div>
            </div>
        </div>
    );
};

export default CameraModal;
