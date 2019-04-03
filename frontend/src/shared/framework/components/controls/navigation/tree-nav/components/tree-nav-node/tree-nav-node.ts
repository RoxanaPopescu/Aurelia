import { bindable, autoinject, computedFrom, bindingMode } from "aurelia-framework";
import { TreeNavCustomElement, ITreeNavNode } from "../../tree-nav";

@autoinject
export class TreeNavNodeCustomElement
{
    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public tree: TreeNavCustomElement;

    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public model: ITreeNavNode;

    @computedFrom("node.children.length")
    public get isFolder(): boolean
    {
        return this.model.children != null;
    }

    @computedFrom("node.children.length")
    public get expandable(): boolean
    {
        return this.model.children != null && this.model.children.length > 0;
    }

    @computedFrom("tree.value")
    public get active(): boolean
    {
        return this.tree.value === this.model;
    }

    public onClick(toggle: boolean, event: MouseEvent): void
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
}
