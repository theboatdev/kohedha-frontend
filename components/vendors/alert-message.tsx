type AlertMessageProps = {
  message: string;
  type: "success" | "error";
};

export function AlertMessage({ message, type }: AlertMessageProps) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-600",
    error: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div className={`p-3 border rounded-lg ${styles[type]}`}>
      <p className={`text-sm font-poppins`}>{message}</p>
    </div>
  );
}
