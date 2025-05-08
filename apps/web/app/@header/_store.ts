import { Store } from "@tanstack/react-store";

interface State {
	isScrolled: boolean;
	computedHeight: DOMRect["height"];
}

export const headerStore = new Store<State>({
	isScrolled: false,
	computedHeight: 80,
});
