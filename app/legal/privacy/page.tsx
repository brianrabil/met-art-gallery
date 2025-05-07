import { meta } from "@/lib/meta";
import type { Metadata } from "next";
import Link from "next/link";

const { siteName, contact } = meta;

export const metadata: Metadata = {
	title: `Privacy Policy – ${siteName}`,
	description: `How ${siteName} collects, uses, and protects your data.`,
};

export default function PrivacyPage() {
	return (
		<>
			<h1 className="text-4xl font-bold">Privacy Policy</h1>
			<p className="italic">Effective · 30 April 2025</p>

			<section className="space-y-6">
				{/* 1 */}
				<div>
					<h2 className="text-2xl font-semibold">1. Information We Collect</h2>
					<p>
						<b>Account data:</b> email address.
						<br />
						<b>Payment data:</b> processed by Stripe; we never store card
						numbers.
						<br />
						<b>Uploaded images:</b> processed, then deleted after 24 hours.
						<br />
						<b>Analytics:</b> aggregated event data via Vercel Analytics and
						PostHog.
					</p>
				</div>

				{/* 2 */}
				<div>
					<h2 className="text-2xl font-semibold">2. How We Use Data</h2>
					<p>
						To provide and improve the Service, process payments, prevent fraud,
						and comply with legal obligations.
					</p>
				</div>

				{/* 3 */}
				<div>
					<h2 className="text-2xl font-semibold">3. Sharing & Disclosure</h2>
					<p>
						We share data only with service providers (Stripe, Printful,
						Upstash) under strict Data-Processing Agreements. We do <b>not</b>{" "}
						sell personal data.
					</p>
				</div>

				{/* 4 */}
				<div>
					<h2 className="text-2xl font-semibold">4. International Transfers</h2>
					<p>
						Personal data may be processed outside your country. We rely on
						Standard Contractual Clauses (SCCs) for EU/UK transfers.
					</p>
				</div>

				{/* 5 */}
				<div>
					<h2 className="text-2xl font-semibold">5. Your Rights</h2>
					<p>
						You may request access, correction, deletion, data portability, or
						object to processing. EU/UK users can lodge complaints with their
						local Data Protection Authority.
					</p>
				</div>

				{/* 6 */}
				<div>
					<h2 className="text-2xl font-semibold">6. Retention</h2>
					<p>
						Account data: while your account is active + 90 days.
						<br />
						Log files: 30 days.
						<br />
						Uploaded images: 24 hours.
					</p>
				</div>

				{/* 7 */}
				<div>
					<h2 className="text-2xl font-semibold">7. Cookies</h2>
					<p>
						See our{" "}
						<Link href="/legal/cookies" className="underline">
							Cookie Policy
						</Link>{" "}
						for details on the cookies we use.
					</p>
				</div>

				{/* 8 */}
				<div>
					<h2 className="text-2xl font-semibold">8. Contact</h2>
					<p>
						{contact.email} · {contact.fullAddress}
					</p>
				</div>
			</section>
		</>
	);
}
