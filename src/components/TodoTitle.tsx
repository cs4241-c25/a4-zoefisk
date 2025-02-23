"use client";

import { useSession } from "next-auth/react";
import React from "react";
import GoogleSignInButton from "@/components/Buttons/GoogleSignInButton";
import GitHubSignInButton from "@/components/Buttons/GitHubSignInButton";

const TodoTitle: React.FC = () => {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div>
                Please sign in to view your todos.
                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                    <GoogleSignInButton />
                    <GitHubSignInButton/>
                </div>
            </div>
        );
    }

    return <div>{session.user?.username}'s To-Do List</div>;
};

export default TodoTitle;