import React from 'react';
import './PhotoViewerModal.css';

interface PhotoViewerModalProps {
    imageSrc: string;
    onClose: () => void;
}

const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({ imageSrc, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="photo-viewer-content" onClick={(e) => e.stopPropagation()}>
                <img src={imageSrc} alt="Visitor" />
                <button onClick={onClose} className="close-viewer-button">&times;</button>
            </div>
        </div>
    );
};

export default PhotoViewerModal;
