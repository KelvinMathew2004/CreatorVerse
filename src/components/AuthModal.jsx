import React, { useState, useEffect } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSubmit, error, isSubmitting }) => {
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPassword('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(password);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose} aria-label="Close">
                    &times;
                </button>
                
                <h2>Authentication Required</h2>
                <p>Please enter the password to proceed.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">Access Code</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="password-input"
                            placeholder="Enter password..."
                            autoFocus
                        />
                    </div>
                    
                    {error && <p className="incorrect-password">{error}</p>}
                    
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Verifying...' : 'Lock It In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;