import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWatchBatch } from '../../../utils/watch'
import { useCascadingFields } from '../../../utils/form/useCascadingFields'
import { useGetUniversitiesQuery } from '../../../store/api/universityApi'
import { useGetFacultiesQuery } from '../../../store/api/facultyApi'
import { useGetCoursesQuery } from '../../../store/api/courseApi'
import { useGenericFriendlyFilterWithMemoization } from '../../../hooks/filters/useGenericFriendlyFilterResolver'
import { setFilters, setFriendlyFilters, selectProgramsState } from '../store/slices/programsSlice'
import type { ProgramFilterModel } from '../types/program'
import { programFilterSchema, type ProgramFilterFormData } from '../schema'

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

  // Static cascading configuration - constant reference for optimal performance
  const cascadingMap = useMemo(() => new Map<keyof ProgramFilterModel, (keyof ProgramFilterModel)[]>([
    ['UniversityPK', ['FacultyPK', 'CoursePK']],
    ['FacultyPK', ['CoursePK']]
  ]), [])

  // Optimized method to find cascading children - uses Map for O(1) lookup
  const getCascadingChildren = useCallback((fieldKey: keyof ProgramFilterModel): readonly (keyof ProgramFilterModel)[] => {
    return cascadingMap.get(fieldKey) || []
  }, [cascadingMap])

  // Optimized filter change handler with minimal object creation and batched form updates
  const handleFriendlyFilterChange = useCallback((fieldKey: keyof ProgramFilterModel) => {
    const cascadingChildren = getCascadingChildren(fieldKey)
    
    // Build filter updates object with minimal operations
    const filterUpdates: Partial<ProgramFilterModel> = { [fieldKey]: null }
    const fieldsToReset: (keyof ProgramFilterModel)[] = [fieldKey]
    
    // Add cascading children to both update objects
    for (const child of cascadingChildren) {
      filterUpdates[child] = null
      fieldsToReset.push(child)
    }

    // Build complete filter state only once
    const updatedFilters: ProgramFilterModel = {
      UniversityPK: filterUpdates.UniversityPK ?? (UniversityPK || null),
      FacultyPK: filterUpdates.FacultyPK ?? (FacultyPK || null),
      CoursePK: filterUpdates.CoursePK ?? (CoursePK || null),
      IsActive: filterUpdates.IsActive ?? null,
      SearchTerm: filterUpdates.SearchTerm ?? null,
      CreatedAfter: filterUpdates.CreatedAfter ?? null,
    }

    // Batch form state updates to minimize rerenders
    fieldsToReset.forEach(field => setValue(field, null))

    // Single Redux state update
    handleFilterChange(updatedFilters)
  }, [getCascadingChildren, UniversityPK, FacultyPK, CoursePK, setValue, handleFilterChange])

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
    onFriendlyFilterChange: handleFriendlyFilterChange,
  }
}