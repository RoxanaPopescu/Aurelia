import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";

@autoinject
export class NavLinksCustomElement
{
    public constructor(router: Router)
    {
        this.router = router;
    }

    public router: Router;
}
