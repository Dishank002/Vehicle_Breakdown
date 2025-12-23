import React from "react";
import "./RequestStatusSidebar.css";

const RequestStatusSidebar = ({ isOpen, requestStatus }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            {/* <div className="sidebar-header">
                <h3>Request Status</h3>
                <button onClick={onClose}>X</button>
            </div> */}
            
            {requestStatus?.issue_time ? (
                <div className="sidebar-content">
                    <p><strong>Requested At : </strong>{requestStatus.issue_time}</p>
                    <p><strong>Status : </strong>{requestStatus.Status}</p>
                </div>
            ) : (
                <p className="sidebar-content">No Active Requests</p>
            )}
        </div>
    );
};

export default RequestStatusSidebar;