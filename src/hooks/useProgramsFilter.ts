import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useWatchBatch } from '../utils/watch'
import { useCascadingFields } from '../utils/form/useCascadingFields'
import { useGetUniversitiesQuery } from '../store/api/universityApi'
import { useGetFacultiesQuery } from '../store/api/facultyApi'
import { useGetCoursesQuery } from '../store/api/courseApi'
import { useGenericFriendlyFilterWithMemoization } from './filters/useGenericFriendlyFilterResolver'
import { setFilters, setFriendlyFilters, selectProgramsState } from '../store/slices/programsSlice'
import type { ProgramFilterModel } from '../types/program'

// Filter form schema
const programFilterSchema = z.object({
  UniversityPK: z.string().optional().nullable(),
  CoursePK: z.string().optional().nullable(),
  FacultyPK: z.string().optional().nullable(),
})

export type ProgramFilterFormData = z.infer<typeof programFilterSchema>

export const useProgramsFilter = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector(selectProgramsState)

  // Form setup
  const { control, handleSubmit, reset, setValue } = useForm<ProgramFilterFormData>({
    resolver: zodResolver(programFilterSchema),
    defaultValues: {
      UniversityPK: filters?.UniversityPK || null,
      CoursePK: filters?.CoursePK || null,
      FacultyPK: filters?.FacultyPK || null,
    },
  })

  // Watch form fields
  const watchedFields = useWatchBatch(control, ["UniversityPK", "FacultyPK", "CoursePK"] as const)
  const { UniversityPK, FacultyPK, CoursePK } = watchedFields

  // Handle cascading field resets
  useCascadingFields(setValue, watchedFields, [
    { parent: 'UniversityPK', children: ['FacultyPK', 'CoursePK'] },
    { parent: 'FacultyPK', children: ['CoursePK'] }
  ])

  // API queries
  const { data: universities = [], isLoading: isLoadingUniversities } = useGetUniversitiesQuery()
  const { data: faculties = [], isLoading: isLoadingFaculties } = useGetFacultiesQuery(UniversityPK!, { skip: !UniversityPK })
  const { data: courses = [], isLoading: isLoadingCourses } = useGetCoursesQuery(FacultyPK!, { skip: !FacultyPK })

  // Friendly filter resolution with memoization
  const { friendlyFilter, primitives } = useGenericFriendlyFilterWithMemoization({
    filterModel: {
      UniversityPK: UniversityPK || null,
      FacultyPK: FacultyPK || null,
      CoursePK: CoursePK || null,
      IsActive: null,
      SearchTerm: null,
      CreatedAfter: null,
    },
    fieldResolvers: {
      UniversityPK: { type: 'dropdown', dataSource: universities },
      FacultyPK: { type: 'dropdown', dataSource: faculties },
      CoursePK: { type: 'dropdown', dataSource: courses },
      IsActive: { type: 'boolean', booleanLabels: { true: 'Active', false: 'Inactive', null: 'All' } },
      SearchTerm: { type: 'string' },
      CreatedAfter: { type: 'date', dateFormat: 'MM/DD/YYYY' }
    },
    dateFormat: 'MM/DD/YYYY'
  })

  // Update friendly filters in Redux
  useEffect(() => {
    dispatch(setFriendlyFilters(friendlyFilter))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, ...primitives])

  // Event handlers
  const handleFilterChange = useCallback((newFilters: ProgramFilterModel) => {
    dispatch(setFilters(newFilters))
  }, [dispatch])

  const handleClear = useCallback(() => {
    const clearedFilters = { UniversityPK: null, CoursePK: null, FacultyPK: null, IsActive: null, SearchTerm: null, CreatedAfter: null }
    reset(clearedFilters)
    handleFilterChange(clearedFilters)
  }, [reset, handleFilterChange])

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
    UniversityPK,
    FacultyPK,
    onFilterChange: handleFilterChange,
  }
}