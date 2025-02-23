"use client";

import { ReactNode } from "react";
import { ParallaxProvider } from "react-scroll-parallax";

interface Props {
    children: ReactNode;
}

const ClientParallaxProvider = ({ children }: Props) => {
    return <ParallaxProvider>{children}</ParallaxProvider>;
};

export default ClientParallaxProvider;