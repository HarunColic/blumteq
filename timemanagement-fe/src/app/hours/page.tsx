"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/app/api_client";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./page.css";
import ConfirmationModal from "../confirmation-modal"

function Hours() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        date: null as Date | null,
        dateFrom: null as Date | null,
        dateTo: null as Date | null,
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<any>(null);
    const [hoursData, setHoursData] = useState<any>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCalendarVisible, setIsCalendarVisible] = useState({
        date: false,
        dateFrom: false,
        dateTo: false,
    });

    const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const parseDate = (dateString) => {
        return dateString ? new Date(dateString) : null;
    };

    const fetchData = async (params, page) => {
        const formattedParams = {
            date: formatDate(params.date),
            date_from: formatDate(params.dateFrom),
            date_to: formatDate(params.dateTo),
        };

        try {
            const response = await apiClient.get("/hour-entries/", {
                params: { ...formattedParams, page },
            });

            setHoursData(response.data.results);
            setTotalPages(response.data.total_pages);
            setCurrentPage(page);

            const queryParams = new URLSearchParams();
            if (page !== 1 || formattedParams.date || formattedParams.date_from || formattedParams.date_to) {
                queryParams.set("page", String(page));
            }

            if (formattedParams.date) queryParams.set("date", formattedParams.date);
            if (formattedParams.date_from) queryParams.set("date_from", formattedParams.date_from);
            if (formattedParams.date_to) queryParams.set("date_to", formattedParams.date_to);

            if (queryParams.toString()) {
                router.push(`/hours?${queryParams.toString()}`);
            }
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
            setErrorMessage("Failed to fetch data. Please try again.");
        }
    };

    const handleDateChange = async (field, date) => {
        let updatedFormData;

        if (field === "date") {
            updatedFormData = { ...formData, date: date || null, dateFrom: null, dateTo: null };
        } else if (field === "dateFrom" || field === "dateTo") {
            updatedFormData = { ...formData, [field]: date || null, date: null };
        }

        setFormData(updatedFormData);
        await fetchData(updatedFormData, 1);
    };

    const handlePageChange = (page) => {
        fetchData(formData, page);
    };

    const toggleCalendarVisibility = (field) => {
        setIsCalendarVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleBlur = (field) => {
        setTimeout(() => {
            setIsCalendarVisible((prevState) => ({
                ...prevState,
                [field]: false,
            }));
        }, 200);
    };

    useEffect(() => {
        const page = parseInt(searchParams.get("page") as String) || 1;
        const date = parseDate(searchParams.get("date"));
        const dateFrom = parseDate(searchParams.get("date_from"));
        const dateTo = parseDate(searchParams.get("date_to"));

        const initialFormData = {
            date,
            dateFrom,
            dateTo,
        };

        setFormData(initialFormData);

        if (date || dateFrom || dateTo || searchParams.get("page")) {
            fetchData(initialFormData, page);
        } else {
            setHoursData(null);
        }
    }, [searchParams]);

    const handleNewEntry = () => {
        router.push(`/hours/new`);
    };

    const handleEdit = (entry) => {

        router.push('/hours/edit/' + entry.id);
    };

    const handleDeleteClick = (entry) => {
        console.log("Delete:", JSON.stringify(entry));
        setEntryToDelete(entry);
        setIsModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            console.log(entryToDelete.id);
            await apiClient.delete(`/hour-entries/${entryToDelete.id}/`);

            setHoursData((prevData) => {
                const updatedData = prevData.filter((item) => item.id !== entryToDelete.id);

                if (updatedData.length === 0) {
                    router.back();
                }

                return updatedData;
            });

            setIsModalVisible(false);

        } catch (error) {
            console.error("Error deleting entry:", error.response?.data || error.message);
            setErrorMessage("Failed to delete the entry. Please try again.");
        }
    };


    const cancelDelete = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="hours-container">
            <div className="header">
                <h1>Hours Management</h1>
                <button className="new-entry-button" onClick={handleNewEntry}>New Entry</button>
            </div>
            <ConfirmationModal
                isVisible={isModalVisible}
                message={`Are you sure you want to delete the entry for ${entryToDelete?.date}?`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            <form className="hours-form">
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <div className="datepicker-wrapper">
                        <input
                            type="text"
                            value={formData.date ? formData.date.toLocaleDateString() : ""}
                            onFocus={() => toggleCalendarVisibility("date")}
                            onBlur={() => handleBlur("date")}
                            readOnly
                        />
                        {isCalendarVisible.date && (
                            <DayPicker
                                mode="single"
                                selected={formData.date}
                                onSelect={(date) => handleDateChange("date", date)}
                            />
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="dateFrom">Date From:</label>
                    <div className="datepicker-wrapper">
                        <input
                            type="text"
                            value={formData.dateFrom ? formData.dateFrom.toLocaleDateString() : ""}
                            onFocus={() => toggleCalendarVisibility("dateFrom")}
                            onBlur={() => handleBlur("dateFrom")}
                            readOnly
                        />
                        {isCalendarVisible.dateFrom && (
                            <DayPicker
                                mode="single"
                                selected={formData.dateFrom}
                                onSelect={(date) => handleDateChange("dateFrom", date)}
                            />
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="dateTo">Date To:</label>
                    <div className="datepicker-wrapper">
                        <input
                            type="text"
                            value={formData.dateTo ? formData.dateTo.toLocaleDateString() : ""}
                            onFocus={() => toggleCalendarVisibility("dateTo")}
                            onBlur={() => handleBlur("dateTo")}
                            readOnly
                        />
                        {isCalendarVisible.dateTo && (
                            <DayPicker
                                mode="single"
                                selected={formData.dateTo}
                                onSelect={(date) => handleDateChange("dateTo", date)}
                            />
                        )}
                    </div>
                </div>
            </form>

            {hoursData && hoursData.length > 0 ? (
                <div className="fetched-data">
                    <div className="data-list">
                        {hoursData.map((entry, index) => (
                            <div key={index} className="data-item">
                                <div className="data-field">
                                    <strong>Date:</strong> {entry.date}
                                </div>
                                <div className="data-field">
                                    <strong>Hours:</strong> {entry.hours}
                                </div>
                                <div className="data-field">
                                    <strong>Description:</strong> {entry.description}
                                </div>
                                <div className="data-actions">
                                    <button className="edit-button" onClick={() => handleEdit(entry)}>Edit</button>
                                    <button className="delete-button" onClick={() => handleDeleteClick(entry)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                hoursData && (
                    <div className="fetched-data">
                        <strong>No entries found</strong>
                    </div>
                )
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {totalPages > 1 && (
                <div className="pagination">
                    <button className={ currentPage === 1 ? "disabled-page-button" : "page-button" }
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button className={"page-button"}
                            key={index}
                            className={currentPage === index + 1 ? "active" : "inactive"}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button className={currentPage === totalPages ? "disabled-page-button" : "page-button"}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Hours;
