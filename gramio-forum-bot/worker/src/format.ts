export function link(text: string, url: string): string {
	return `<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>`;
}

export function truncate(text: string, maxLength = 4096): string {
	if (text.length <= maxLength) return text;

	return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export function expandableBlockquote(text: string): string {
	return `<blockquote expandable>${escapeHtml(text)}</blockquote>`;
}
