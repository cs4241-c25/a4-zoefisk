"use client";

import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/');
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    return <Button onClick={handleSignOut}>Sign out</Button>;
}