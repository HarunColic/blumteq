"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/api_client";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./page.css";

function CreateHours() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        date: null as Date | null,
        hours: "",
        description: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date: Date) => {
        setFormData({
            ...formData,
            date,
        });
        setIsCalendarVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.date || !formData.hours || !formData.description) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            await apiClient.post("/hour-entries/", {
                date: formData.date.toISOString().split("T")[0],
                hours: formData.hours,
                description: formData.description,
            });

            router.push("/hours");
        } catch (error) {
            console.log("Error creating hours entry:", error.response.data);

            const errorData = error.response.data;
            let errorMessage = '';

            if (errorData.hours) {
                errorMessage = ` Hours error: ${errorData.hours.join(' ')} `;
            } if (errorData.date) {
                errorMessage = errorMessage + ` Date error: ${errorData.date.join(' ')}`;
            } if (errorData.description) {
                errorMessage = errorMessage + ` Description error: ${errorData.description.join(' ')}`;
            }

            setErrorMessage(errorMessage);
        }
    };


    const toggleCalendarVisibility = () => {
        setIsCalendarVisible(!isCalendarVisible);
    };

    // Handle blur event to hide the calendar
    const handleBlur = () => {
        setTimeout(() => {
            setIsCalendarVisible(false);
        }, 200); // Delay to ensure the user does not accidentally blur when selecting a date
    };

    return (
        <div className="create-hours-container">
            <div className="header">
                <h1>Create New Hours Entry</h1>
            </div>

            <form className="create-hours-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <div className="datepicker-wrapper">
                        <input
                            type="text"
                            name="date"
                            value={formData.date ? formData.date.toLocaleDateString() : ""}
                            onFocus={toggleCalendarVisibility}
                            onBlur={handleBlur}
                            readOnly
                        />
                        {isCalendarVisible && (
                            <DayPicker
                                mode="single"
                                selected={formData.date}
                                onSelect={handleDateChange}
                                disabled={{ after: new Date() }}
                            />
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="hours">Hours:</label>
                    <input
                        type="number"
                        name="hours"
                        value={formData.hours}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default CreateHours;
