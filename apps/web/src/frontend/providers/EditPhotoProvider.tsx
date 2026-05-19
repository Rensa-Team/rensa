import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import Button from "@/frontend/components/buttons/Button";
import TertiaryButton from "@/frontend/components/buttons/TertiaryButton";
import { api } from "@/lib/axios-client";
import { useToast } from "./ToastProvider";

interface PhotoState {
	isOwner: boolean;
	photoId: string;
}
interface EditPhotoContextType {
	closeEditor: () => void;
	handleShare: (photoId: string) => void;
	isOpen: boolean;
	openEditor: (photo: PhotoState) => void;
}
const EditPhotoContext = createContext<EditPhotoContextType | undefined>(
	undefined
);

export const useEditPhoto = () => {
	const ctx = useContext(EditPhotoContext);
	if (!ctx) {
		throw new Error("useEditPhoto must be used within EditPhotoProvider");
	}
	return ctx;
};

interface EditPhotoProviderProps {
	children: React.ReactNode;
}
export const EditPhotoProvider: React.FC<EditPhotoProviderProps> = ({
	children,
}) => {
	const router = useRouter();
	const { showToast } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [photoState, setPhotoState] = useState<PhotoState>({
		photoId: "",
		isOwner: false,
	});
	const openEditor = (photo: PhotoState) => {
		setIsOpen(true);
		setPhotoState(photo);
	};
	const closeEditor = () => {
		setIsOpen(false);
	};
	const handleShare = async () => {
		const shareUrl = `${window.location.origin}/photo/${photoState.photoId}`;
		try {
			await navigator.clipboard.writeText(shareUrl);
			showToast("Photo link copied to clipboard!", "success");
		} catch {
			showToast("Failed to copy photo link", "error");
		} finally {
			closeEditor();
		}
	};
	const removePhoto = async (photoId: string) => {
		try {
			await api.delete(`/photos/${photoId}`);
			showToast("Photo deleted successfully", "success");
			closeEditor();
			router.replace("/explore");
		} catch (err) {
			showToast("Failed to delete photo", "error");
			console.error("Error deleting photo:", err);
		}
	};
	return (
		<EditPhotoContext.Provider
			value={{ isOpen, openEditor, closeEditor, handleShare }}
		>
			{children}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
					<div className="w-95 rounded-2xl bg-white p-6 shadow-xl">
						<h2 className="mb-4 font-bold text-xl">
							Are you sure you want to delete this photo?
						</h2>
						<div className="flex flex-row justify-end gap-4">
							<Button
								className="bg-red-600 text-white hover:bg-red-700"
								onClick={() => removePhoto(photoState.photoId)}
							>
								Delete
							</Button>
							<TertiaryButton onClick={closeEditor}>Cancel</TertiaryButton>
						</div>
					</div>
				</div>
			)}
		</EditPhotoContext.Provider>
	);
};
