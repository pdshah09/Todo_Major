import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Dashboard from "./dashboard";

export default async function Page() {
	// const session = await auth.api.getSession({
	// 	headers: await headers(),
	// });

	// if (!session) {
	// 	redirect("/signin");
	// }

	// return <Dashboard initSession={session} />;
	return <Dashboard/>;
}
