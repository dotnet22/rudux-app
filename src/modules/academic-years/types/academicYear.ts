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

export interface AcademicYearDetails extends AcademicYear {
  CreatedByUserName: string
  ModifiedByUserName: string
  Created: string
  Modified: string
}

export interface OperationResponse {
  Id?: string
  RowsAffected: number
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