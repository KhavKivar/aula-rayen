import { NextResponse } from "next/server";

export function proxy() {
  // The root route is the public commercial landing. Authentication remains
  // available through /login and /register and can guard private matchers here.
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
