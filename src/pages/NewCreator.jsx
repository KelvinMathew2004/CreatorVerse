import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './NewCreator.css';

const categories = [
    { name: 'Workouts', emoji: '🏋️', colorClass: 'workouts-options-color' },
    { name: 'Nutrition', emoji: '🍎', colorClass: 'nutrition-options-color' },
    { name: 'Progress', emoji: '📊', colorClass: 'progress-options-color' },
    { name: 'Science', emoji: '🧪', colorClass: 'science-options-color' },
    { name: 'General', emoji: '💬', colorClass: 'general-options-color' }
];

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


const NewCreator = () => {
    const { id: linked_post_id } = useParams();
    const [linked_post, setLinkedPost] = useState(null);
    const [post, setPost] = useState({ title: "", description: "", image_url: "", password: "", workout_name: "" });
    const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchLinkedPostDetails = async () => {
            if (!linked_post_id) return;
            console.log('Attempting to fetch post with ID:', linked_post_id);

            const { data, error } = await supabase
                .from('Posts')
                .select('*')
                .eq('id', linked_post_id)
                .single();

            if (error) {
                console.error('Error fetching linked post:', error);
            } else {
                console.log('Fetched data:', data);
                setLinkedPost(data);
                setSelectedCategory(data.category);
            }
        };

        fetchLinkedPostDetails();
    }, [linked_post_id]);

    const createPost = async (event) => {
        event.preventDefault();
        setLoading(true);

        let imageUrl = post.image_url;

        if (selectedCategory === 'Workouts') {
            const apiKey = import.meta.env.VITE_X_RAPIDAPI_KEY;

            if (!apiKey) {
                alert("API Key is missing. Please check your .env.local file.");
                setLoading(false);
                return;
            }

            const searchTerm = cleanSearchTerm(post.workout_name);
            const url = `https://exercisedb-api1.p.rapidapi.com/api/v1/exercises/search?search=${encodeURIComponent(searchTerm)}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'exercisedb-api1.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                
                if (result.success && result.data.length > 0) {
                    imageUrl = result.data[0].imageUrl;
                } else {
                    imageUrl = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                }
            } catch (error) {
                console.error("API fetch error:", error);
                imageUrl = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            }
        } 

        else if (!post.image_url && post.title) {
            const unsplashApiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

            if (!unsplashApiKey) {
                alert("Unsplash API Key is missing. Please check your .env.local file.");
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
                    imageUrl = data.urls.regular;
                } else {
                    imageUrl = 'https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                }
            } catch (error) {
                console.error("Unsplash API fetch error:", error);
                imageUrl = 'https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            }
        }

        const { error: supabaseError } = await supabase
            .from('Posts')
            .insert({ 
                title: post.title, 
                description: post.description,
                image: imageUrl,
                category: selectedCategory,
                password: post.password,
                workout_name: post.workout_name,
                linked_post_id: linked_post_id || null,
                repost: linked_post_id ? true : false
            });

        if (supabaseError) {
            console.error("Error creating post:", supabaseError);
            alert("Failed to create post. Please try again.");
        } else {
            navigate(`/`);
        }
        setLoading(false);
    };

    return (
        <div className="NewPost">
            <div className="form-container">
                <form onSubmit={createPost}>
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
                                    disabled={!!linked_post_id}
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
                            placeholder="e.g., Morning Push Day"
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
                            placeholder="Share your sets, reps, and thoughts..."
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
                                required 
                            />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="image_url">Image URL</label>
                            <input
                                type="text"
                                id="image_url"
                                name="image_url"
                                value={post.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.png"
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
                            placeholder="Enter a password..."
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add to Log'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewCreator;