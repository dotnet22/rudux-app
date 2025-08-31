export interface Program {
  ProgramPK: string
  ProgramName: string
  ProgramCode: string
  UniversityShortName: string
  CourseShortName: string
  InstituteShortName: string
  DepartmentShortName: string
  FacultyShortName: string
  SpecializationShortName: string
  SpecializationName?: string
}

export interface ProgramFilterModel {
  UniversityPK: string | null
  CoursePK: string | null
  SpecializationPK: string | null
}

export interface ProgramListRequest {
  pageOffset: number
  pageSize: number
  sortField: string | null
  sortOrder: string | null
  filterModel: ProgramFilterModel
}

export interface ProgramListResponse {
  Total: number
  Data: Program[]
}