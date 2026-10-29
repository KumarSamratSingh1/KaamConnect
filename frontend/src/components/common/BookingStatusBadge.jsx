import React from 'react';
import { BOOKING_STATUS_CONFIG } from '../../utils/helpers';

export default function BookingStatusBadge({ status }) {
  const config = BOOKING_STATUS_CONFIG[status] || { label: status, color: 'badge-blue', icon: '•' };
  return (
    <span className={config.color + ' badge'}>
      {config.icon} {config.label}
    </span>
  );
}
