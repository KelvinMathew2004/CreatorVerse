import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../client';
import Loading from '../assets/loading-icon.svg';
import Card from '../components/Card';
import './HomePage.css';

const LoadingSpinner = () => (
    <div className="loading-icon-container">
        <img src={Loading} alt="Loading..." className="loading-icon" />
    </div>
);

const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Workouts', label: '🏋️ \u00A0 Workouts' },
    { value: 'Nutrition', label: '🍎 \u00A0 Nutrition' },
    { value: 'Progress', label: '📊 \u00A0 Progress' },
    { value: 'Science', label: '🧪 \u00A0 Science' },
    { value: 'General', label: '💬 \u00A0 General' }
];

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('created_at');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const inputRef = useRef(null);
    const searchWidgetRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        const timerId = setTimeout(() => {
            const fetchPosts = async () => {
                let query = supabase.from('Posts').select().order(sortBy, { ascending: false });
                
                if (searchQuery) {
                    query = query.ilike('title', `%${searchQuery}%`);
                }

                if (filterCategory !== 'All') {
                    query = query.eq('category', filterCategory);
                }

                const { data, error } = await query;
                if (error) {
                    setError("Could not fetch posts.");
                    setPosts([]);
                } else {
                    setPosts(data);
                    setError(null);
                }
                setLoading(false);
            };
            fetchPosts();
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchQuery, sortBy, filterCategory]);

    useEffect(() => {
        if (isSearchVisible) {
            inputRef.current?.focus();
        }
    }, [isSearchVisible]);

    const handleSortChange = (newSortBy) => {
        if (sortBy !== newSortBy) {
            setSortBy(newSortBy);
        }
    };

    const handleMouseLeave = () => {
        if (document.activeElement !== inputRef.current) {
            setIsSearchVisible(false);
        }
    };

    const toggleSearch = (e) => {
        e.preventDefault();
        const nextVisibility = !isSearchVisible;
        setIsSearchVisible(nextVisibility);
        if (!nextVisibility) {
            setSearchQuery("");
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (searchWidgetRef.current && !searchWidgetRef.current.contains(document.activeElement)) {
                setIsSearchVisible(false);
            }
        }, 100);
    };


    if (error) {
        return <p style={{ textAlign: 'center', marginTop: '5rem', color: "gray" }}>{error}</p>;
    }

    return (
        <div className="HomePage">
            <div className="filter-controls">
                <div style={{ margin: 0}}>
                    <div
                        className={`search-widget expanded`}
                        ref={searchWidgetRef}
                        onMouseLeave={handleMouseLeave}
                        onBlur={handleBlur}
                    >
                        <input
                            ref={inputRef}
                            type="search"
                            placeholder="Search by title..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                </div>
                </div>
            </div>
            <main className="post-gallery">
                {loading ? (
                    <LoadingSpinner />
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id} id={post.id} createdAt={post.created_at} title={post.title} likes={post.likes} image={post.image} category={post.category}/>
                    ))
                ) : (
                    <h2 style={{ width: '100%', textAlign: 'center' }}>No posts found.</h2>
                )}
            </main>
        </div>
    );
};

export default HomePage;