import { meta } from "@/lib/meta";
import type { Metadata } from "next";

const { siteName, contact } = meta;

export const metadata: Metadata = {
	title: `DMCA Notice – ${siteName}`,
	description: "How to submit a DMCA takedown notice.",
};

export default function DMCAPage() {
	return (
		<>
			<h1 className="text-4xl font-bold">Copyright & DMCA Policy</h1>

			<section className="space-y-6">
				{/* Notice */}
				<div>
					<h2 className="text-2xl font-semibold">
						Notice of Claimed Infringement
					</h2>
					<p>
						If you believe your copyrighted work was used on our Service without
						permission, send a written notice to our Designated Agent that
						includes:
					</p>
					<ul className="list-disc ml-6 space-y-1">
						<li>Your physical or electronic signature.</li>
						<li>Identification of the copyrighted work.</li>
						<li>The URL of the infringing material.</li>
						<li>Your contact information.</li>
						<li>
							A good-faith statement that use is not authorised by the copyright
							owner.
						</li>
						<li>
							A statement that the information is accurate under penalty of
							perjury.
						</li>
					</ul>
				</div>

				{/* Agent */}
				<div>
					<h2 className="text-2xl font-semibold">Designated Agent</h2>
					<p>
						DMCA Agent – {siteName}
						<br />
						Address: {contact.fullAddress}
						<br />
						Email:{" "}
						<a href={`mailto:${contact.dmcaEmail}`} className="underline">
							{contact.dmcaEmail}
						</a>
					</p>
				</div>
			</section>
		</>
	);
}
