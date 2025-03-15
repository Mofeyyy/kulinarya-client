const VerifyStatusMessage = ({ isLoading, isError, error }) => {
  const message = isLoading ? (
    <p>
      <span className="animate-pulse text-primary">Verifying</span> your email
      ...
    </p>
  ) : isError ? (
    <p className="text-destructive animate-pulse">{error.message}</p>
  ) : (
    <p>
      Email successfully{" "}
      <span className="text-primary animate-pulse">verified</span>!
    </p>
  );

  return (
    <div className="flex flex-1 items-center justify-center" aria-live="polite">
      <div className="w-full text-center text-foreground text-6xl font-bold">
        {message}
      </div>
    </div>
  );
};

export default VerifyStatusMessage;
