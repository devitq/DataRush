interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, id, ...props }: InputProps) => {
  return (
    <div className="flex w-full flex-col items-stretch gap-2">
      {label && (
        <label htmlFor={id} className="text-base font-semibold">
          {label}
        </label>
      )}
      <input
        id={id}
        className="bg-card h-12 rounded-xl border px-4 text-base"
        {...props}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
