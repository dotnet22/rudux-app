import { useEffect, useCallback, useRef } from 'react'
import { useForm, Controller, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { useWatchBatch } from '../utils/watch'
import { useGetUniversitiesQuery } from '../store/api/universityApi'
import { useGetFacultiesQuery } from '../store/api/facultyApi'
import { useGetCoursesQuery } from '../store/api/courseApi'
import { useFriendlyFilterResolver } from './useFriendlyFilterResolver'
import { setFriendlyFilters } from '../store/slices/programsSlice'
import type { ProgramFilterModel } from '../types/program'
import type { University, ComboBoxResponse } from '../types/comboBox'

const programFilterSchema = z.object({
  UniversityPK: z.string().optional().nullable(),
  CoursePK: z.string().optional().nullable(),
  FacultyPK: z.string().optional().nullable(),
})

export type ProgramFilterFormData = z.infer<typeof programFilterSchema>

interface UseProgramsFilterProps {
  onFilterChange: (filters: ProgramFilterModel) => void
  initialFilters?: ProgramFilterModel
}

export interface UseProgramsFilterReturn {
  control: Control<ProgramFilterFormData>
  handleSubmit: (onValid: (data: ProgramFilterFormData) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>
  handleClear: () => void
  universities: University[]
  faculties: ComboBoxResponse
  courses: ComboBoxResponse
  isLoadingUniversities: boolean
  isLoadingFaculties: boolean
  isLoadingCourses: boolean
  Controller: typeof Controller
}

export const useProgramsFilter = ({
  onFilterChange,
  initialFilters
}: UseProgramsFilterProps): UseProgramsFilterReturn => {
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<ProgramFilterFormData>({
    resolver: zodResolver(programFilterSchema),
    defaultValues: {
      UniversityPK: initialFilters?.UniversityPK || null,
      CoursePK: initialFilters?.CoursePK || null,
      FacultyPK: initialFilters?.FacultyPK || null,
    },
  })

  // Watch for cascading changes
  const watchedFields = useWatchBatch(control, ["UniversityPK", "FacultyPK"] as const)
  const { UniversityPK, FacultyPK } = watchedFields

  // API queries
  const {
    data: universities = [],
    isLoading: isLoadingUniversities
  } = useGetUniversitiesQuery()

  const {
    data: faculties = [],
    isLoading: isLoadingFaculties
  } = useGetFacultiesQuery(UniversityPK!, {
    skip: !UniversityPK
  })

  const {
    data: courses = [],
    isLoading: isLoadingCourses
  } = useGetCoursesQuery(FacultyPK!, {
    skip: !FacultyPK
  })

  // Get current filter values for friendly filter resolution
  const currentFilters = useWatchBatch(control, ["UniversityPK", "FacultyPK", "CoursePK"] as const)

  // Resolve friendly filter values
  const friendlyFilter = useFriendlyFilterResolver({
    filterModel: {
      UniversityPK: currentFilters.UniversityPK || null,
      FacultyPK: currentFilters.FacultyPK || null,
      CoursePK: currentFilters.CoursePK || null,
    },
    universities,
    faculties,
    courses,
  })

  // Update friendly filters in Redux when they change
  // Using JSON stringify for deep comparison to prevent unnecessary updates
  const friendlyFilterString = JSON.stringify(friendlyFilter)
  useEffect(() => {
    dispatch(setFriendlyFilters(friendlyFilter))
  }, [dispatch, friendlyFilterString])

  // Handle cascading resets with refs to avoid infinite loops
  const previousUniversityRef = useRef(UniversityPK)
  const previousFacultyRef = useRef(FacultyPK)

  useEffect(() => {
    // Reset faculty when university changes
    if (previousUniversityRef.current !== UniversityPK) {
      if (previousUniversityRef.current !== undefined) {
        setValue('FacultyPK', null)
        setValue('CoursePK', null)
      }
      previousUniversityRef.current = UniversityPK
    }
  }, [UniversityPK, setValue])

  useEffect(() => {
    // Reset course when faculty changes
    if (previousFacultyRef.current !== FacultyPK) {
      if (previousFacultyRef.current !== undefined) {
        setValue('CoursePK', null)
      }
      previousFacultyRef.current = FacultyPK
    }
  }, [FacultyPK, setValue])

  // const onSubmit = useCallback((data: ProgramFilterFormData) => {
  //   onFilterChange({
  //     UniversityPK: data.UniversityPK || null,
  //     CoursePK: data.CoursePK || null,
  //     FacultyPK: data.FacultyPK || null,
  //   })
  // }, [onFilterChange])

  const handleClear = useCallback(() => {
    const clearedFilters = {
      UniversityPK: null,
      CoursePK: null,
      FacultyPK: null,
    }
    reset(clearedFilters)
    onFilterChange(clearedFilters)
  }, [reset, onFilterChange])

  // Remove auto-submit to prevent infinite loops
  // Auto-submit functionality is handled by explicit form submission
  // Auto-submit on changes
  // useEffect(() => {
  //   const subscription = watch(() => handleSubmit(onSubmit)())
  //   return () => subscription.unsubscribe()
  // }, [handleSubmit, watch, onSubmit])

  return {
    control,
    handleSubmit,
    handleClear,
    universities,
    faculties,
    courses,
    isLoadingUniversities,
    isLoadingFaculties,
    isLoadingCourses,
    Controller,
  }
}