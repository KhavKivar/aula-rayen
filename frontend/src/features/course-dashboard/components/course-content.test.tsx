import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import type { CourseContent as CourseContentData } from "@/features/course-dashboard/types/course";

type TestLinkProps = ComponentProps<"a"> & {
  to: string;
};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: TestLinkProps) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/course-dashboard/api/get-course", () => ({
  getCourse: vi.fn(),
}));

import { getCourse } from "@/features/course-dashboard/api/get-course";
import { CourseContent } from "@/features/course-dashboard/components/course-content";
import { render } from "@/testing/test-utils";

const course: CourseContentData = {
  id: 1,
  title: "Curso adquirido",
  description: "Contenido disponible para el usuario.",
  createdAt: "2026-08-17T00:00:00.000Z",
  duration: "2 horas",
  price: 19990,
  videoLink: "https://example.com/course.mp4",
  fileLink: "https://example.com/material.pdf",
};

describe("CourseContent", () => {
  it("shows the video and material of an acquired course", async () => {
    vi.mocked(getCourse).mockResolvedValue(course);

    render(<CourseContent courseId={course.id} />);

    expect(
      await screen.findByRole("heading", { name: course.title }),
    ).toBeVisible();
    expect(screen.getByText("Video del curso")).toBeVisible();
    expect(screen.getByText("Material del curso")).toBeVisible();
    expect(screen.getByLabelText("Video del curso")).toHaveAttribute(
      "src",
      course.videoLink,
    );
    expect(screen.getByRole("link", { name: "Abrir material" })).toHaveAttribute(
      "href",
      course.fileLink,
    );
  });
});
