export interface AcademicYear {
  AcademicYearPK: string
  AcademicYearName: string
  AcademicYear: number
  AcademicYearFromDate: string
  AcademicYearToDate: string
  FinancialYearFromDate: string
  FinancialYearToDate: string
  CalendarYearFromDate: string
  CalendarYearToDate: string
  Description?: string | null
}

export interface OperationResponse {
  id?: number
  rowsAffected: number
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
  Total: number
  Data: AcademicYear[]
}