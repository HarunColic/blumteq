"use client";

import Link from 'next/link';
import './page.css';

export default function LandingPage() {
    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1>Welcome to Our Time Management App</h1>
                <p>Your one-stop solution for managing hours effortlessly.</p>
            </header>

            <main className="landing-main">
                <div className="button-container">
                    <Link href="/register">
                        <button className="landing-button register-button">Register</button>
                    </Link>

                    <Link href="/login">
                        <button className="landing-button login-button">Log In</button>
                    </Link>
                </div>
            </main>

            <footer className="landing-footer">
                <p>&copy; 2024 Blumteq. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
