// The base character to use in slugs.
const baseChars =
[
    ..."a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(","),
    ..."ss,aa,ae,ao,au,av,ay,dz,hv,lj,nj,oi,ou,oo,tz,vy".split(",")
];

/**
 * Creates a slug based on the specified text.
 * @param text The text from which the slug should be created.
 * @param strict True to return undefined if any character fails to slugify nicely, false to just skip such characters.
 * @param localeCode The locale code to use, or undefined to use the document locale.
 * @returns The slugified text, or undefined if strict mode is enabled and a good slug could not be created.
 */
export function slugify(text: string, strict: true, localeCode?: string): string | undefined;

/**
 * Creates a slug based on the specified text.
 * @param text The text from which the slug should be created.
 * @param strict True to return undefined if any character fails to slugify nicely, false to just skip such characters.
 * @param localeCode The locale code to use, or undefined to use the document locale.
 * @returns The slugified text, or undefined if strict mode is enabled and a good slug could not be created.
 */
export function slugify(text: string, strict: false, localeCode?: string): string;

export function slugify(text: string, strict: boolean, localeCode = document.documentElement.lang): string | undefined
{
    const result = text
        .toLocaleLowerCase()
        .replace(/[^\w\s\d-]/g, char =>
        {
            // Replace any character that would be sorted before `0` with the separator character.
            // This should include all punctuation characters, etc.
            if (char.localeCompare("0", localeCode, { sensitivity: "base" }) < 0)
            {
                return "-";
            }

            // For any other character, try to find a matching base character, or default to `?`.
            return baseChars.find(baseChar =>
                char.localeCompare(baseChar, localeCode, { sensitivity: "base" }) === 0) || "?";
        });

    // In strict mode, return an empty string if any character failed to match.
    if (strict && result.includes("?"))
    {
        return undefined;
    }

    // Strip out unmatched characters, replace consecutive non-alpha-numeric
    // characters with a separator, and strip leading and trailing separators.
    return result
        .replace(/\?/g, "")
        .replace(/(_|[^\w\d])+/g, "-")
        .replace(/^-|-$/g, "");
}
