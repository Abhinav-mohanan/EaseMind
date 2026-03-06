export const getAppointmentStatusLabel = (status) => {
  const statusLabels = {
    booked: 'Booked',
    completed: 'Completed',
    cancelled: 'Cancelled',
    not_attended: 'Not Attended',
  };

  return statusLabels[status] || 'Unknown';
};
