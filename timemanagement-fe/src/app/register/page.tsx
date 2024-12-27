"use client"

import React, {useEffect, useState} from 'react';
import './page.css';
import apiClient from "@/app/api_client";
import Link from "next/link";

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match!');
            setSuccessMessage('');
            return;
        }

        apiClient
            .post('/auth/users/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    setSuccessMessage('Registration successful!');
                    setErrorMessage('');
                } else {
                    throw new Error(`Unexpected status code: ${response.status}`);
                }
            })
            .catch((error) => {
                if (error.response) {
                    const errorData = error.response.data;
                    let errorMessage = '';

                    if (errorData.password) {
                        errorMessage = ` Password error: ${errorData.password.join(' ')}`;
                    } if (errorData.username) {
                        errorMessage = errorMessage + ` Username error: ${errorData.username.join(' ')}`;
                    } if (errorData.email) {
                        errorMessage = errorMessage + ` Email error: ${errorData.email.join(' ')}`;
                    }

                    setErrorMessage(errorMessage);
                } else if (error.request) {
                    setErrorMessage('Error: No response received from the server');
                } else {
                    setErrorMessage(`Error: ${error.message}`);
                }

                setSuccessMessage('');
            });

    };

    return (
        <div className="form-container">
            <h2>User Registration</h2>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
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

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <button type="submit" className="submit-button">Register</button>
                <p>
                    Already have an account?{' '}<br/>
                    <Link href="/login/">
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;
