import { useState } from 'react';
import { Box, Button, Stack, Paper, Typography } from '@mui/material';
import { Add, Edit, Visibility, Settings } from '@mui/icons-material';
import { CommanModal, useCommonModal } from '../../../components/CommonModal';
import AcademicYearDetailView from './AcademicYearDetailView';
import { AcademicYearForm } from './AcademicYearForm';
import type { AcademicYearDetails } from '../types/academicYear';

// Mock data for demonstration
const mockAcademicYear: AcademicYearDetails & { id: string } = {
    AcademicYearPK: '12345',
    AcademicYearName: '2023-24',
    AcademicYear: 2023,
    AcademicYearFromDate: '2023-07-01T00:00:00Z',
    AcademicYearToDate: '2024-06-30T23:59:59Z',
    FinancialYearFromDate: '2023-04-01T00:00:00Z',
    FinancialYearToDate: '2024-03-31T23:59:59Z',
    CalendarYearFromDate: '2023-01-01T00:00:00Z',
    CalendarYearToDate: '2023-12-31T23:59:59Z',
    Description: 'Academic year for undergraduate and postgraduate programs',
    Created: '2023-05-01T10:30:00Z',
    Modified: '2023-05-15T14:20:00Z',
    CreatedByUserName: 'John Doe',
    ModifiedByUserName: 'Jane Smith',
    id: '12345'
};

const AcademicYearsModalExample = () => {
    const [modalType, setModalType] = useState<'none' | 'view' | 'edit' | 'create' | 'custom'>('none');
    const { modalState, openModal, closeModal } = useCommonModal<AcademicYearDetails & { id: string }>();

    const handleViewClick = () => {
        setModalType('view');
        openModal(mockAcademicYear);
    };

    const handleEditClick = () => {
        setModalType('edit');
        openModal(mockAcademicYear);
    };

    const handleCreateClick = () => {
        setModalType('create');
        openModal();
    };

    const handleCustomModalClick = () => {
        setModalType('custom');
        openModal(mockAcademicYear);
    };

    const handleModalClose = () => {
        setModalType('none');
        closeModal();
    };

    const handleSuccess = () => {
        console.log('Form submitted successfully!');
        handleModalClose();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    CommonModal Examples - Generic Usage
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
                    Demonstration of the generic CommonModal component used for different scenarios.
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={handleViewClick}
                    >
                        View Modal
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEditClick}
                    >
                        Edit Modal
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreateClick}
                    >
                        Create Modal
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Settings />}
                        onClick={handleCustomModalClick}
                    >
                        Custom Modal
                    </Button>
                </Stack>

                {/* View Modal - Using existing component directly */}
                {modalType === 'view' && modalState.data && (
                    <CommanModal
                        isOpen={modalState.isOpen}
                        onClose={handleModalClose}
                        data={modalState.data}
                        title="Academic Year Details"
                        maxWidth="lg"
                    >
                        <AcademicYearDetailView academicYearId={modalState.data.AcademicYearPK} />
                    </CommanModal>
                )}

                {/* Edit Modal - Using existing form component directly */}
                {modalType === 'edit' && modalState.data && (
                    <CommanModal
                        isOpen={modalState.isOpen}
                        onClose={handleModalClose}
                        data={modalState.data}
                        title="Edit Academic Year"
                        maxWidth="md"
                        hideCloseButton={true}
                    >
                        <AcademicYearForm
                            initialData={modalState.data}
                            onSuccess={handleSuccess}
                            onCancel={handleModalClose}
                        />
                    </CommanModal>
                )}

                {/* Create Modal - Using existing form component in create mode */}
                {modalType === 'create' && (
                    <CommanModal
                        isOpen={modalState.isOpen}
                        onClose={handleModalClose}
                        title="Create New Academic Year"
                        maxWidth="md"
                        hideCloseButton={true}
                    >
                        <AcademicYearForm
                            onSuccess={handleSuccess}
                            onCancel={handleModalClose}
                        />
                    </CommanModal>
                )}

                {/* Custom Modal - Showing completely custom content */}
                {modalType === 'custom' && modalState.data && (
                    <CommanModal
                        isOpen={modalState.isOpen}
                        onClose={handleModalClose}
                        data={modalState.data}
                        title="Custom Modal Example"
                        maxWidth="sm"
                        footerSlot={(data?: AcademicYearDetails & { id: string }) => (
                            <>
                                <Button onClick={() => console.log('Custom action!', data)} variant="outlined">
                                    Custom Action
                                </Button>
                                <Button onClick={handleModalClose} color="primary">
                                    Close
                                </Button>
                            </>
                        )}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                This is completely custom content!
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Academic Year: {modalState.data?.AcademicYearName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                You can put any content here - forms, charts, images, etc.
                                The CommonModal is completely flexible.
                            </Typography>
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="body2">
                                    💡 This demonstrates the generic nature of CommonModal - 
                                    it can display any content you want!
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                <Button variant="outlined" size="small">
                                    Action 1
                                </Button>
                                <Button variant="outlined" size="small">
                                    Action 2
                                </Button>
                            </Stack>
                        </Box>
                    </CommanModal>
                )}
            </Paper>
        </Box>
    );
};

export default AcademicYearsModalExample;