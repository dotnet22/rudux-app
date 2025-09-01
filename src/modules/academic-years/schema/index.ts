import z from "zod"

export const academicYearFormSchema = z.object({
  AcademicYearPK: z.string().optional(),
  AcademicYearName: z.string().min(1, "Academic Year Name is required"),
  AcademicYear: z.number().int().min(1900, "Academic Year must be valid").max(2100, "Academic Year must be valid"),
  AcademicYearFromDate: z.string().min(1, "Academic Year From Date is required"),
  AcademicYearToDate: z.string().min(1, "Academic Year To Date is required"),
  FinancialYearFromDate: z.string().min(1, "Financial Year From Date is required"),
  FinancialYearToDate: z.string().min(1, "Financial Year To Date is required"),
  CalendarYearFromDate: z.string().min(1, "Calendar Year From Date is required"),
  CalendarYearToDate: z.string().min(1, "Calendar Year To Date is required"),
  Description: z.string().optional().nullable(),
})

export type AcademicYearFormData = z.infer<typeof academicYearFormSchema>