import React, { useState, useEffect } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSubmit, error, isSubmitting, password }) => {
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

    if (!isOpen) {
        return null;
    }

    return (
        <dialog open onClick={onClose}>
            <article onClick={(e) => e.stopPropagation()}>
                <header>
                    <button aria-label="Close" className="close" onClick={onClose}></button>
                    <h3 style={{ marginBottom: "1rem" }}>Authentication Required</h3>
                    <small>Please enter the password to proceed.</small>
                </header>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="password">Access Code</label>
                    <input
                        id="password"
                        type="password"
                        value={enteredPassword}
                        name={error ? "invalid" : "valid"}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        required
                        placeholder="Enter password..."
                        autoFocus
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby="valid-helper"
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