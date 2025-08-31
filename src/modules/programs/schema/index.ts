import z from "zod"

// Filter form schema
export const programFilterSchema = z.object({
    UniversityPK: z.string().optional().nullable(),
    CoursePK: z.string().optional().nullable(),
    FacultyPK: z.string().optional().nullable(),
})

export type ProgramFilterFormData = z.infer<typeof programFilterSchema>