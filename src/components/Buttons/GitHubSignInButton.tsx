import { signIn } from "next-auth/react";
import { Button } from "@mantine/core";
import React from "react";

const GitHubSignInButton: React.FC = () => {
    return <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>;
}

export default GitHubSignInButton;