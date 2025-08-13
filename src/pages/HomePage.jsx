import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import Loading from '../assets/loading-icon.svg';
import Card from '../components/Card';
import './HomePage.css';
import AuthModal from '../components/AuthModal';

const authErrorMessages = [
    'Incorrect password. Please try again.',
];

const HomePage = () => {
    const navigate = useNavigate();
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCreator, setSelectedCreator] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authAction, setAuthAction] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

    const handleEditClick = (creator) => {
        setSelectedCreator(creator);
        setAuthAction('edit');
        setIsAuthModalOpen(true);
    };

    const handleInfoClick = (id) => {
        navigate(`/creator/${id}`);
    };

    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
        setAuthError(null);
        setSelectedCreator(null);
    };

    const handleAuthSuccess = () => {
        navigate(`/edit/${selectedCreator.id}`, { state: { authenticated: true } });
    };

    const handleAuthSubmit = async (enteredPassword) => {
        setIsSubmittingAuth(true);
        setAuthError(null);

        if (enteredPassword === selectedCreator.password) {
            handleAuthSuccess();
        } else {
            const randomIndex = Math.floor(Math.random() * authErrorMessages.length);
            setAuthError(authErrorMessages[randomIndex]);
        }
        setIsSubmittingAuth(false);
    };

    useEffect(() => {
        setLoading(true);
        const timerId = setTimeout(() => {
            const fetchCreators = async () => {
                let query = supabase.from('Creators').select().order('created_at', { ascending: false });
                
                if (searchQuery) {
                    query = query.ilike('name', `%${searchQuery}%`);
                }

                const { data, error } = await query;
                if (error) {
                    setError("Could not fetch creators.");
                    setCreators([]);
                } else {
                    setCreators(data);
                    setError(null);
                }
                setLoading(false);
            };
            fetchCreators();
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

    if (error) {
        return <p style={{ textAlign: 'center', marginTop: '5rem', color: "gray" }}>{error}</p>;
    }

    return (
        <div className="HomePage">
            <div className="filter-controls">
                <div style={{ margin: 0}}>
                    <input
                        type="search"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <main className="creator-gallery" aria-busy={loading}>
                {!loading && (
                    creators.length > 0 ? (
                        creators.map((creator) => (
                            <Card 
                                key={creator.id} 
                                {...creator}
                                onEdit={() => handleEditClick(creator)} 
                                onInfo={() => handleInfoClick(creator.id)}
                            />
                        ))
                    ) : (
                        <h2 style={{ width: '100%', textAlign: 'center' }}>No creators found.</h2>
                    )
                )}
            </main>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={handleCloseAuthModal}
                onSubmit={handleAuthSubmit}
                error={authError}
                isSubmitting={isSubmittingAuth}
            />
        </div>
    );
};

export default HomePage;