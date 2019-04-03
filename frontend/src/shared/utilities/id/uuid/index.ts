
import * as uuid from "uuid";

/**
 * Namespace providing methods for generating RFC4122 compliant UUIDs.
 * Note that the quality of the UUIDs generated depend heavily on the type
 * and quality of the random number generators available on the platform.
 */
export namespace Uuid
{
    /**
     * Generates a new RFC4122 v1 (timestamp-based) UUID.
     * This is suitable for situations where uniqueness is the primary concern.
     * @returns A string representing the generated UUID.
     */
    export function v1(): string
    {
        return uuid.v1();
    }

    /**
     * Generates a new RFC4122 v4 (random) UUID.
     * This is suitable for situations where randomness is the primary concern.
     * @returns A string representing the generated UUID.
     */
    export function v4(): string
    {
        return uuid.v1();
    }
}
