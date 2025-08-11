import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

const categories = [
    { name: 'Workouts', emoji: '🏋️', colorClass: 'workouts-color' },
    { name: 'Nutrition', emoji: '🍎', colorClass: 'nutrition-color' },
    { name: 'Progress', emoji: '📊', colorClass: 'progress-color' },
    { name: 'Science', emoji: '🧪', colorClass: 'science-color' },
    { name: 'General', emoji: '💬', colorClass: 'general-color' },
    { name: 'Repost', emoji: '', colorClass: 'repost-color' }
];


const Card = ({ id, createdAt, title, likes, image, category }) => {
    const cardStyle = image 
        ? { backgroundImage: `url(${image})` }
        : {};

    const categoryDetails = categories.find(cat => cat.name === category) || categories.find(cat => cat.name === 'General');

    return (
        <Link to={`/post/${id}`} className={`Card ${category === "Repost" ? "linked-post-card" : ""}`} style={cardStyle}>
            <div className="card-category-icon" title={categoryDetails.name}>
                {categoryDetails.emoji}
            </div>
            <div className={`card-content ${categoryDetails.colorClass}`}>
                <p className="card-time">{timeAgo(createdAt)}</p>
                <h2 className="card-title">{title}</h2>
                <p className="card-likes">{likes || 0} {likes === 1 ? 'gain' : 'gains'}</p>
            </div>
        </Link>
    );
};

export default Card;