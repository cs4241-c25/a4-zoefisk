"use client";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import React, { useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Input, Combobox, useCombobox, Drawer, Button, InputBase } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { showNotification } from '@mantine/notifications';
import { useSession } from "next-auth/react";
import Form from "next/form";
import "../../app/globals.css";

const priorities = ['Low', 'Medium', 'High'];

interface NewTaskButtonProps {
    onTaskAdded: () => void;
}

const NewTaskButton: React.FC<NewTaskButtonProps> = ({ onTaskAdded }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [priorityValue, setPriorityValue] = useState<string | null>(null);
    const options = priorities.map((item => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    )))

    const [dateValue, setDateValue] = useState<Date | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { data: session } = useSession();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!session?.user?.email) {
            showNotification({
                title: 'Error',
                message: 'User email is not available. Please log in.',
                color: 'red',
            });
            return;
        }

        const formData = new FormData(event.currentTarget);
        const taskName = formData.get('taskName')?.toString().trim();

        if (!taskName) {
            alert('Task name is required.');
            return;
        }

        const taskData = {
            taskName: formData.get('taskName'),
            priority: priorityValue,
            dueDate: dateValue,
            userEmail: session?.user?.email,
            complete: false,
            //userName: session?.user?.email.split('@')[0],
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                showNotification({
                    message: 'Task added: ' + taskData.taskName,
                    color: 'green',
                });
                close();
                onTaskAdded(); // Refresh the task list
            }
        } catch (error) {
            console.error('Failed to save task', error);
            showNotification({
                title: 'Error',
                message: 'Task not added successfully due to an error: ' + error,
                color: 'red',
            });
        }

        setPriorityValue(null);
        setDateValue(null);
        formRef.current?.reset();
    };

    return (
        <>
            <Drawer opened={opened} onClose={close} title={"Create a New Task"}>
                <Form onSubmit={handleSubmit} action="#">
                    <p>Task Name:</p>
                    <Input placeholder="Task name" name="taskName" style={{ marginBottom: '1rem' }} />

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
                            <Combobox.Options>{options}</Combobox.Options>
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
                Add New Task
            </Button>
        </>
    );
}

export default NewTaskButton;