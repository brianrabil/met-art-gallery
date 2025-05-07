import { meta } from "@/lib/meta";
import type { Metadata } from "next";

const { siteName, contact } = meta;

export const metadata: Metadata = {
	title: `Refunds & Returns – ${siteName}`,
	description: "Our policy for damaged or defective print orders.",
};

export default function RefundsPage() {
	return (
		<>
			<h1 className="text-4xl font-bold">Refunds & Returns</h1>

			<section className="space-y-6">
				{/* 1 */}
				<div>
					<h2 className="text-2xl font-semibold">30-Day Reprint / Refund</h2>
					<p>
						If your print arrives damaged or with a manufacturing defect, email{" "}
						<a href={`mailto:${contact.email}`} className="underline">
							{contact.email}
						</a>{" "}
						with photos within 30 days of delivery. We will reprint or refund at
						no cost.
					</p>
				</div>

				{/* 2 */}
				<div>
					<h2 className="text-2xl font-semibold">Non-Returnable Items</h2>
					<p>
						Custom-sized framed prints are made to order and cannot be returned
						for buyer’s remorse.
					</p>
				</div>

				{/* 3 */}
				<div>
					<h2 className="text-2xl font-semibold">Shipping Issues</h2>
					<p>
						Lost shipments: we follow carrier investigation results before
						issuing replacements.
					</p>
				</div>
			</section>
		</>
	);
}
