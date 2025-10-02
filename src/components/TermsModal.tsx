import React from 'react';
import './TermsModal.css';

interface TermsModalProps {
    onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Ekwantu Consulting - Visitor Terms and Conditions</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <p>By signing in, you agree to the following terms and conditions:</p>
                    <ol>
                        <li>
                            <strong>Access and Security</strong>
                            <ul>
                                <li>All visitors must sign in upon arrival and wear a visitor badge at all times.</li>
                                <li>Visitors must remain with their host unless otherwise authorized.</li>
                                <li>Access is limited to designated areas only.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Confidentiality</strong>
                            <ul>
                                <li>You may be exposed to confidential information during your visit.</li>
                                <li>All such information must be kept strictly confidential and may not be shared, recorded, or reproduced in any form unless formally agreed to by Ekwantu Consulting.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Health and Safety</strong>
                            <ul>
                                <li>In case of an emergency, follow staff instructions immediately.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Conduct</strong>
                            <ul>
                                <li>Visitors must act professionally and respectfully at all times.</li>
                                <li>The possession or use of illegal substances, or weapons on company premises is strictly prohibited.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Data Privacy</strong>
                            <ul>
                                <li>The information you provide when signing in (e.g., name, contact details, time of entry/exit) will be used solely for security, health, and safety purposes.</li>
                                <li>Ekwantu Consulting complies with the Protection of Personal Information Act (POPIA). Your data will not be shared with third parties unless required by law.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Liability</strong>
                            <ul>
                                <li>Visitors enter the premises at their own risk.</li>
                                <li>Ekwantu Consulting is not liable for any loss, damage, or injury unless caused by proven negligence.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Acceptance</strong>
                            <ul>
                                <li>By tapping “I Agree”, you confirm that you have read and accepted these conditions.</li>
                            </ul>
                        </li>
                    </ol>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="landing-button">Close</button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
