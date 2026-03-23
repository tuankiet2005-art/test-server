import React from 'react';
import { formatDate, formatCurrency } from '../../shared/utils';

const AdvanceRequestList = ({ requests, title = "Advance Requests" }) => {
  if (requests.length === 0) {
    return (
      <div className="requests-section">
        <h3>{title}</h3>
        <p>No advance requests found.</p>
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
              <span className="request-amount">{formatCurrency(request.amount)}</span>
              <span className={`status-badge ${request.status}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            <div className="request-details">
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

export default AdvanceRequestList;