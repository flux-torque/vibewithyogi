import { redirect } from "next/navigation";

/** The site now lives at the root. Kept only so old links don't 404. */
export default function Landing2Redirect() {
  redirect("/");
}
