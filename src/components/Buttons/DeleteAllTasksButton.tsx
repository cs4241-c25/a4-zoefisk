import React from "react";
import { Button } from "@mantine/core";
import { showNotification } from '@mantine/notifications';

interface DeleteAllTasksButtonProps {
    userEmail: string;
    onTasksDeleted: () => void;
}

const DeleteAllTasksButton: React.FC<DeleteAllTasksButtonProps> = ({ userEmail, onTasksDeleted }) => {

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/tasks?userEmail=${encodeURIComponent(userEmail)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                showNotification({
                    message: 'All tasks deleted successfully',
                    color: 'green',
                });
                onTasksDeleted(); // Refresh the task list
            } else {
                const errorData = await response.json();
                showNotification({
                    title: 'Error',
                    message: `Tasks were not deleted successfully: ${errorData.message}`,
                    color: 'red',
                });
            }
        } catch (error) {
            console.error("Failed to delete all tasks", error);
            showNotification({
                title: 'Error',
                message: 'Tasks were not deleted successfully due to an error: ' + (error as Error).message,
                color: 'red',
            });
        }
    }

    return (
        <Button color="red" onClick={handleDelete}>
            Delete All Tasks
        </Button>
    )
}

export default DeleteAllTasksButton;