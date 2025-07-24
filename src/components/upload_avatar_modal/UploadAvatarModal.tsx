import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "antd";
import Cropper, { Area } from "react-easy-crop";
import { Images } from "@/constants/images.tsx";
import { THEME } from "@/constants/theme.ts";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { stringCancel, stringSave, uploadAvatar } from "@/constants/strings.ts";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import "./upload-avatar-modal.css";
import CustomSlider from "@/components/upload_avatar_modal/CustomSlider.tsx";

interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: (isUploaded: boolean, file?: File) => void;
  fileToCrop: File;
  currentAvatarUrl?: string;
}

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({ isOpen, onClose, fileToCrop, currentAvatarUrl }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && fileToCrop) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(fileToCrop);
    } else if (!isOpen) {
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [isOpen, fileToCrop]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = useCallback(async (): Promise<File | null> => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imageSrc;

    await new Promise(resolve => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) {
          showToast(ToastType.error, "Failed to create image blob.");
          resolve(null);
          return;
        }
        const file = new File([blob], fileToCrop.name || "cropped_avatar.png", {
          type: fileToCrop.type || "image/png"
        });
        resolve(file);
      }, fileToCrop.type || "image/png");
    });
  }, [imageSrc, croppedAreaPixels, fileToCrop, showToast]);

  const handleSave = async () => {
    const croppedFile = await getCroppedImage();
    if (croppedFile) {
      onClose(true, croppedFile);
    }
  };

  return (
    <Modal
      className="my-custom-modal"
      open={isOpen}
      title={uploadAvatar}
      width="450px"
      onCancel={() => onClose(false)}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)} style={{ height: "40px" }}>
          {stringCancel}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          disabled={!imageSrc}
          style={{ backgroundColor: THEME.COLORS.PRIMARY, height: "40px" }}
        >
          {stringSave}
        </Button>
      ]}
      centered
    >
      <div className="upload-area">
        {imageSrc ? (
          <div style={{ position: "relative", width: "100%", height: 300 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        ) : (
          <img
            src={currentAvatarUrl || Images.AvatarProfile}
            alt="Current Avatar"
            className="avatar-preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%"
            }}
          />
        )}
      </div>

      {imageSrc && (
        <div className="zoom-slider-container">
          <Button
            icon={<img src={Images.IconMinus} alt="Zoom Out" style={{ width: "16px", height: "16px" }} />}
            onClick={() => setZoom(prev => Math.max(1, prev - 0.1))}
          />
          <CustomSlider value={zoom} onChange={setZoom} />
          <Button
            icon={<img src={Images.IconPlus} alt="Zoom In" style={{ width: "16px", height: "16px" }} />}
            onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
          />
        </div>
      )}
    </Modal>
  );
};
