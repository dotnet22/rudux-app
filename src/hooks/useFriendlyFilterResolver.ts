import { useMemo } from 'react'
import type { ProgramFilterModel, FriendlyFilterRecord } from '../types/program'
import type { ComboBoxItem, University } from '../types/comboBox'
import { createFriendlyFilterValue, resolveLabelFromComboBoxData } from '../utils/friendlyFilter'

interface UseFriendlyFilterResolverProps {
  filterModel: ProgramFilterModel
  universities?: University[]
  faculties?: ComboBoxItem[]
  courses?: ComboBoxItem[]
}

export const useFriendlyFilterResolver = ({
  filterModel,
  universities = [],
  faculties = [],
  courses = [],
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
    }

    return result
  }, [filterModel, universities, faculties, courses])
}