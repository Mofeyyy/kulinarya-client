const InputPopupMessage = ({ message, isError }) => {
  return (
    <div
      className={`w-full border-2 px-3 py-3 rounded-lg text-sm ${
        isError ? `border-red-600 bg-red-200 ` : `border-green-600 bg-green-300`
      }  `}
    >
      <p
        className={`font-medium ${isError ? "text-red-600" : "text-green-600"}`}
      >
        {message}
      </p>
    </div>
  );
};

export default InputPopupMessage;
