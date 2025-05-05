import { Store } from "@tanstack/react-store";

interface State {
	isScrolled: boolean;
	headerHeight: DOMRect["height"];
}

export const store = new Store<State>({
	isScrolled: false,
	headerHeight: 80,
});
