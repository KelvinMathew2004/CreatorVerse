import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import AuthModal from '../components/AuthModal';
import Loading from '../assets/loading-icon.svg';
import Card from '../components/Card';
import './CreatorDetails.css';

const authErrorMessages = [
    'Wrong locker code. Try another rep.',
    'Invalid entry pass. Reset and retry.',
    'That aint the right key, champ. Give it another push.',
    'Access denied. You missed the lift. Try again.',
    'Wrong rep key. Lock it in and go again.',
    'That combo didn’t work. Tighten your form and retry.',
    'Fail set. Check your code and give it another go.',
    'Not strong enough this time. Reattempt your access code.',
    'That rep didn’t count. Fix your form and try again.',
    'You dropped the bar. Try a cleaner lift next time.',
    'Code’s off balance. Reset your stance and go again.',
    'Key mismatch. You’re racking the wrong plate.',
    'Missed the cue. Focus and punch it in right.',
    'Form check failed. Adjust your input and lift again.',
    'That’s a no-rep. Enter the correct code to proceed.'
];

const categories = [
    { name: 'Workouts', emoji: '🏋️' },
    { name: 'Nutrition', emoji: '🍎' },
    { name: 'Progress', emoji: '📊' },
    { name: 'Science', emoji: '🧪' },
    { name: 'General', emoji: '💬' },
    { name: 'Repost', emoji: '' }
];

const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const weeks = Math.round(days / 7);

    if (seconds == 1) return `${seconds} second ago`;
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes == 1) return `${minutes} minute ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours == 1) return `${hours} hour ago`
    if (hours < 24) return `${hours} hours ago`;
    if (days == 1) return `${days} day ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks == 1) return `${weeks} week ago`;
    return `${weeks} weeks ago`;
};

const LoadingSpinner = () => (
    <div className="loading-icon-container">
        <img src={Loading} alt="Loading..." className="details-loading-icon" />
    </div>
);

const CreatorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [categoryEmoji, setCategoryEmoji] = useState('');
    const [linked_post_id, setLinkedPostId] = useState(null);
    const [linked_post, setLinkedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authAction, setAuthAction] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

    useEffect(() => {
        const fetchAllPostData = async () => {
            setLoading(true);

            const { data: postData, error: postError } = await supabase
                .from('Posts')
                .select(`*, Comments (*)`)
                .eq('id', id)
                .order('created_at', { foreignTable: 'Comments', ascending: false })
                .single();

            if (postError) {
                console.error('Error fetching main post:', postError);
                setPost(null);
                setLoading(false);
                return;
            }

            setPost(postData);
            setComments(postData.Comments || []);

            const matchedCategory = categories.find(c => c.name === postData.category);
            setCategoryEmoji(matchedCategory?.emoji || '');

            if (postData.repost && postData.linked_post_id) {
                const { data: linkedData, error: linkedError } = await supabase
                    .from('Posts')
                    .select('*')
                    .eq('id', postData.linked_post_id)
                    .single();

                if (linkedError) {
                    console.error('Error fetching linked post:', linkedError);
                    setLinkedPost(null);
                } else {
                    setLinkedPost(linkedData);
                }
            }

            setLoading(false);
        };

        fetchAllPostData();
    }, [id]);

    const handleLike = async () => {
        const newLikeCount = (post.likes || 0) + 1;
        setPost({ ...post, likes: newLikeCount });
        await supabase
            .from('Posts')
            .update({ likes: newLikeCount })
            .eq('id', id);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (newComment.trim() === '') return;

        const { data: createdComment, error } = await supabase
            .from('Comments')
            .insert({ post_id: id, comment_text: newComment })
            .select()
            .single();

        if (error) {
            console.error('Error creating comment:', error);
        } else if (createdComment) {
            setComments([createdComment, ...comments]);
            setNewComment("");
        }
    };

    const handleEditClick = () => {
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
            deletePost();
        }
    };

    const handleAuthSubmit = async (password) => {
        setIsSubmittingAuth(true);
        setAuthError(null);

        if (password === post?.password) {
            handleAuthSuccess();
        } else {
            const randomIndex = Math.floor(Math.random() * authErrorMessages.length);
            setAuthError(authErrorMessages[randomIndex]);
        }
        setIsSubmittingAuth(false);
    };

    const deletePost = async () => {
        const { error } = await supabase
            .from('Posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Failed to delete the post:', error);
            setAuthError('Failed to delete the post.');
        } else {
            navigate('/');
        }
        setIsAuthModalOpen(false);
    };

    if (!post && !loading) return <p className="error-message">Post not found.</p>;

    return (
        <div className="PostDetailsPage">
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="post-container">
                    {categoryEmoji && (
                        <div className="card-details-category-icon" title={post.category}>
                            {categoryEmoji}
                        </div>
                    )}

                    <p className="post-meta">Logged {timeAgo(post.created_at)}</p>

                    <h1 className="post-title">{post.title}</h1>

                    <p className="post-content">{post.description}</p>

                    {post.image && (
                        <div className="post-image-container">
                            <img src={post.image} alt={post.title} className="post-image-fit"/>
                        </div>
                    )}

                    {post.repost && (
                        linked_post ? (
                            <Card
                                id={linked_post.id}
                                createdAt={linked_post.created_at}
                                title={linked_post.title}
                                likes={linked_post.likes}
                                image={linked_post.image}
                                category={"Repost"}
                            />
                        ) : (
                            <p className="deleted-linked-post-card" >
                                ↩ Original post has been deleted.
                            </p>
                        )
                    )}

                    <div className="post-actions-row">
                        <div className="post-actions">
                            <button onClick={handleLike} className="like-button">
                                <i class="fa-solid fa-thumbs-up"
                                    style={{ 
                                        color: '#FF8B60', 
                                        verticalAlign: 'middle' 
                                    }}
                                    aria-hidden="true"
                                ></i>
                            </button>
                            <span>{post.likes || 0} {post.likes === 1 ? 'gain' : 'gains'}</span>
                        </div>
                        <div className="post-actions">
                            <button onClick={() => navigate(`/new/${id}`)} className="repost-button" title='Repost'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                    <path d="M3 2v6h6" />
                                    <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
                                    <path d="M21 22v-6h-6" />
                                    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
                                </svg>
                            </button>
                            <button onClick={handleEditClick} className="edit-button" title='Edit'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                            </button>
                            <button onClick={handleDeleteClick} className="delete-button" title='Delete'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="comments-section">
                        <h3>Spotters ({comments.length})</h3>

                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows="3"
                            />
                            <button type="submit">Drop a Spot</button>
                        </form>

                        <div className="comment-list">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                        <p>{comment.comment_text}</p>
                                        <span className="comment-meta">{timeAgo(comment.created_at)}</span>
                                    </div>
                                ))
                            ) : (
                                <p>No comments yet. Be the first!</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
