"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/api_client";
import "./page.css";
import { use } from "react";

interface HourEntry {
    id: string;
    date: string;
    hours: number;
    description: string;
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [formData, setFormData] = useState<HourEntry | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const response = await apiClient.get(`/hour-entries/${id}/`);
                if (response.status === 200) {
                    setFormData(response.data);
                }
            } catch (error: any) {
                setErrorMessage(
                    error.response?.data?.detail || "Failed to fetch entry data."
                );
            }
        };

        if (id) {
            fetchEntry();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) =>
            prevData ? { ...prevData, [name]: value } : null
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (formData) {
                await apiClient.put(`/hour-entries/${id}/`, formData);
                router.push("/hours");
            }
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.detail || "Failed to update entry."
            );
        }
    };

    if (!formData) {
        return <div>Loading entry data...</div>;
    }

    return (
        <div className="edit-container">
            <h2>Edit Hours Entry</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="hours">Hours:</label>
                    <input
                        type="number"
                        id="hours"
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.5"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="submit-button">Save Changes</button>
            </form>
        </div>
    );
}
