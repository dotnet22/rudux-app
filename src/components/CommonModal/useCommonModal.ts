import { useState, useCallback } from 'react';
import type { ModalData } from './types';

export interface ModalState<T extends ModalData> {
    isOpen: boolean;
    data: T | null;
}

export const useCommonModal = <T extends ModalData>() => {
    const [modalState, setModalState] = useState<ModalState<T>>({
        isOpen: false,
        data: null,
    });

    const openModal = useCallback((data?: T) => {
        setModalState({
            isOpen: true,
            data: data || null,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            isOpen: false,
        }));
    }, []);

    return {
        modalState,
        openModal,
        closeModal,
    };
};