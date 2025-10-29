import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({
  children,
  fullWidth,
  variant = 'primary',
  className,
  ...props
}) => {
  const baseStyle =
    'py-2 px-4 font-semibold rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 focus:ring-blue-400',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
  };

  return (
    <button
      className={clsx(
        baseStyle,
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
