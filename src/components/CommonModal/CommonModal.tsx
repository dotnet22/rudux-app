import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import type { 
    ModalData, 
    ModalProps, 
    Slot, 
    SlotComponent,
    SlotElement,
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
    headerSlotProps,
    bodySlotProps,
    footerSlotProps,
}: ModalProps<T>) => {
    const isComponent = <T extends ModalData>(
        slot: Slot<T>
    ): slot is SlotComponent => {
        // Check if it's a regular function component
        if (typeof slot === 'function') {
            return !(slot.name === '' || slot.name.startsWith('render'));
        }
        
        // Check if it's a React.memo component (object with $$typeof)
        if (typeof slot === 'object' && slot && (slot as any).$$typeof) {
            return true;
        }
        
        return false;
    };

    const isRenderFn = <T extends ModalData>(
        slot: Slot<T>
    ): slot is SlotRenderFn<T> => 
        typeof slot === 'function' && 
        // Either anonymous function or starts with 'render' or has no display name
        (slot.name === '' || slot.name.startsWith('render') || !(slot as any).displayName);

    const isElement = <T extends ModalData>(
        slot: Slot<T>
    ): slot is SlotElement => 
        typeof slot === 'object' && 
        slot !== null && 
        'type' in slot &&
        'props' in slot;

    if (!isOpen) return null;

    const handleClose = (_event: object, reason: string) => {
        if (reason === 'escapeKeyDown' && disableEscapeKeyDown) {
            return;
        }
        onClose();
    };

    // Render slot content with support for components, elements, and render functions
    const renderSlot = (
        slot: Slot<T> | undefined, 
        slotProps: Record<string, any> = {},
        defaultContent?: React.ReactNode
    ) => {
        if (!slot) return defaultContent;
        
        if (isComponent(slot)) {
            const Component = slot;
            return <Component {...slotProps} />;
        }
        
        if (isRenderFn(slot)) {
            return slot(data);
        }
        
        if (isElement(slot)) {
            return slot;
        }
        
        return defaultContent;
    };

    // Render header content
    const renderHeader = () => {
        return renderSlot(
            headerSlot, 
            { ...headerSlotProps, data },
            title || 'Modal'
        );
    };

    // Render body content
    const renderBody = () => {
        if (children) {
            return children;
        }
        
        return renderSlot(
            bodySlot, 
            { ...bodySlotProps, data },
            null
        );
    };

    // Render footer content
    const renderFooter = () => {
        return renderSlot(
            footerSlot,
            { ...footerSlotProps, data },
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