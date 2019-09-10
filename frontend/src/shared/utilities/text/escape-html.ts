/**
 * Escapes the specified text, so it can safely be set as the inner HTML of an element.
 * @param text The text to escape.
 * @returns The escaped text.
 */
export function escapeHtml(text: string): string
{
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(text));

    return div.innerHTML;
}
