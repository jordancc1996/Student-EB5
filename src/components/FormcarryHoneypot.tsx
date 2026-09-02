import { useId } from 'react';

interface FormcarryHoneypotProps {
  value: string;
  onChange: (value: string) => void;
}

const FormcarryHoneypot = ({ value, onChange }: FormcarryHoneypotProps) => {
  const fieldId = useId();

  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor={fieldId}>Website</label>
      <input
        id={fieldId}
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default FormcarryHoneypot;
