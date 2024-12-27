import React from "react";
import "./confirmation-modal.css"

function ConfirmationModal({ isVisible, message, onConfirm, onCancel }) {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className={"confirm-button"} onClick={onConfirm}>Confirm</button>
                    <button className={"cancel-button"} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
