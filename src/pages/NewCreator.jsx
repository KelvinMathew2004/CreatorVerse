import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import './NewCreator.css';

const NewCreator = () => {
    const [creator, setCreator] = useState({ 
        name: "", 
        description: "", 
        imageURL: "", 
        youtubeURL: "",
        xURL: "",
        instagramURL: "",
        password: "", 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formRef = useRef(null);

    useEffect(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCreator((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const createCreator = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { error: supabaseError } = await supabase
            .from('Creators')
            .insert({ 
                name: creator.name, 
                description: creator.description,
                imageURL: creator.imageURL || null,
                youtubeURL: creator.youtubeURL || null,
                xURL: creator.xURL || null,
                instagramURL: creator.instagramURL || null,
                password: creator.password,
            });

        if (supabaseError) {
            console.error("Error creating creator:", supabaseError);
            alert("Failed to create creator. Please try again.");
        } else {
            navigate(`/`);
        }
        setLoading(false);
    };

    return (
        <div className="NewCreator" ref={formRef}>
            <form onSubmit={createCreator}>
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <small><em>The name of the content creator.</em></small>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={creator.name}
                        onChange={handleChange}
                        placeholder="e.g., Marques Brownlee"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <small><em>Provide a description of the creator. Who are they? What makes them interesting?</em></small>
                    <textarea
                        id="description"
                        name="description"
                        value={creator.description}
                        onChange={handleChange}
                        placeholder="Share something about this creator..."
                        rows="4"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="imageURL">Image</label>
                    <small><em>Provide a link to an image of your creator. Be sure to include the http://</em></small>
                    <input
                        type="text"
                        id="imageURL"
                        name="imageURL"
                        value={creator.imageURL}
                        onChange={handleChange}
                        placeholder="https://example.com/image.png"
                    />
                </div>

                <hr />
                <h4>Social Media Links</h4>
                <small><em>Provide at least one of the creator's social media links.</em></small>

                <div className="form-group" style={{ marginTop: "2rem"}}>
                    <label className="social-link-label" htmlFor="youtubeURL">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
                        </svg>
                        YouTube
                    </label>
                    <small><em>The creator's YouTube handle (without the @)</em></small>
                    <input
                        type="text"
                        id="youtubeURL"
                        name="youtubeURL"
                        value={creator.youtubeURL}
                        onChange={handleChange}
                        placeholder="e.g., mkbhd"
                    />
                </div>

                <div className="form-group">
                    <label className="social-link-label" htmlFor="xURL">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X (Twitter)
                    </label>
                    <small><em>The creator's X (Twitter) handle (without the @)</em></small>
                    <input
                        type="text"
                        id="xURL"
                        name="xURL"
                        value={creator.xURL}
                        onChange={handleChange}
                        placeholder="e.g., MKBHD"
                    />
                </div>

                <div className="form-group">
                    <label className="social-link-label" htmlFor="instagramURL">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                        </svg>
                        Instagram
                    </label>
                    <small><em>The creator's Instagram handle (without the @)</em></small>
                    <input
                        type="text"
                        id="instagramURL"
                        name="instagramURL"
                        value={creator.instagramURL}
                        onChange={handleChange}
                        placeholder="e.g., mkbhd"
                    />
                </div>

                <hr />

                <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <small><em>Required to edit or delete this entry later.</em></small>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={creator.password}
                        onChange={handleChange}
                        placeholder="Create a password for editing"
                        required
                    />
                </div>

                <button type="submit" disabled={loading} aria-busy={loading}>
                    {loading ? 'Adding...' : 'Add Creator'}
                </button>
            </form>
        </div>
    );
};

export default NewCreator;