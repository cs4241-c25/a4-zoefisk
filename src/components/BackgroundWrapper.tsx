import React, { useState, useEffect } from 'react';

interface BackgroundWrapperProps {
    children: React.ReactNode;
    backgroundImage: string;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children, backgroundImage }) => {
    const [currentBackgroundImage, setCurrentBackgroundImage] = useState(backgroundImage);

    useEffect(() => {
        setCurrentBackgroundImage(backgroundImage);
    }, [backgroundImage]);

    return (
        <div style={{
            backgroundImage: `url(${currentBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {children}
        </div>
    );
};

export default BackgroundWrapper;