import React from "react";
import {Button} from "@mantine/core";
import GitHubSignInButton from "@/components/Buttons/GitHubSignInButton";
import GoogleSignInButton from "@/components/Buttons/GoogleSignInButton";

function HomeImage() {

    return (
        <div style={{position: 'relative'}}>
            <img
                src="/ocean.jpg" alt="Ocean with Beach Chairs"
                style={{width: '100%', height: 'auto'}}/>
            <div style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '80px',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '80%',
            }}>
                We help you stay on top of your tasks, so that you can spend more time enjoying life.
            </div>
            <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
            }}>
                To-Do Tracker
            </div>
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
            }}>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <Button component={GitHubSignInButton} fullWidth>
                        Sign in with GitHub
                    </Button>
                    <Button component={GoogleSignInButton} fullWidth>
                        Sign in with Google
                    </Button>
                </div>
            </div>
            <svg viewBox="0 0 1440 320" style={{position: 'absolute', bottom: -110, width: '100%'}}>
                <path fill="#fff" fillOpacity="1"
                      d="M0,192L48,165.3C96,139,192,85,288,96C384,107,480,181,576,213.3C672,245,768,235,864,192C960,149,1056,75,1152,53.3C1248,32,1344,64,1392,80L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>
    );
}

export default HomeImage;