import React, { useState } from 'react';
import AttendanceTable from './AttendanceTable';

const AttendanceTab = ({ leaveRequests, employees }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  return (
    <div className="attendance-tab">
      <div className="tab-header">
        <h2>Attendance Tracking</h2>
      </div>

      <AttendanceTable
        leaveRequests={leaveRequests}
        employees={employees}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </div>
  );
};

export default AttendanceTab;