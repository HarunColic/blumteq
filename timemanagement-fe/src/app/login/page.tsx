"use client";

import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import "./page.css";
import apiClient from "@/app/api_client";
import Link from "next/link";
import { useAuth } from "../auth-context";
import {jwtDecode} from "jwt-decode";

function Page() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const { user, setUser } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await apiClient.post("/auth/jwt/create/", {
                username: formData.username,
                password: formData.password,
            });

            if (response.status === 200) {
                setErrorMessage("");
                const { access, refresh } = response.data;

                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);

                const decoded_access = jwtDecode(access);
                setUser({
                    username: decoded_access["username"],
                    id: decoded_access["user_id"],
                });
                router.push("/hours");
            }
        } catch (error: any) {
            if (error.response) {
                const errorData = error.response.data;

                setErrorMessage(errorData.detail);
            } else if (error.request) {
                setErrorMessage("Error: No response received from the server");
            } else {
                setErrorMessage(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="form-container">
            <h2>User Login</h2>
            <form className="registration-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>
                    Don't have an account?{" "}
                    <Link href="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default Page;
