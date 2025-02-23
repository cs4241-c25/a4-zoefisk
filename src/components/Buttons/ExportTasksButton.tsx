import React from 'react';
import { Button } from '@mantine/core';
import axios from 'axios';
import { useSession } from 'next-auth/react';

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

const ExportTasksButton: React.FC = () => {
    const { data: session } = useSession();

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

    return <Button onClick={handleDownload}>Export Tasks to CSV</Button>;
};

export default ExportTasksButton;