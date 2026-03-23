import React from 'react';
import { formatDate } from '../../../shared/utils';

const LeaveRequestList = ({ requests, title = "Leave Requests" }) => {
  if (requests.length === 0) {
    return (
      <div className="requests-section">
        <h3>{title}</h3>
        <p>No leave requests found.</p>
      </div>
    );
  }

  return (
    <div className="requests-section">
      <h3>{title}</h3>
      <div className="requests-list">
        {requests.map(request => (
          <div key={request.id} className={`request-item status-${request.status}`}>
            <div className="request-header">
              <span className="request-date">{formatDate(request.date)}</span>
              <span className={`status-badge ${request.status}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            <div className="request-details">
              <p><strong>Time:</strong> {request.timePeriod}</p>
              <p><strong>Reason:</strong> {request.reason}</p>
              {request.createdAt && (
                <p><strong>Created:</strong> {formatDate(request.createdAt)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveRequestList;