import { redirect } from "next/navigation";

/** The first draft is retired. Kept only so old links don't 404. */
export default function ClassicRedirect() {
  redirect("/");
}
