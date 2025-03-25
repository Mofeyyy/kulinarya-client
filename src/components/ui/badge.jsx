// src/components/ui/badge.jsx
const Badge = ({ children, className }) => {
    return <span className={`px-2 py-1 text-xs font-bold rounded-full ${className}`}>{children}</span>;
  };
  
  export default Badge;
  