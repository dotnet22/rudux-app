import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import type { ModalData, ModalProps, Slot, SlotRenderFn } from "./types";

export const CommanModal = <T extends ModalData>({
    isOpen,
    onClose,
    data,
    headerSlot = <h2>Default Header</h2>,
    bodySlot,
    footerSlot,
}: ModalProps<T>) => {
    const isRenderFn = <T extends ModalData>(
        slot: Slot<T, boolean>,
    ): slot is SlotRenderFn<T> => typeof slot === 'function';

    if (!isOpen) return null;
    return (
        <Dialog open={true}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {isRenderFn(headerSlot) ? headerSlot(data) : headerSlot}
            </DialogTitle>
            <DialogContent dividers>
                {isRenderFn(bodySlot) ? bodySlot(data) : bodySlot}
                {isRenderFn(footerSlot) ? footerSlot(data) : footerSlot}
            </DialogContent>
            <DialogActions>
                {footerSlot ? (
                    isRenderFn(footerSlot) ? footerSlot(data) : footerSlot
                ) : (
                    <Button autoFocus onClick={onClose}>
                        Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};