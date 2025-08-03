import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition ${className}`}
      {...props}
    />
  );
};
