import { bindable, autoinject, computedFrom, bindingMode } from "aurelia-framework";
import { TreeNode } from "shared/types";
import { TreeNavCustomElement } from "../../tree-nav";

@autoinject
export class TreeNavNodeCustomElement
{
    /**
     * True if the node supports having child nodes, i.e. whether the node is folder-like, otherwise false.
     */
    @computedFrom("node.children.length")
    protected get folderLike(): boolean
    {
        return this.model.children != null;
    }

    /**
     * True if the node is folder-like and has at least one child node, otherwise false.
     */
    @computedFrom("node.children.length")
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
        if (!this.active)
        {
            // Filled icon, when the node is not active.
            return "folder";
        }

        if (!this.folderLike || !this.expandable)
        {
             // Filled icon, if the node is not folder-like or expandable.
             return "folder";
        }

        if (this.tree.selectSubtree === true)
        {
            // Filled icon, indicating that child nodes are included.
            return "folder";
        }

        if (this.tree.selectSubtree === false)
        {
            // Outline icon, indicating that child nodes are excluded.
            return "folder_open";
        }

        if (this.model.expanded)
        {
            // Filled icon, indicating that child nodes are included.
            return "folder";
        }

        // Outline icon, indicating that child nodes are excluded.
        return "folder_open";
    }

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
     * @param event The click event.
     */
    protected onClick(toggle: boolean, event: MouseEvent): void
    {
        if (this.expandable && (toggle || this.active || !this.model.expanded))
        {
            this.tree.navigate(this.model, true, !this.model.expanded);
        }
        else
        {
            this.tree.navigate(this.model, true);
        }

        event.stopPropagation();
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
        if (this.tree != null && this.tree.dragOver != null)
        {
            this.tree.drop({ event, node: this.model });
        }

        this.dragover = false;
    }
}
