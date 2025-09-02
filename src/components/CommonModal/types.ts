// Base constraint for data
export interface ModalData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}


// Stricter slot types
export type SlotContent = React.ReactElement;
export type SlotRenderFn<T extends ModalData> = (data: T) => React.ReactElement;

// Conditional type for optional/required slots
export type Slot<T extends ModalData, Required extends boolean = false> = Required extends true
    ? SlotContent | SlotRenderFn<T>
    : SlotContent | SlotRenderFn<T> | undefined;

export interface ModalProps<T extends ModalData> {
    isOpen: boolean;
    onClose: () => void;
    data: T;
    headerSlot?: Slot<T, false>;
    bodySlot: Slot<T, true>;
    footerSlot?: Slot<T, false>;
}