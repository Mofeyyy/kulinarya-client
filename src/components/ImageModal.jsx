import useImageModalStore from "@/hooks/stores/useImageModalStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// --------------------------------------------------------------------

const ImageModal = () => {
  const { isImageModalOpen, imageSrc, closeImageModal } = useImageModalStore();

  return (
    <Dialog open={isImageModalOpen} onOpenChange={closeImageModal}>
      <DialogContent
        className="max-h-[95vh] overflow-hidden p-0 outline-none sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
        hasCloseButton={false}
      >
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>

        <img
          src={imageSrc}
          alt="imagePreview"
          className="h-full w-full cursor-zoom-out rounded-lg object-cover transition hover:opacity-80"
          onClick={closeImageModal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
