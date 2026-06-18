import React from 'react';

/**
 * Reusable Button component.
 * variant: 'primary' | 'secondary' | 'outline-primary' | 'warning' | 'danger'
 * size:    'sm' | 'md' | 'lg'
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    size === 'lg' ? 'btn-block' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
