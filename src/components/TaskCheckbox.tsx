import React from "react";
import { Checkbox } from "@mantine/core";

interface Task {
    id: string;
    taskName: string;
    priority: string;
    dueDate: string;
    complete: boolean;
}

interface TaskCheckboxProps {
    task: Task;
    onTaskUpdated: (updatedTask: Task) => void;
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ task, onTaskUpdated }) => {
    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation(); // Prevent the accordion from opening
        const updatedTask = { ...task, complete: !task.complete };

        try {
            const response = await fetch(`/api/tasks?id=${encodeURIComponent(task.id)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                onTaskUpdated(updatedTask);
            } else {
                console.error('Failed to update task');
            }
        } catch (error) {
            console.error('Failed to update task', error);
        }
    };

    return (
        <Checkbox
            checked={task.complete}
            onChange={handleCheckboxChange}
            label={task.taskName}
            onClick={(e) => e.stopPropagation()} // Prevent the accordion from opening
        />
    );
};

export default TaskCheckbox;