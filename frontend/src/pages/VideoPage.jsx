import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import styles from '../styles/VideoPage.module.css'; 

function VideoPage ()
{
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    return (
        <div className={ styles.container }>
            <Header />
            <div className={ styles.heading }>
            { user && <p className={ styles.welcome }>Welcome, { user.email }</p> }

            <video controls className={ styles.videoPlayer } src={ videoUrl }>
                Sorry, your browser doesn't support embedded videos.
                </video>
            </div>
        </div>
    );
}

export default VideoPage;
