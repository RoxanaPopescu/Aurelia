import { Container } from "aurelia-framework";
import { ModalService } from "../../services/modal";

/**
 * Represents a change detector, that can be used to determine whether the state of a view has changed,
 * and optionally to ask the user whether any changes should be discarded.
 */
export class ChangeDetector
{
    /**
     * Creates a new instance of the type.
     * @param getStateFunc The function to call to, at any time, get the current state.
     */
    public constructor(getStateFunc: () => any)
    {
        this.getHashFunc = () => this.getHash(getStateFunc());
        this.unchangedHash = this.getHashFunc();
    }

    private getHashFunc: () => string;
    private unchangedHash: string | undefined;

    /**
     * Determines whether the state has changed, compared to when this instance was created or last marked as unchanged,
     * and if changed, presents a modal dialog asking the user whether their unsaved changes should be discarded.
     * @returns A promise that will be resolved with true if unsaved changes should be discarded, otherwise false.
     */
    public async allowDiscard(): Promise<boolean>
    {
        if (this.hasChanges())
        {
            var modalService = Container.instance.get(ModalService);

            return await modalService.open("confirm-discard").promise;
        }

        return true;
    }

    /**
     * Determines whether the state has changed, compared to when this instance was created or last marked as unchanged.
     * @returns True if the state has changed, otherwise false.
     */
    public hasChanges(): boolean
    {
        return this.unchangedHash != this.getHashFunc();
    }

    /**
     * Marks the current state as the unchanged state.
     */
    public markAsUnchanged(): void
    {
        this.unchangedHash = this.getHashFunc();
    }

    /**
     * Marks the state as changed, until explicitly marked as unchanged.
     */
    public markAsChanged(): void
    {
        this.unchangedHash = undefined;
    }

    /**
     * Gets a hash of the specified state, suitable for equality comparison.
     * @param state The state for which to get the hash.
     * @returns A hash representing the state.
     */
    private getHash(state: any): string
    {
        return JSON.stringify(state, (key, value) => key === "etag" ? undefined : value);
    }
}

