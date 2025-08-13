import React, { useState, useEffect } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSubmit, error, isSubmitting }) => {
    const [enteredPassword, setEnteredPassword] = useState('');

    useEffect(() => {
        if (isOpen) {
            setEnteredPassword('');
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
        onSubmit(enteredPassword);
    };

    return (
        <dialog open={isOpen} onClick={onClose} className="auth-modal">
            <article onClick={(e) => e.stopPropagation()} className='modal-content'>
                <header>
                    <button aria-label="Close" className="close" onClick={onClose}></button>
                    <h3 style={{ marginBottom: "1rem" }}>Authentication Required</h3>
                    <small>Please enter the password to proceed.</small>
                </header>

                <form onSubmit={handleSubmit} className='modal-form'>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={enteredPassword}
                        name={error ? "invalid" : ""}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        required
                        placeholder="Enter password..."
                        autoFocus
                        aria-invalid={error ? "true" : ""}
                        aria-describedby="valid-helper"
                        autoComplete="current-password"
                    />

                    <small id="valid-helper">{error}</small>

                    <button type="submit" aria-busy={isSubmitting} disabled={isSubmitting}>
                        {isSubmitting ? 'Verifying...' : 'Submit'}
                    </button>
                </form>
            </article>
        </dialog>
    );
};

export default AuthModal;