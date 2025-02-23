"use client";

import React from "react";
import '@mantine/core/styles.css';
import HomeImage from "@/components/HomeImage";
import Head from "next/head";

export default function Home() {
    return (
        <>
            <Head>
                To-Do List Tracker
            </Head>
            <HomeImage/>
        </>
    );
}