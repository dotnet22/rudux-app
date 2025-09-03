import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { isValidElement, ComponentType } from "react";
import type { ModalData, ModalProps } from "./types";

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
    headerSlotProps = {},
    bodySlotProps = {},
    footerSlotProps = {},
}: ModalProps<T>) => {
    if (!isOpen) return null;

    const handleClose = (_event: object, reason: string) => {
        if (reason === 'escapeKeyDown' && disableEscapeKeyDown) {
            return;
        }
        onClose();
    };

    // Simple slot renderer - try React component first, then render function, then element
    const renderSlot = (
        slot: any,
        props: Record<string, any> = {},
        fallback?: React.ReactNode
    ): React.ReactNode => {
        if (!slot) return fallback;

        // If it's a React element, return it as-is
        if (isValidElement(slot)) {
            return slot;
        }

        // If it's a function (component or render function), call it
        if (typeof slot === 'function') {
            try {
                // Try as React component first
                return <slot {...props} />;
            } catch {
                // If that fails, try as render function
                return slot(data);
            }
        }

        // If it's a React.memo or forwardRef component (object with $$typeof)
        if (typeof slot === 'object' && slot?.$$typeof) {
            const Component = slot as ComponentType<any>;
            return <Component {...props} />;
        }

        return fallback;
    };

    const renderHeader = () => {
        return renderSlot(
            headerSlot,
            { ...headerSlotProps, data },
            title || 'Modal'
        );
    };

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