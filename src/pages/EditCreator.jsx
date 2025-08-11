import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../client';
import Loading from '../assets/loading-icon.svg';
import './NewCreator.css';

const categories = [
    { name: 'Workouts', emoji: '🏋️', colorClass: 'workouts-options-color' },
    { name: 'Nutrition', emoji: '🍎', colorClass: 'nutrition-options-color' },
    { name: 'Progress', emoji: '📊', colorClass: 'progress-options-color' },
    { name: 'Science', emoji: '🧪', colorClass: 'science-options-color' },
    { name: 'General', emoji: '💬', colorClass: 'general-options-color' }
];

const LoadingSpinner = () => (
    <div className="loading-icon-container">
        <img src={Loading} alt="Loading..." className="details-loading-icon" />
    </div>
);

const cleanSearchTerm = (term) => {
    const uselessTerms = ['exercise', 'workout', 'stretch', 'routine', 'training', 'male', 'female', 'on', 'in', 'with', 'and', 'arm', 'why', 'what', 'how', 'when'];
    return term
        .toLowerCase()
        .split(' ')
        .filter(word => !uselessTerms.includes(word))
        .join(' ')
        .trim();
};

const filterTitleForUnsplash = (rawQuery) => {
    const unimportantWords = [
        'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'that', 'this', 'these', 'those', 'of', 'in', 'on', 'for', 'to', 'from',
        'with', 'about', 'into', 'onto', 'through', 'during', 'before', 'after',
        'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
        'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
        'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
        'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
        'can', 'will', 'just', 'don', 'should', 'now', 'i', 'you', 'he', 'she', 'it',
        'we', 'they', 'me', 'him', 'her', 'them', 'my', 'your', 'his', 'its', 'our',
        'their', 'mine', 'yours', 'ours', 'theirs', 'what', 'which', 'who', 'whom',
        'whose', 'do', 'does', 'did', 'doing', 'have', 'has', 'had', 'having',
        'because', 'if', 'or', 'and', 'but', 'as', 'at', 'by', 'between', 'among',
        'via', 'yet', 'though', 'although', 'while', 'unless', 'until', 'even',
        'ever', 'overrated', 'journey'
    ];
    const words = rawQuery.toLowerCase().split(' ');
    const importantWords = words.filter(word => !unimportantWords.includes(word));
    return importantWords.slice(0, 3).join(' ');
};

const EditCreator = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [post, setPost] = useState({ title: '', description: '', image: '', password: '', workout_name: '' });
    const [originalWorkoutName, setOriginalWorkoutName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!location.state?.authenticated) {
            navigate(`/post/${id}`);
            return;
        }

        const fetchPost = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setError('Could not fetch the post data.');
                console.error(error);
            } else if (data) {
                setPost({
                    title: data.title,
                    description: data.description || '',
                    image: data.image || '',
                    password: data.password,
                    workout_name: data.workout_name || '',
                    repost: data.repost || false
                });
                setOriginalWorkoutName(data.workout_name || '');
                setSelectedCategory(data.category);
            }
            setLoading(false);
        };

        fetchPost();
    }, [id, location.state, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
    };

    const updatePost = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        let finalImageUrl = post.image;
        const workoutNameChanged = post.workout_name !== originalWorkoutName;

        if (selectedCategory === 'Workouts' && post.workout_name && workoutNameChanged) {
            const apiKey = import.meta.env.VITE_X_RAPIDAPI_KEY;
            if (!apiKey) {
                alert("API Key is missing.");
                setLoading(false);
                return;
            }
            const searchTerm = cleanSearchTerm(post.workout_name);
            const url = `https://exercisedb-api1.p.rapidapi.com/api/v1/exercises/search?search=${encodeURIComponent(searchTerm)}`;
            const options = { method: 'GET', headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'exercisedb-api1.p.rapidapi.com' } };
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                if (result.success && result.data.length > 0) {
                    finalImageUrl = result.data[0].imageUrl;
                } else {
                    finalImageUrl = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                }
            } catch (apiError) {
                console.error("API fetch error:", apiError);
                finalImageUrl = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            }
        } else if (selectedCategory !== 'Workouts' && !post.image && post.title) {
            const unsplashApiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
            if (!unsplashApiKey) {
                alert("Unsplash API Key is missing.");
                setLoading(false);
                return;
            }
            const cleanedQuery = filterTitleForUnsplash(post.title);
            const unsplashUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(cleanedQuery)}&client_id=${unsplashApiKey}`;
            try {
                const response = await fetch(unsplashUrl);
                if (!response.ok) throw new Error('Unsplash API request failed');
                const data = await response.json();
                if (data && data.urls && data.urls.regular) {
                    finalImageUrl = data.urls.regular;
                } else {
                    finalImageUrl = 'https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                }
            } catch (apiError) {
                console.error("Unsplash API fetch error:", apiError);
                finalImageUrl = 'https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            }
        }

        const { error: updateError } = await supabase
            .from('Posts')
            .update({
                title: post.title,
                description: post.description,
                image: finalImageUrl,
                password: post.password,
                category: selectedCategory,
                workout_name: post.workout_name
            })
            .eq('id', id);

        if (updateError) {
            setError('Failed to update the post.');
            console.error(updateError);
        } else {
            navigate(`/post/${id}`);
        }
        setLoading(false);
    };

    return (
        <div className="EditPost">
            {loading && !post.title ? (
                <LoadingSpinner />
            ) : (
                <form onSubmit={updatePost}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Focus *</label>
                        <div className="category-selector">
                            {categories.map((category) => (
                                <button
                                    key={category.name}
                                    type="button"
                                    className={`category-button ${category.colorClass} ${selectedCategory === category.name ? 'active' : 'inactive'}`}
                                    onClick={() => setSelectedCategory(category.name)}
                                    title={category.name}
                                    disabled={post.repost}
                                >
                                    <span className="emoji" role="img" aria-label={category.name}>{category.emoji}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="title">Session Name *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Breakdown *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={post.description}
                            onChange={handleChange}
                            rows="6"
                            required
                        />
                    </div>

                    {selectedCategory === 'Workouts' ? (
                        <div className="form-group">
                            <label htmlFor="workout_name">Exercise Name *</label>
                            <input
                                type="text"
                                id="workout_name"
                                name="workout_name"
                                value={post.workout_name}
                                onChange={handleChange}
                                placeholder="e.g., Bench Press"
                            />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="image">Image URL</label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={post.image}
                                onChange={handleChange}
                                placeholder="Leave blank to generate new image from title"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Access Code *</label>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            value={post.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Log'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default EditCreator;