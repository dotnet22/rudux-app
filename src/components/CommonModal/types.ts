import type { ComponentType, ReactElement, ReactNode } from 'react';

// Base constraint for data
export interface ModalData {
    [key: string]: unknown;
}

// Component-based slot types
export type SlotComponent<P = Record<string, unknown>> = ComponentType<P>;
export type SlotElement = ReactElement;
export type SlotRenderFn<T extends ModalData> = (data?: T) => ReactElement;

// Unified slot type that accepts components, elements, or render functions
export type Slot<T extends ModalData, P = Record<string, unknown>, Required extends boolean = false> = Required extends true
    ? SlotComponent<P> | SlotElement | SlotRenderFn<T>
    : SlotComponent<P> | SlotElement | SlotRenderFn<T> | undefined;

// Slot props interface for passing props to slot components
export interface SlotProps<T extends ModalData = ModalData> {
    headerSlotProps?: Record<string, unknown>;
    bodySlotProps?: Record<string, unknown> & { data?: T };
    footerSlotProps?: Record<string, unknown>;
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
    children?: ReactNode;
    // Slot system for more flexibility - now supports components, elements, and render functions
    headerSlot?: Slot<T>;
    bodySlot?: Slot<T>;
    footerSlot?: Slot<T>;
}