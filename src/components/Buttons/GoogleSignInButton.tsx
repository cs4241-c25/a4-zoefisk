import { signIn } from "next-auth/react";
import { Button } from "@mantine/core";
import React from "react";

const GoogleSignInButton: React.FC = () => {
    return <Button onClick={() => signIn("google")}>Sign in with Google</Button>;
}

export default GoogleSignInButton;