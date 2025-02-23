"use client";

import React from "react";
import { Button } from "@mantine/core";
import { showNotification } from '@mantine/notifications';

interface DeleteTaskButtonProps {
    taskId: string;
    onTaskDeleted: () => void;
}

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({ taskId, onTaskDeleted }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/tasks?id=${encodeURIComponent(taskId)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                showNotification({
                    message: 'Task deleted successfully',
                    color: 'green',
                });
                onTaskDeleted(); // Refresh the task list
            } else {
                const errorData = await response.json();
                showNotification({
                    title: 'Error',
                    message: `Task not deleted successfully: ${errorData.message}`,
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Failed to delete task', error);
            showNotification({
                title: 'Error',
                message: 'Task not deleted successfully due to an error: ' + (error as Error).message,
                color: 'red',
            });
        }
    };

    return (
        <Button color="red" onClick={handleDelete}>
            Delete Task
        </Button>
    );
}

export default DeleteTaskButton;