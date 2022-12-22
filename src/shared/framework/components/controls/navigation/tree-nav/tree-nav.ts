import { bindable, autoinject, bindingMode } from "aurelia-framework";
import { TreeNode } from "shared/types";

/**
 * Represents a tree structure, that the user can navigate within.
 */
@autoinject
export class TreeNavCustomElement
{
    /**
     * The tree of which this is a sub-tree, or undefined if this is the root.
     */
    @bindable
    public tree: TreeNavCustomElement;

    /**
     * The root nodes of the tree.
     */
    @bindable
    public model: TreeNode[];

    /**
     * The selected node, or undefined if no node is selected.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: TreeNode | undefined;

    /**
     * True to allow the user to edit the tree, otherwise false.
     */
    @bindable({ defaultValue: false })
    public editable: boolean;

    /**
     * True to indicate that the selected node includes its subtree,
     * false to indicate that the selected node excludes its subtree,
     * or undefined to indicate that the selected node includes its
     * subtree only when the node is collapsed.
     * The default is undefined.
     */
    @bindable({ defaultValue: undefined })
    public selectSubtree: boolean | undefined;

    /**
     * The name of the settings icon shown when a node is hovered.
     */
    @bindable({ defaultValue: undefined })
    public settingsIcon: string | undefined;

    /**
     * The title of the settings icon shown when a node is hovered.
     */
    @bindable({ defaultValue: undefined })
    public settingsIconTitle: string | undefined;

    /**
     * Called when an element is dropped on a node.
     * @param params The parameters available for binding.
     */
    @bindable
    public drop: undefined | ((params:
    {
        /**
         * The drag event.
         */
        event: DragEvent;

        /**
         * The node on which the event occurred.
         */
        node: TreeNode;

    }) => void);

    /**
     * Called when an element is dragged over a node.
     * @param params The parameters available for binding.
     */
    @bindable
    public dragOver: undefined | ((params:
    {
        /**
         * The drag event.
         */
        event: DragEvent;

        /**
         * The node on which the event occurred.
         */
        node: TreeNode;

    }) => void);

    /**
     * Called when the value changes, or when the expanded state of the value changes.
     * @param params The parameters available for binding.
     */
    @bindable
    public change: undefined | ((params:
    {
        /**
         * The new value.
         */
        newValue: TreeNode | undefined;

        /**
         * The old value.
         */
        oldValue: TreeNode | undefined;

    }) => void);

    /**
     * Called when a new folder-like node should be created.
     * @returns The new node to be added.
     */
    @bindable
    public createNode: undefined | ((params:
    {
        /**
         * The parent node of the node being created.
         */
        parentNode: TreeNode;

    }) => TreeNode);

    /**
     * Called after a new folder-like node was added.
     * @param params The parameters available for binding.
     */
    @bindable
    public nodeCreated: undefined | ((params:
    {
        /**
         * The node that was added.
         */
        node: TreeNode;

    }) => void);

    /**
     * Called after a node was renamed.
     * @param params The parameters available for binding.
     */
    @bindable
    public nodeRenamed: undefined | ((params:
    {
        /**
         * The node that was renamed.
         */
        node: TreeNode;

    }) => void);

    /**
     * Called when a node is being deleted.
     * @param params The parameters available for binding.
     * @returns A promise that will be resolved with true if the operation should continue, otherwise false.
     */
    @bindable
    public deleteNode: undefined | ((params:
    {
        /**
         * The node being deleted.
         */
        node: TreeNode;

    }) => Promise<boolean>);

    /**
     * Called when the settings icon for a node is clicked.
     * @param params The parameters available for binding.
     */
    @bindable
    public nodeSettings: undefined | ((params:
    {
        /**
         * The node whose settings icon was clicked.
         */
        node: TreeNode;

    }) => void);

    /**
     * Called after a node was deleted.
     * @param params The parameters available for binding.
     */
    @bindable
    public nodeDeleted: undefined | ((params:
    {
        /**
         * The node that was deleted.
         */
        node: TreeNode;

        /**
         * The parent node from which the node was detached.
         */
        parentNode: TreeNode;

    }) => void);

    /**
     * Navigates to the specified node.
     * @param newValue The note to navigate to and set as the new value.
     * @param selectNode True to select the node, otherewise false.
     * @param expandNode True to expand the node itself, otherwise false.
     * @param expandPath True to expand every node along the path to the node, otherwise false.
     * @param notify True to call the `change` function if something changed, otherwise false.
     */
    public navigate(newValue: TreeNode | undefined, selectNode?: boolean, expandNode?: boolean, expandPath = true, notify = true): void
    {
        const oldValue = this.value;
        const oldExpanded = this.value != null ? this.value.expanded : undefined;

        if (newValue != null && expandPath)
        {
            newValue.expandPath(expandNode);
        }

        if (selectNode)
        {
            this.value = newValue;
        }

        if (notify)
        {
            this.notifyValueChanged(newValue, oldValue, oldExpanded);
        }
    }

    /**
     * Determines whether the specified node supports having child nodes,
     * i.e. whether the node is folder-like.
     * @param node The node to test.
     * @returns True if the node supports having child nodes, otherwise false.
     */
    protected isFolderLike = (node: TreeNode) =>
    {
        return node.children != null;
    }

    /**
     * Determines whether the specified node does not support having child nodes,
     * i.e. whether the node is file-like.
     * @param node The node to test.
     * @returns True if the node does not support having child nodes, otherwise false.
     */
    protected isFileLike = (node: TreeNode) =>
    {
        return node.children == null;
    }

    /**
     * Called by the framework when the `value` property changes.
     * @param newValue The new value.
     * @param oldValue The old value.
     */
    protected valueChanged(newValue: TreeNode | undefined, oldValue: TreeNode | undefined): void
    {
        if (newValue !== oldValue)
        {
            this.navigate(newValue, true, undefined, true, false);

            const oldExpanded = oldValue != null ? oldValue.expanded : undefined;

            this.notifyValueChanged(newValue, oldValue, oldExpanded);
        }
    }

    /**
     * Calls the `change` callback function if something has changed.
     * @param newValue The new value.
     * @param oldValue The old value.
     * @param oldExpanded The expanded state of the old value.
     */
    private notifyValueChanged(newValue: TreeNode | undefined, oldValue: TreeNode | undefined, oldExpanded: boolean | undefined): void
    {
        if (this.change != null)
        {
            const changed =
                (newValue !== oldValue) ||
                (newValue != null && newValue.expanded !== oldExpanded);

            if (changed)
            {
                this.change({ newValue, oldValue });
            }
        }
    }
}
