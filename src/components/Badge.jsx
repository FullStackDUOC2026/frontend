import React from 'react';

const VARIANT_MAP = {
  success: 'badge badge-success',
  info:    'badge badge-info',
  warning: 'badge badge-warning',
  danger:  'badge badge-danger',
  neutral: 'badge badge-neutral',
};

const Badge = ({ children, variant = 'neutral' }) => {
  return (
    <span className={VARIANT_MAP[variant] || 'badge badge-neutral'}>
      {children}
    </span>
  );
};

export default Badge;
