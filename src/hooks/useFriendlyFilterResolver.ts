import { useMemo } from 'react'
import type { ProgramFilterModel, FriendlyFilterRecord } from '../modules/programs/types/program'
import type { ComboBoxItem, University } from '../core/types/combo-box'
import { 
  createFriendlyFilterValue, 
  resolveLabelFromComboBoxData,
  resolveBooleanLabel,
  resolveStringLabel,
  resolveDateLabel
} from '../core/filters/friendly-filters'

interface UseFriendlyFilterResolverProps {
  filterModel: ProgramFilterModel
  universities?: University[]
  faculties?: ComboBoxItem[]
  courses?: ComboBoxItem[]
  dateFormat?: string
}

export const useFriendlyFilterResolver = ({
  filterModel,
  universities = [],
  faculties = [],
  courses = [],
  dateFormat = 'MM/DD/YYYY',
}: UseFriendlyFilterResolverProps): FriendlyFilterRecord<ProgramFilterModel> => {
  return useMemo(() => {
    const result: FriendlyFilterRecord<ProgramFilterModel> = {
      UniversityPK: createFriendlyFilterValue(
        resolveLabelFromComboBoxData(filterModel.UniversityPK, universities),
        filterModel.UniversityPK
      ),
      FacultyPK: createFriendlyFilterValue(
        resolveLabelFromComboBoxData(filterModel.FacultyPK, faculties),
        filterModel.FacultyPK
      ),
      CoursePK: createFriendlyFilterValue(
        resolveLabelFromComboBoxData(filterModel.CoursePK, courses),
        filterModel.CoursePK
      ),
      IsActive: createFriendlyFilterValue(
        resolveBooleanLabel(filterModel.IsActive),
        filterModel.IsActive
      ),
      SearchTerm: createFriendlyFilterValue(
        resolveStringLabel(filterModel.SearchTerm),
        filterModel.SearchTerm
      ),
      CreatedAfter: createFriendlyFilterValue(
        resolveDateLabel(filterModel.CreatedAfter, dateFormat),
        filterModel.CreatedAfter
      ),
    }

    return result
  }, [filterModel, universities, faculties, courses, dateFormat])
}