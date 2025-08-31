import { useSelector } from 'react-redux'
import { selectProgramsState } from '../store/slices/programsSlice'

export const useProgramsFilterDisplay = () => {
  const { friendlyFilter } = useSelector(selectProgramsState)

  return {
    friendlyFilter,
  }
}