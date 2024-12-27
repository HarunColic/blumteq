"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, {useEffect, useState} from "react";
import { AuthProvider } from "@/app/auth-context";
import { useAuth } from "@/app/auth-context";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/protected-route";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <ProtectedRoute>
                <Header />
                    <main className="main-content">{children}</main>
            </ProtectedRoute>
        </AuthProvider>
        <style jsx>{`
            .main-content {
                margin-top: 5rem;
                padding: 2rem;
                max-width: 90%;
                width: 1400px;
                margin-left: auto;
                margin-right: auto;
            }
        `}</style>
        </body>
        </html>
    );
}

function Header() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    useEffect(() => {



    }, [user]);

    const handleLogout = () => {
        console.log("User logged out");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        router.push("/login");
    };
    if (!user) return null;

    return (
        <header className="header">
            <div className="banner">
                <div className="username">Welcome, {user.username}</div>
                <button className="hours-button" onClick={() => router.push('/hours')}>
                    Hours
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <style jsx>{`
                .header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background-color: #007bff;
                    color: #fff;
                    z-index: 1000;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 0;
                }

                .banner {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 1rem;
                }

                .username {
                    font-size: 1.2rem;
                    font-weight: bold;
                }

                .logout-button {
                    padding: 0.5rem 1rem;
                    background-color: #dc3545;
                    color: white;
                    font-size: 1rem;
                    font-weight: bold;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .hours-button {
                    padding: 0.8rem 1.5rem;
                    background-color: #28a745;
                    color: white;
                    font-size: 1rem;
                    font-weight: bold;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                
                .logout-button:hover {
                    background-color: #c82333;
                }
                
                .hours-button:hover {
                    background-color: #218838;
                }
            `}</style>
        </header>
    );
}
