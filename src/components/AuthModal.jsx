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

    if (!isOpen) {
        return null;
    }

    return (
        <dialog open onClick={onClose}>
            <article onClick={(e) => e.stopPropagation()}>
                <header>
                    <button aria-label="Close" className="close" onClick={onClose}></button>
                    <strong>Authentication Required</strong>
                </header>

                <p>Please enter the password to proceed.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="password">Access Code</label>
                    <input
                        id="password"
                        type="password"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        required
                        placeholder="Enter password..."
                        autoFocus
                    />

                    {error && <p><small className="incorrect-password">{error}</small></p>}

                    <button type="submit" aria-busy={isSubmitting}>
                        {isSubmitting ? 'Verifying...' : 'Submit'}
                    </button>
                </form>
            </article>
        </dialog>
    );
};

export default AuthModal;