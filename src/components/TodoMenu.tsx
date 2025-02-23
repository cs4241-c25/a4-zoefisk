"use client";

import { Menu, Button, Modal } from '@mantine/core';
import {
    IconLogout,
    IconPhoto,
    IconTrash,
    IconDownload,
} from '@tabler/icons-react';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface TodoMenuProps {
    setImagePickerOpened: (opened: boolean) => void;
    deleteModalOpened: boolean;
    setDeleteModalOpened: (opened: boolean) => void;
}

const fetchTasks = async (userEmail: string) => {
    try {
        const response = await axios.get('/api/tasks', {
            params: { userEmail }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
};

const convertToCSV = (tasks: any[]) => {
    const headers = ['Task', 'Priority', 'Due Date', 'Complete', 'ID'];
    const rows = tasks.map(task => [task.taskName, task.priority, task.dueDate, task.complete, task.id]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });

    return encodeURI(csvContent);
};

const TodoMenu: React.FC<TodoMenuProps> = ({ setImagePickerOpened, deleteModalOpened, setDeleteModalOpened }) => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const handleDeleteAccount = async () => {
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
                await signOut();
                router.push('/');
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

    const handleDownload = async () => {
        if (!session?.user?.email) {
            console.error('User is not logged in');
            return;
        }

        const tasks = await fetchTasks(session.user.email);
        const csvContent = convertToCSV(tasks);
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', 'tasks.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Menu shadow="md" width={375}>
                <Menu.Target>
                    <Button>Settings</Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item leftSection={<IconPhoto size={14} />} onClick={() => setImagePickerOpened(true)}>
                        Change Background Photo
                    </Menu.Item>
                    <Menu.Item leftSection={<IconDownload size={14} />} onClick={handleDownload}>
                        Export Tasks to CSV
                    </Menu.Item>
                    <Menu.Item leftSection={<IconLogout size={14} />} onClick={handleSignOut}>
                        Sign Out
                    </Menu.Item>
                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => setDeleteModalOpened(true)}
                    >
                        Delete Account
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="Confirm Account Deletion"
            >
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <Button color="red" onClick={handleDeleteAccount} style={{ marginTop: '1rem' }}>
                    Confirm Delete
                </Button>
            </Modal>
        </>
    );
};

export default TodoMenu;