"use client";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Input, Combobox, useCombobox, Drawer, Button, InputBase } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { showNotification } from '@mantine/notifications';
import { useSession } from "next-auth/react";
import Form from "next/form";

const priorities = ['Low', 'Medium', 'High'];

interface Task {
    id: string;
    taskName: string;
    priority: string;
    dueDate: string | null;
}

interface EditTaskButtonProps {
    task: Task;
    onTaskUpdated: () => void;
}

const EditTaskButton: React.FC<EditTaskButtonProps> = ({ task, onTaskUpdated }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [priorityValue, setPriorityValue] = useState<string | null>(task.priority);
    const [dateValue, setDateValue] = useState<Date | null>(task.dueDate ? new Date(task.dueDate) : null);
    const { data: session } = useSession();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const updatedTaskData = {
            taskName: formData.get('taskName'),
            priority: priorityValue,
            dueDate: dateValue ? dateValue.toISOString() : null,
            userEmail: session?.user?.email,
        };

        try {
            const response = await fetch(`/api/tasks?id=${encodeURIComponent(task.id)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTaskData),
            });

            if (response.ok) {
                showNotification({
                    message: 'Task updated: ' + updatedTaskData.taskName,
                    color: 'green',
                });
                close();
                onTaskUpdated(); // Refresh the task list
            } else {
                const errorData = await response.json();
                showNotification({
                    title: 'Error',
                    message: `Task not updated successfully: ${errorData.message}`,
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Failed to update task', error);
            showNotification({
                title: 'Error',
                message: 'Task not updated successfully due to an error: ' + (error as Error).message,
                color: 'red',
            });
        }
    };

    return (
        <>
            <Drawer opened={opened} onClose={close} title={"Edit Task"}>
                <Form onSubmit={handleSubmit} action="#">
                    <p>Task Name:</p>
                    <Input placeholder="Task name" name="taskName" defaultValue={task.taskName} style={{ marginBottom: '1rem' }} />

                    <p>Priority:</p>
                    <Combobox
                        store={combobox}
                        onOptionSubmit={(val) => {
                            setPriorityValue(val);
                            combobox.closeDropdown();
                        }}
                    >
                        <Combobox.Target>
                            <InputBase
                                component="button"
                                type="button"
                                pointer
                                rightSection={<Combobox.Chevron />}
                                rightSectionPointerEvents="none"
                                onClick={() => combobox.toggleDropdown()}
                            >
                                {priorityValue || <Input.Placeholder>Select priority</Input.Placeholder>}
                            </InputBase>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>{priorities.map((item) => (
                                <Combobox.Option value={item} key={item}>
                                    {item}
                                </Combobox.Option>
                            ))}</Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>

                    <DateInput
                        value={dateValue}
                        onChange={setDateValue}
                        label="Due Date:"
                        labelProps={{ style: { fontWeight: 'bold', fontSize: 16 } }}
                        placeholder="Select or enter a due date"
                        name="dueDate"
                        style={{ marginTop: '1rem' }}
                    />

                    <div style={{ marginTop: '10px' }}>
                        <Button type="submit">Save Task</Button>
                    </div>
                </Form>
            </Drawer>
            <Button variant="default" onClick={open}>
                Edit Task
            </Button>
        </>
    );
}

export default EditTaskButton;