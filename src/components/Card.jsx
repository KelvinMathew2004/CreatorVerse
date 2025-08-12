import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Card.css';

const Card = ({ id, name, description, imageURL, youtubeURL, xURL, instagramURL, password, onEdit, onInfo }) => {
    const cardStyle = imageURL 
        ? { backgroundImage: `url(${imageURL})` }
        : {};

    return (
        <div className='Card' style={cardStyle}>
            <div className="card-content">
                <div className="creator-actions-row">
                    <h2 className="card-name">{name}</h2>
                    <div className="creator-actions">
                        <a onClick={() => onEdit(password)} className="edit-button" title='Edit'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                        </a>
                        <a onClick={() => onInfo(id)} className="details-button" title='Details'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="social-links">
                    <div className="social-links">
                        {youtubeURL && (
                            <a href={youtubeURL} target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
                                </svg>
                            </a>
                        )}

                        {xURL && (
                            <a href={xURL} target="_blank" rel="noopener noreferrer" className="social-link" title="X (Twitter)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        )}

                        {instagramURL && (
                            <a href={instagramURL} target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-1.625C8.724.538 8.347.527 7.033.589 3.652.734.926 3.46.784 6.845.722 8.158.712 8.536.712 12s.01 3.842.072 5.155c.142 3.385 2.868 6.111 6.253 6.253C8.347 23.473 8.724 23.462 12 23.462s3.653.011 4.967-.052c3.385-.142 6.111-2.868 6.253-6.253.062-1.313.072-1.69.072-5.155s-.01-3.842-.072-5.155C23.074 3.46 20.348.734 16.963.589 15.653.527 15.276.538 12 .538z" />
                                    <path d="M12 6.848c-2.834 0-5.152 2.318-5.152 5.152s2.318 5.152 5.152 5.152 5.152-2.318 5.152-5.152S14.834 6.848 12 6.848zm0 8.704c-1.96 0-3.552-1.592-3.552-3.552s1.592-3.552 3.552-3.552 3.552 1.592 3.552 3.552-1.592 3.552-3.552 3.552z" />
                                    <path d="M16.965 5.595a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
                <p className="card-description">{description}</p>
            </div>
        </div>
    );
};

export default Card;