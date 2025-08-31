export interface AcademicYear {
  id: string
  academicYearPK: string
  academicYear: string
  startDate: string
  endDate: string
  isActive: boolean
  createdDate: string
  updatedDate: string
}

export interface FilterModel {
  ProgramName: string
  UniversityPK: string
  CoursePK: string
  FacultyPK: string
  SpecializationPK: string
}

export interface AcademicYearListRequest {
  pageOffset: number
  pageSize: number
  sortField: string | null
  sortOrder: string | null
  filterModel: FilterModel
  ProgramName: string
  UniversityPK: string
  CoursePK: string
  FacultyPK: string
  SpecializationPK: string
}

export interface AcademicYearListResponse {
  data: AcademicYear[]
  totalRecords: number
  pageOffset: number
  pageSize: number
}