import { redirect } from "next/navigation";

/** The amber direction is retired. Kept only so old links don't 404. */
export default function Landing1Redirect() {
  redirect("/");
}
