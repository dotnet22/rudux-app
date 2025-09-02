// Base constraint for data
export interface ModalData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// Component-based slot types
export type SlotComponent<P = {}> = React.ComponentType<P>;
export type SlotElement = React.ReactElement;
export type SlotRenderFn<T extends ModalData> = (data?: T) => React.ReactElement;

// Unified slot type that accepts components, elements, or render functions
export type Slot<T extends ModalData, P = {}, Required extends boolean = false> = Required extends true
    ? SlotComponent<P> | SlotElement | SlotRenderFn<T>
    : SlotComponent<P> | SlotElement | SlotRenderFn<T> | undefined;

// Slot props interface for passing props to slot components
export interface SlotProps<T extends ModalData = {}> {
    headerSlotProps?: Record<string, any>;
    bodySlotProps?: Record<string, any> & { data?: T };
    footerSlotProps?: Record<string, any>;
}

export interface ModalProps<T extends ModalData> extends SlotProps<T> {
    isOpen: boolean;
    onClose: () => void;
    data?: T;
    title?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    disableEscapeKeyDown?: boolean;
    hideCloseButton?: boolean;
    // Content can be provided as children or slots
    children?: React.ReactNode;
    // Slot system for more flexibility - now supports components, elements, and render functions
    headerSlot?: Slot<T>;
    bodySlot?: Slot<T>;
    footerSlot?: Slot<T>;
}