import { meta } from "@/lib/meta";
import type { Metadata } from "next";

const { siteName, contact } = meta;

export const metadata: Metadata = {
	title: `Terms of Service – ${siteName}`,
	description: `Legal terms for using ${siteName}.`,
};

export default function TermsPage() {
	return (
		<>
			<h1 className="text-4xl font-bold">Terms of Service</h1>
			<p className="italic">Last updated · 30 April 2025</p>

			<section className="space-y-6">
				{/* 1 */}
				<div>
					<h2 className="text-2xl font-semibold">1. Acceptance</h2>
					<p>
						By accessing {siteName} (“Service”) you agree to these Terms and to
						our{" "}
						<a href="/privacy" className="underline">
							Privacy Policy
						</a>
						. If you do not accept, do not use the Service.
					</p>
				</div>

				{/* 2 */}
				<div>
					<h2 className="text-2xl font-semibold">2. Eligibility</h2>
					<p>
						You must be at least 13 years old and legally capable of entering a
						binding contract in your jurisdiction.
					</p>
				</div>

				{/* 3 */}
				<div>
					<h2 className="text-2xl font-semibold">
						3. License & Intellectual Property
					</h2>
					<p>
						All software, text, and graphics are owned by {siteName} or its
						licensors. Metropolitan Museum of Art images displayed are
						public-domain (CC0).
						{siteName} is <b>not</b> affiliated with The Met.
					</p>
				</div>

				{/* 4 */}
				<div>
					<h2 className="text-2xl font-semibold">4. User Content</h2>
					<p>
						You grant {siteName} a non-exclusive, worldwide licence to process,
						store, and display uploaded room photos solely to provide the
						Service. Original files are automatically deleted after 24 hours.
					</p>
				</div>

				{/* 5 */}
				<div>
					<h2 className="text-2xl font-semibold">5. Payments & Fulfilment</h2>
					<p>
						Print orders are fulfilled by Printful, Inc. Prices are shown in
						USD. Stripe processes payments on our behalf. Shipping, taxes, and
						duties are your responsibility.
					</p>
				</div>

				{/* 6 */}
				<div>
					<h2 className="text-2xl font-semibold">6. Refund Policy</h2>
					<p>
						Damaged or defective prints qualify for a free reprint or a full
						refund within 30 days of receipt (see{" "}
						<a href="/refunds" className="underline">
							Refunds & Returns
						</a>
						).
					</p>
				</div>

				{/* 7 */}
				<div>
					<h2 className="text-2xl font-semibold">7. Disclaimers</h2>
					<p>
						The Service is provided “as is.” {siteName} disclaims all
						warranties, express or implied, including merchantability and
						fitness for a particular purpose.
					</p>
				</div>

				{/* 8 */}
				<div>
					<h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
					<p>
						To the maximum extent permitted by law, {siteName} will not be
						liable for indirect, incidental, or consequential damages, or for
						any amount exceeding the fees you paid in the preceding 12 months.
					</p>
				</div>

				{/* 9 */}
				<div>
					<h2 className="text-2xl font-semibold">9. Governing Law</h2>
					<p>
						These Terms are governed by the laws of the State of Texas, USA,
						without regard to conflict-of-law principles.
					</p>
				</div>

				{/* 10 */}
				<div>
					<h2 className="text-2xl font-semibold">10. Changes</h2>
					<p>
						We may revise these Terms at any time. Continued use of the Service
						after changes constitutes acceptance of the revised Terms.
					</p>
				</div>
			</section>

			<p className="pt-4">
				Questions? Email{" "}
				<a href={`mailto:${contact.legalEmail}`} className="underline">
					{contact.legalEmail}
				</a>
				.
			</p>
		</>
	);
}
