import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import type { 
    ModalData, 
    ModalProps, 
    Slot, 
    SlotRenderFn 
} from "./types";

export const CommanModal = <T extends ModalData>({
    isOpen,
    onClose,
    data,
    title,
    maxWidth = 'md',
    fullWidth = true,
    disableEscapeKeyDown = false,
    hideCloseButton = false,
    children,
    headerSlot,
    bodySlot,
    footerSlot,
}: ModalProps<T>) => {
    const isRenderFn = <T extends ModalData>(
        slot: Slot<T, boolean>,
    ): slot is SlotRenderFn<T> => typeof slot === 'function';

    if (!isOpen) return null;

    const handleClose = (_event: object, reason: string) => {
        if (reason === 'escapeKeyDown' && disableEscapeKeyDown) {
            return;
        }
        onClose();
    };

    // Render header content
    const renderHeader = () => {
        if (headerSlot) {
            return isRenderFn(headerSlot) ? headerSlot(data) : headerSlot;
        }
        return title || 'Modal';
    };

    // Render body content
    const renderBody = () => {
        if (children) {
            return children;
        }
        if (bodySlot) {
            return isRenderFn(bodySlot) ? bodySlot(data) : bodySlot;
        }
        return null;
    };

    // Render footer content
    const renderFooter = () => {
        if (footerSlot) {
            return isRenderFn(footerSlot) ? footerSlot(data) : footerSlot;
        }
        return (
            <Button autoFocus onClick={onClose}>
                Close
            </Button>
        );
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    minHeight: '200px',
                },
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {renderHeader()}
                {!hideCloseButton && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent dividers>
                {renderBody()}
            </DialogContent>
            <DialogActions>
                {renderFooter()}
            </DialogActions>
        </Dialog>
    );
};