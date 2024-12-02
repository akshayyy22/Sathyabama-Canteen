// components/ui/Select.tsx
import React from "react";

interface SelectProps {
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  required?: boolean;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ id, value, onChange, required, children }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className="border border-gray-300 rounded p-2 w-full"
    >
      {children}
    </select>
  );
};

export default Select;
