export const queryKeys = {
  session: ["session"],
  courses: ["courses"],
  course: (courseId: number) => ["course", courseId],
  courseBuyers: (courseId: number | null) => ["course-buyers", courseId],
  payments: ["payments"],
  availabilitySlots: ["availability-slots"],
  availabilitySlot: (slotId: number) => ["availability-slot", slotId],
} as const;
