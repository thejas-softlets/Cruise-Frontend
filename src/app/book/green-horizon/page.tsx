import { redirect } from "next/navigation";

// The visual cabin picker is now part of the single unified booking wizard
// at /book — this route just preselects Green Horizon there so any existing
// links (e.g. the vessel detail page) keep working.
export default function GreenHorizonBookRedirect() {
  redirect("/book?vessel=green-horizon&mode=cabin");
}
