import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieConsent() {
	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6">
			<div className="pointer-events-auto ml-auto max-w-xl rounded-xl bg-background p-6 shadow-lg ring-1 ring-border">
				<p className="text-sm text-foreground">
					This website uses cookies to supplement a balanced diet and provide a
					much deserved reward to the senses after consuming bland but
					nutritious meals. Accepting our cookies is optional but recommended,
					as they are delicious. See our{" "}
					<Link passHref href="/legal/cookies">
						<Button variant="link">cookie policy</Button>
					</Link>
					.
				</p>
				<div className="mt-4 flex items-center gap-x-5">
					<Button type="button" variant="default">
						Accept all
					</Button>
					<Button type="button" variant="ghost">
						Reject all
					</Button>
				</div>
			</div>
		</div>
	);
}
