import { meta } from "@/lib/meta";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `Cookie Policy – ${meta.siteName}`,
	description: "How and why we use cookies.",
};

export default function CookiesPage() {
	return (
		<>
			<h1 className="text-4xl font-bold">Cookie Policy</h1>
			<p className="italic">Last revised · 30 April 2025</p>

			<section className="space-y-6">
				{/* 1 */}
				<div>
					<h2 className="text-2xl font-semibold">1. What Are Cookies?</h2>
					<p>
						Cookies are small text files stored on your device to remember
						preferences or enable core site functions.
					</p>
				</div>

				{/* 2 */}
				<div>
					<h2 className="text-2xl font-semibold">2. Cookies We Use</h2>
					<p>
						<b>Essential:</b> session ID, CSRF tokens.
						<br />
						<b>Analytics:</b> Vercel Analytics, PostHog (anonymised).
						<br />
						<b>Marketing:</b> none at launch.
					</p>
				</div>

				{/* 3 */}
				<div>
					<h2 className="text-2xl font-semibold">3. Managing Cookies</h2>
					<p>
						Most browsers let you delete or block cookies. Disabling essential
						cookies will prevent login and core functionality.
					</p>
				</div>
			</section>
		</>
	);
}
