import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside"; // adjust path as needed

const ModalWrapper = ({ children, onClose, maxWidth = "max-w-md" }) => {
  const modalRef = useRef(null);

  useClickOutside(modalRef, onClose);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className={`relative w-11/12 rounded-lg bg-background ${maxWidth}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <button onClick={onClose} className="absolute top-2 right-2 hover:text-red-500">
            <X size={24} />
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalWrapper;
