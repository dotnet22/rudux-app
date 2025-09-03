import { memo, useMemo } from 'react'
import { AcademicYearFormView } from './AcademicYearFormView'
import { CommanModal } from '../../../components/CommonModal/CommonModal'
import { useAcademicYearFormView } from '../hooks/useAcademicYearForm'

interface AcademicYearFormModalProps {
  onSuccess?: () => void
  onRefetch?: () => void
}

const AcademicYearFormModalComponent: React.FC<AcademicYearFormModalProps> = ({
  onSuccess,
  onRefetch,
}) => {
  const {
    modalState,
    handleCloseModal,
  } = useAcademicYearFormView({ onSuccess, onRefetch })

  // Memoize body slot props to prevent unnecessary re-renders
  const bodySlotProps = useMemo(() => ({
    onSuccess,
    onRefetch,
    onCancel: handleCloseModal,
  }), [onSuccess, onRefetch, handleCloseModal])

  return (
    <CommanModal
      isOpen={modalState.open}
      onClose={handleCloseModal}
      title={modalState.mode === 'create' ? 'Create Academic Year' : 'Edit Academic Year'}
      maxWidth="lg"
      hideCloseButton={true}
      bodySlot={AcademicYearFormView}
      bodySlotProps={bodySlotProps}
    />
  )
}

// Memoize the component to prevent unnecessary re-renders
export const AcademicYearFormModal = memo(AcademicYearFormModalComponent)