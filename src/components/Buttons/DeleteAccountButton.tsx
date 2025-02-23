"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal } from "@mantine/core";
import { showNotification } from '@mantine/notifications';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const DeleteAccountButton: React.FC = () => {
    const [opened, setOpened] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDelete = async () => {
        if (!session?.user?.email) return;

        try {
            const response = await fetch(`/api/users?email=${encodeURIComponent(session.user.email)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                showNotification({
                    message: 'Account and all tasks deleted successfully',
                    color: 'green',
                });
                await signOut(); // Sign out the user after account deletion
                if (isMounted) {
                    router.push('/'); // Redirect to the home page
                }
            } else {
                const errorData = await response.json();
                showNotification({
                    title: 'Error',
                    message: `Account not deleted successfully: ${errorData.message}`,
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Failed to delete account', error);
            showNotification({
                title: 'Error',
                message: 'Account not deleted successfully due to an error: ' + (error as Error).message,
                color: 'red',
            });
        }
    };

    return (
        <>
            <div>
                <Button color="red" onClick={(e) => { e.stopPropagation(); setOpened(true); }}>
                    Delete Account
                </Button>
            </div>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Confirm Account Deletion"
            >
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <Button color="red" onClick={handleDelete} style={{ marginTop: '1rem' }}>
                    Confirm Delete
                </Button>
            </Modal>
        </>
    );
};

export default DeleteAccountButton;