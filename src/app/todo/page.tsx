"use client";

import { Button, Modal, TextInput } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import '@mantine/core/styles.css';
import TasksList from "@/components/TasksList";
import TodoTitle from "@/components/TodoTitle";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { useSession } from 'next-auth/react';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { createPortal } from 'react-dom';
import TodoMenu from "@/components/TodoMenu";
import Head from "next/head";
import ExportTasksButton from "@/components/Buttons/ExportTasksButton";

export default function Todo() {
    const { data: session } = useSession();
    const [backgroundImage, setBackgroundImage] = useState('/ocean.jpg');
    const [imagePickerOpened, setImagePickerOpened] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchUserBackgroundImage = async () => {
            if (!session?.user?.email) return;

            try {
                const response = await fetch(`/api/users?email=${session.user.email}`);
                const data = await response.json();
                setBackgroundImage(data.backgroundImage || '/ocean.jpg');
            } catch (error) {
                console.error('Failed to fetch user background image', error);
            }
        };

        fetchUserBackgroundImage();
    }, [session]);

    const fetchImages = async () => {
        console.log('fetchImages function called');
        const startTime = Date.now();
        try {
            const response = await axios.get('https://api.unsplash.com/search/photos', {
                params: {
                    client_id: 'RZhELuXP6MGdC1kkL7OeMsWNE3-FpKbnPEzbptq_2qk',
                    query: searchTerm,
                },
            });
            const endTime = Date.now();
            console.log(`Request took ${endTime - startTime} ms`);
            console.log('Unsplash response:', response.data);
            setImages(response.data.results.map((image: any) => image.urls.full));
        } catch (error) {
            console.error('Error fetching images from Unsplash:', error);
        }
    };

    const handleImageSelect = async (url: string) => {
        setBackgroundImage(url);

        if (!session?.user?.email) return;

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session.user.email, backgroundImage: url }),
            });

            if (response.ok) {
                showNotification({
                    message: 'Background image updated successfully',
                    color: 'green',
                });
            } else {
                showNotification({
                    title: 'Error',
                    message: 'Failed to update background image',
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Failed to update background image', error);
            showNotification({
                title: 'Error',
                message: 'Failed to update background image',
                color: 'red',
            });
        }
    };

    if (!session) {
        return <div>You must be signed in to view this page.</div>;
    }

    if (!isClient) {
        return null; // or a loading spinner, or some other placeholder
    }

    return (
        <>
            <Head>
                {session.user?.username}'s To-Do List
            </Head>
            <BackgroundWrapper backgroundImage={backgroundImage}>
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    textAlign: 'right',
                }}>
                    <TodoMenu setImagePickerOpened={setImagePickerOpened} deleteModalOpened={deleteModalOpened} setDeleteModalOpened={setDeleteModalOpened} />
                </div>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    width: '80%',
                    maxWidth: '600px',
                    textAlign: 'center'
                }}>
                    <TodoTitle />
                    {session && <TasksList />}
                </div>
                {isClient && createPortal(
                    <Modal opened={imagePickerOpened} onClose={() => setImagePickerOpened(false)} title="Search for a Background Photo from Unsplash">
                        <div>
                            <TextInput
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for images"
                                style={{ marginBottom: '1rem' }}
                            />
                            <Button onClick={fetchImages}>Search</Button>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
                                {images.map((url) => (
                                    <img
                                        key={url}
                                        src={url}
                                        alt="Unsplash"
                                        style={{ width: '100px', height: '100px', margin: '0.5rem', cursor: 'pointer' }}
                                        onClick={() => {
                                            handleImageSelect(url);
                                            setImagePickerOpened(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </Modal>,
                    document.body
                )}
            </BackgroundWrapper>
        </>
    );
}