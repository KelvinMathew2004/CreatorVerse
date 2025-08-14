import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import './CreatorDetails.css';
import AuthModal from '../components/AuthModal';

const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" /></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-1.625C8.724.538 8.347.527 7.033.589 3.652.734.926 3.46.784 6.845.722 8.158.712 8.536.712 12s.01 3.842.072 5.155c.142 3.385 2.868 6.111 6.253 6.253C8.347 23.473 8.724 23.462 12 23.462s3.653.011 4.967-.052c3.385-.142 6.111-2.868 6.253-6.253.062-1.313.072-1.69.072-5.155s-.01-3.842-.072-5.155C23.074 3.46 20.348.734 16.963.589 15.653.527 15.276.538 12 .538z" /><path d="M12 6.848c-2.834 0-5.152 2.318-5.152 5.152s2.318 5.152 5.152 5.152 5.152-2.318 5.152-5.152S14.834 6.848 12 6.848zm0 8.704c-1.96 0-3.552-1.592-3.552-3.552s1.592-3.552 3.552-3.552 3.552 1.592 3.552 3.552-1.592 3.552-3.552 3.552z" /><path d="M16.965 5.595a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z" /></svg>
);

const authErrorMessages = [
    'Incorrect password. Please try again.',
];

const CreatorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [creator, setCreator] = useState(null);
    const [error, setError] = useState(null);

    const pageRef = useRef(null);

    useEffect(() => {
        pageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [creator]);

    useEffect(() => {
        const fetchCreatorData = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('Creators')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching creator:', error);
                setError('Could not find the requested creator.');
            } else {
                setCreator(data);
            }
            setLoading(false);
        };

        fetchCreatorData();
    }, [id]);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authAction, setAuthAction] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

    const handleEditClick = (creator) => {
        setAuthAction('edit');
        setIsAuthModalOpen(true);
    };

    const handleDeleteClick = () => {
        setAuthAction('delete');
        setIsAuthModalOpen(true);
    };

    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
        setAuthError(null);
    };

    const handleAuthSuccess = () => {
        if (authAction === 'edit') {
            navigate(`/edit/${id}`, { state: { authenticated: true } });
        } else if (authAction === 'delete') {
            deleteCreator();
        }
    };

    const handleAuthSubmit = async (enteredPassword) => {
        setIsSubmittingAuth(true);
        setAuthError(null);

        if (enteredPassword === creator.password) {
            handleAuthSuccess();
        } else {
            const randomIndex = Math.floor(Math.random() * authErrorMessages.length);
            setAuthError(authErrorMessages[randomIndex]);
        }
        setIsSubmittingAuth(false);
    };

    const deleteCreator = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this creator? This action cannot be undone.");
        if (!isConfirmed) return;

        setLoading(true);
        const { error } = await supabase
            .from('Creators')
            .delete()
            .eq('id', id);

        setLoading(false);
        if (error) {
            console.error('Failed to delete the post:', error);
            setAuthError('Failed to delete the post.');
        } else {
            navigate('/', { state: { fromNavigation: true } });
        }
        setIsAuthModalOpen(false);
    };

    if (loading) {
        return (
            <div className="CreatorDetailsPage" aria-busy="true">
                {/* This container is empty, so the ::before spinner will be visible */}
            </div>
        );
    }

    if (error || !creator) {
        return <p className="error-message">{error || 'Creator not found.'}</p>;
    }

    return (
        <div className="CreatorDetailsPage" ref={pageRef}>
            <article className='creator-container'>
                {creator.imageURL && (
                    <img src={creator.imageURL} alt={creator.name} className="creator-image-fit"/>
                )}
                <div className='creator-content'>
                    <h1 className="creator-name">{creator.name}</h1>
                    <p className="creator-description">{creator.description}</p>
                    <div className="creator-socials">
                        {creator.youtubeURL && (
                        <a
                            href={`https://youtube.com/${creator.youtubeURL}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            title="YouTube"
                        >
                            <YouTubeIcon />
                            @{creator.youtubeURL}
                        </a>
                        )}

                        {creator.xURL && (
                        <a
                            href={`https://x.com/${creator.xURL}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            title="X (Twitter)"
                        >
                            <XIcon />
                            @{creator.xURL}
                        </a>
                        )}

                        {creator.instagramURL && (
                        <a
                            href={`https://instagram.com/${creator.instagramURL}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            title="Instagram"
                        >
                            <InstagramIcon />
                            @{creator.instagramURL}
                        </a>
                        )}
                    </div>
                </div>
            </article>
            <div className="grid" style={{ marginTop: '2rem', width: '100%', maxWidth: "1200px" }}>
                <button type="button" className="secondary outline" onClick={handleDeleteClick} disabled={loading}>
                    Delete Creator
                </button>
                <button type="button" className="primary outline" onClick={handleEditClick} disabled={loading}>
                    Edit Creator
                </button>
            </div>
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

export default CreatorDetails;