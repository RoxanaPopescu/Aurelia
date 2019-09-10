import { Uuid } from "./uuid";
import { Sequential } from "./sequential";
import { AlphaNumeric } from "./random";

// tslint:disable: no-namespace

/**
 * Namespace providing methods for generating RFC4122 compliant UUIDs.
 * Note that the quality of the UUIDs generated depend heavily on the type
 * and quality of the random number generators available on the platform.
 */
export namespace Id
{
    /**
     * Generates a new RFC4122 UUID.
     * @param variant The variant of UUID to generate.
     * Variant 1 is timestamp-based and suitable for situations where uniqueness is the primary concern.
     * Variant 4 is random and suitable for situations where randomness is the primary concern.
     * @returns A string representing the generated UUID.
     */
    export function uuid(variant: 1 | 4): string
    {
        return (variant === 1 ? Uuid.v1() : variant === 4 ? Uuid.v4() : undefined)!;
    }

    /**
     * Generates a new sequential numeric ID.
     * This is suitable for situations where uniqueness is only required within the app session.
     * @returns A number representing the generated ID.
     */
    export function sequential(): number
    {
        return Sequential.next();
    }

    /**
     * Generates a random alpha-numeric ID.
     * @param length The desired length of the ID.
     * @returns A string representing the generated ID.
     */
    export function alphaNumeric(length: number): string
    {
        return AlphaNumeric.next(length);
    }
}
