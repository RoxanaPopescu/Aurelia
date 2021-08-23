import { WebStorageInstance } from "./web-storage-instance";

/**
 * Represents an abstraction around the Web Storage API.
 */
export class WebStorage
{
    /**
     * An abstraction around the Web Storage API, targeting `local` storage.
     */
    public readonly local = new WebStorageInstance("local");

    /**
     * An abstraction around the Web Storage API, targeting `session` storage.
     */
    public readonly session = new WebStorageInstance("session");
}
