const encoder = new TextEncoder();

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return result === 0;
}

export async function verifyGitHubWebhook(
	payload: string,
	signature: string,
	secret: string,
): Promise<boolean> {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);

	const signatureBuffer = await crypto.subtle.sign(
		"HMAC",
		key,
		encoder.encode(payload),
	);

	const expectedSignature = `sha256=${Array.from(new Uint8Array(signatureBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")}`;

	console.log("Received signature:", signature);
	console.log("Expected signature:", expectedSignature);

	return timingSafeEqual(signature, expectedSignature);
}
