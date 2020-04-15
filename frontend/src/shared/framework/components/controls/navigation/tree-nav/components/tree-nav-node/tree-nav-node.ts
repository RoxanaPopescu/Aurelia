import { bindable, autoinject, computedFrom, bindingMode } from "aurelia-framework";
import { TreeNode } from "shared/types";
import { TreeNavCustomElement } from "../../tree-nav";

@autoinject
export class TreeNavNodeCustomElement
{
    /**
     * True if the node supports having child nodes, i.e. whether the node is folder-like, otherwise false.
     */
    @computedFrom("model.children.length")
    protected get folderLike(): boolean
    {
        return this.model.children != null;
    }

    /**
     * True if the node is folder-like and has at least one child node, otherwise false.
     */
    @computedFrom("model.children.length")
    protected get expandable(): boolean
    {
        return this.model.children != null && this.model.children.length > 0;
    }

    /**
     * True if the node is active, otherwise false.
     */
    @computedFrom("tree.value")
    protected get active(): boolean
    {
        return this.tree.value === this.model;
    }

    /**
     * The name of the icon to use for the node.
     */
    @computedFrom("active", "tree.selectSubtree", "model.expanded")
    protected get descendentsActive(): boolean
    {
        if (!this.active)
        {
            return false;
        }

        if (!this.folderLike || !this.expandable)
        {
            return true;
        }

        if (this.tree.selectSubtree === true)
        {
            return true;
        }

        if (this.tree.selectSubtree === false)
        {
            return false;
        }

        if (this.model.expanded)
        {
            return true;
        }

        return false;
    }

    /**
     * The name of the icon to use for the node.
     */
    @computedFrom("active", "tree.selectSubtree", "model.expanded")
    protected get iconName(): string
    {
        if (!this.folderLike)
        {
            // File icon, if the node is not folder-like.
            return "md-file";
        }

        if (!this.active)
        {
            // Filled folder icon, when the node is not active.
            return "md-folder";
        }

        if (!this.expandable)
        {
             // Filled folder icon, if the node is not expandable.
             return "md-folder";
        }

        if (this.tree.selectSubtree === true)
        {
            // Filled folder icon, indicating that child nodes are included.
            return "md-folder";
        }

        if (this.tree.selectSubtree === false)
        {
            // Outline folder icon, indicating that child nodes are excluded.
            return "md-folder-outline";
        }

        if (this.model.expanded)
        {
            // Filled folder icon, indicating that child nodes are included.
            return "md-folder";
        }

        // Outline folder icon, indicating that child nodes are excluded.
        return "md-folder-outline";
    }

    /**
     * True if the node is being renamed, otherwise false.
     */
    protected renaming = false;

    /**
     * True if an entity is being dragged over the node, otherwise false.
     */
    protected dragover = false;

    /**
     * The tree to which the node belongs.
     */
    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public tree: TreeNavCustomElement;

    /**
     * The model to use for the node.
     */
    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public model: TreeNode;

    /**
     * Called when the node is clicked.
     * @param toggle True if the click should toggle the expanded state of the node.
     * @param event The mouse event.
     */
    protected onClick(toggle: boolean, event: MouseEvent): void
    {
        if (!event.defaultPrevented && !this.renaming)
        {
            if (this.expandable && (toggle || this.active || !this.model.expanded))
            {
                this.tree.navigate(this.model, true, !this.model.expanded);
            }
            else
            {
                this.tree.navigate(this.model, true);
            }
        }

        event.stopPropagation();
    }

    /**
     * Called when the rename option is clicked.
     * @param event The mouse event.
     */
    protected onNewFolderClick(event: MouseEvent): void
    {
        const newNode = this.tree.createNode!({ parentNode: this.model });
        newNode.attach(this.model);

        if (this.tree.nodeCreated != null)
        {
            this.tree.nodeCreated({ node: newNode });
        }

        event.stopPropagation();
    }

    /**
     * Called when the rename option is clicked.
     * @param event The mouse event.
     */
    protected async onDeleteClick(event: MouseEvent): Promise<void>
    {
        const parentNode = this.model.parent;
        let confirmed = true;

        if (this.tree.deleteNode != null)
        {
            confirmed = await this.tree.deleteNode({ node: this.model });
        }

        if (confirmed)
        {
            this.model.detach();

            if (this.tree.nodeDeleted != null)
            {
                this.tree.nodeDeleted({ node: this.model, parentNode });
            }
        }

        event.stopPropagation();
    }

    /**
     * Called when the rename option is clicked.
     * @param event The mouse event.
     */
    protected onRenameClick(event: MouseEvent): void
    {
        this.renaming = true;

        event.stopPropagation();
    }

    /**
     * Called when the text input used for renaming looses focus.
     * @param event The focus event.
     */
    protected onTextInputBlur(event: FocusEvent): void
    {
        const inputElement = event.target as HTMLInputElement;

        if (inputElement.value && inputElement.value !== this.model.name)
        {
            this.model.rename(inputElement.value);

            if (this.tree.nodeRenamed != null)
            {
                this.tree.nodeRenamed({ node: this.model });
            }
        }

        this.renaming = false;

    }

    /**
     * Called when a key is pressed while the text input used for renaming has focus.
     * Allows the changes to be committed by pressing the `Enter` key, or discarded
     * by pressing the `Escape` key.
     * @param event The keyboard event.
     * @returns True to not prevent default, otherwise false.
     */
    protected onTextInputKeyDown(event: KeyboardEvent): boolean
    {
        // Never block special keys or key combinations.
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        {
            return true;
        }

        if (event.key === "Enter")
        {
            this.renaming = false;

            return false;
        }

        if (event.key === "Escape")
        {
            const inputElement = event.target as HTMLInputElement;

            inputElement.value = this.model.name;

            this.renaming = false;

            return false;
        }

        return true;
    }

    /**
     * Called when an entity is being dragged over the node.
     * @param event The drag event.
     */
    protected onDragOver(event: DragEvent): void
    {
        event.dataTransfer!.dropEffect = "none";

        if (this.tree.dragOver != null)
        {
            this.tree.dragOver({ event, node: this.model });
        }

        this.dragover = event.dataTransfer!.dropEffect !== "none";
    }

    /**
     * Called when an entity that is being dragged leaves the node.
     * @param event The drag event.
     */
    protected onDragLeave(): void
    {
        this.dragover = false;
    }

    /**
     * Called when an entity is dropped on the node.
     * @param event The drag event.
     */
    protected onDrop(event: DragEvent): void
    {
        if (this.tree != null && this.tree.drop != null)
        {
            this.tree.drop({ event, node: this.model });
        }

        this.dragover = false;
    }
}
