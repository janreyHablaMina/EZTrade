export async function copyToClipboard(value: string) {
  try {
    const clipboard = (
      globalThis as {
        navigator?: { clipboard?: { writeText?: (text: string) => Promise<void> } };
      }
    ).navigator?.clipboard;
    await clipboard?.writeText?.(value);
  } catch {
    // Frontend-only copy feedback
  }
}
