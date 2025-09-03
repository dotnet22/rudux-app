import { useMemo } from 'react'
import { useGetAcademicYearByIdQuery } from '../store/api/academicYearsApi'
import type { AcademicYear } from '../types/academicYear'

interface UseAcademicYearDetailViewOptions {
  academicYearId?: string
  academicYear?: AcademicYear | null
}

export const useAcademicYearDetailView = ({ 
  academicYearId, 
  academicYear 
}: UseAcademicYearDetailViewOptions = {}) => {
  // Only fetch data if we need to (no direct academic year provided and we have an ID)
  const shouldFetch = !academicYear && !!academicYearId
  
  const { 
    data: fetchedAcademicYear, 
    error, 
    isLoading,
    refetch
  } = useGetAcademicYearByIdQuery(
    academicYearId || '', 
    { skip: !shouldFetch }
  )

  // Use provided academic year or fallback to fetched data
  const data = useMemo(() => {
    return academicYear || fetchedAcademicYear
  }, [academicYear, fetchedAcademicYear])

  const onRetry = useMemo(() => {
    return shouldFetch ? refetch : undefined
  }, [shouldFetch, refetch])

  return useMemo(() => ({
    data,
    isLoading,
    error,
    onRetry
  }), [data, isLoading, error, onRetry])
}