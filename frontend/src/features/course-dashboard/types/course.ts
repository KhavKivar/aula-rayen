export type Course = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  duration: string;
  price: number;
  hasAccess: boolean;
};

export type CourseContent = Omit<Course, "hasAccess"> & {
  videoLink: string;
  fileLink: string;
};
