import { format, parseISO } from "date-fns";

export function DateFormatter({ dateString }: { dateString: string }) {
	const date = parseISO(dateString);
	return (
		<time dateTime={dateString}>
			{format(date, "MMM d, yyyy h:mm a 'EDT'")}
		</time>
	);
}
