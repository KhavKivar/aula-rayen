export const queryKeys = {
  session: ["session"],
  courses: ["courses"],
  course: (courseId: number) => ["course", courseId],
  courseBuyers: (courseId: number | null) => ["course-buyers", courseId],
} as const;
