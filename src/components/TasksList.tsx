import React, { useEffect, useState, useCallback } from "react";
import { Accordion, Pill } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import NewTaskButton from './Buttons/NewTaskButton';
import EditTaskButton from './Buttons/EditTaskButton';
import { useSession } from "next-auth/react";
import DeleteTaskButton from "@/components/Buttons/DeleteTaskButton";
import TaskCheckbox from "@/components/TaskCheckbox";
import DeleteAllTasksButton from "@/components/Buttons/DeleteAllTasksButton";

interface Task {
    id: string;
    taskName: string;
    priority: string;
    dueDate: string;
    complete: boolean;
}

const TasksList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { data: session } = useSession();

    const fetchTasks = useCallback(async () => {
        if (!session?.user?.email) return;

        try {
            const response = await fetch(`/api/tasks?userEmail=${session.user.email}`);
            const data = await response.json();

            const sortedTasks = data.sort((a: Task, b: Task) => {
                if (a.complete !== b.complete) {
                    return a.complete ? 1 : -1;
                }

                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);

                if (dateA < dateB) return -1;
                if (dateA > dateB) return 1;

                const priorityMap: { [key: string]: number } = { "Low": 3, "Medium": 2, "High": 1 };
                return priorityMap[a.priority] - priorityMap[b.priority];
            });

            setTasks(sortedTasks);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        }
    }, [session]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleTaskUpdated = (updatedTask: Task) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
        fetchTasks();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "None";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    };

    const items = tasks.map((task, index) => (
        <Accordion.Item key={`${task.taskName}-${index}`} value={`${task.taskName}-${index}`}>
            <Accordion.Control>
                <div className={task.complete ? 'line-through' : ''}>
                    <TaskCheckbox task={task} onTaskUpdated={handleTaskUpdated}/>
                </div>
            </Accordion.Control>
            <Accordion.Panel>
                <div className="flex justify-between">
                    <div className="text-left">
                            <p><strong>Priority:</strong> <Pill>{task.priority || "None"}</Pill></p>
                            <p><strong>Due Date:</strong> <Pill>{formatDate(task.dueDate)}</Pill></p>
                        </div>
                    <div className="flex flex-col space-y-2">
                        <EditTaskButton task={task} onTaskUpdated={fetchTasks} />
                        <DeleteTaskButton taskId={task.id} onTaskDeleted={fetchTasks} />
                    </div>
                </div>
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <>
            <Notifications />
            <Accordion>
                {items}
            </Accordion>
            <div style={{ marginTop: '10px' }}>
                <NewTaskButton onTaskAdded={fetchTasks} /> {session?.user?.email && <DeleteAllTasksButton userEmail={session.user.email} onTasksDeleted={fetchTasks} />}
            </div>
        </>
    );
}

export default TasksList;