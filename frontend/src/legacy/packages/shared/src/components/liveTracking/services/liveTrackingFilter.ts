import { observable, computed } from "mobx";
import { ProductTypeSlug, ProductType } from "app/model/product";
import { VehicleType } from "shared/src/model/session";
import { RouteCriticalitySlug, RouteStatusSlug, RouteCriticality } from "app/model/route";

const filterProductTypesKey = "live-tracking-filter-products";

/**
 * Represents the filters that determien which routes are shown in live tracking.
 */
export class LiveTrackingFilter {

    constructor() {
      let productTypes = localStorage.getItem(filterProductTypesKey);
      if (productTypes != null) {
        this.products = JSON.parse(productTypes);
      }
    }

    /**
     * The search query apply, or undefined to apply no text filter.
     */
    @observable
    public searchQuery: string | undefined;

    /**
     * The criticality filter to apply.
     */
    @observable
    public criticalities: RouteCriticalitySlug[] = [];

    /**
     * The products filter to apply.
     */
    @observable
    public products: ProductTypeSlug[] = [];

    /**
     * The statues to show
     */
    @observable
    public statuses: RouteStatusSlug[] = [];

    /**
     * The statues to show
     */
    @observable
    public vehicleTypes: string[] = [];

    /**
     * The amount of filters applied
     */
    @computed
    public get enabledCount(): number {
      let count = 0;

      if (this.criticalities.length > 0 && this.criticalities.length != 3) {
        count++;
      }

      if (this.products.length > 0 && this.products.length != 3) {
        count++;
      }

      if (this.statuses.length > 0 && this.statuses.length != 3) {
        count++;
      }

      if (this.vehicleTypes.length > 0 && this.vehicleTypes.length != VehicleType.getAll().length) {
        count++;
      }

      if (this.searchQuery != null) {
        count++;
      }

      return count;
    }

    criticalityEnabled(criticality: RouteCriticalitySlug): boolean {
      if (this.criticalities.length == 3 || this.criticalities.length == 0) {
        return true;
      }

      return this.criticalities.includes(criticality);
    }

    criticalityEnableDisable(criticality: RouteCriticalitySlug) {
      let results = [...this.criticalities];
      if (results.length == 0) {
        results = Object.keys(RouteCriticality.values) as RouteCriticalitySlug[];
      }

      let index = results.indexOf(criticality);
      if (index != -1) {
        results.splice(index, 1);
      } else {
        results.push(criticality);
      }

      this.criticalities = results;
    }

    statusEnabled(status: RouteStatusSlug): boolean {
      if (this.statuses.length == 3 || this.statuses.length == 0) {
        return true;
      }

      return this.statuses.includes(status);
    }

    statusEnableDisable(status: RouteStatusSlug) {
      let results = [...this.statuses];
      if (results.length == 0) {
        results = ["not-started", "not-approved", "in-progress"];
      }

      let index = results.indexOf(status);
      if (index != -1) {
        results.splice(index, 1);
      } else {
        results.push(status);
      }

      this.statuses = results;
    }

    vehicleTypeEnabled(slug: string): boolean {
      if (this.vehicleTypes.length == VehicleType.getAll().length || this.vehicleTypes.length == 0) {
        return true;
      }

      return this.vehicleTypes.includes(slug);
    }

    vehicleTypeEnableDisable(slug: string) {
      let results = [...this.vehicleTypes];
      if (results.length == 0) {
        results = VehicleType.getAll().map(v => v.slug);
      }

      let index = results.indexOf(slug);
      if (index != -1) {
        results.splice(index, 1);
      } else {
        results.push(slug);
      }

      this.vehicleTypes = results;
    }

    productEnabled(product: ProductTypeSlug): boolean {
      if (this.products.length == 3 || this.products.length == 0) {
        return true;
      }

      return this.products.includes(product);
    }

    productEnableDisable(product: ProductTypeSlug) {
      let results = [...this.products];
      if (results.length == 0) {
        results = Object.keys(ProductType.values) as ProductTypeSlug[];
      }

      let index = results.indexOf(product);
      if (index != -1) {
        results.splice(index, 1);
      } else {
        results.push(product);
      }

      this.products = results;
      console.log(this.products);
      localStorage.setItem(filterProductTypesKey, JSON.stringify(results));
    }
  }