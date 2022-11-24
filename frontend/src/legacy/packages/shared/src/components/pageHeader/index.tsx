import React from "react";
import H from "history";
import { observer } from "mobx-react";
import { Icon } from "shared/src/webKit";
import "./styles.scss";

interface Props {
  history?: H.History;

  /**
   * The path to show.
   */
  path: {
    /**
     * The title of the path segment.
     */
    title: string;

    /**
     * The URL to navigate to, when the path segment is clicked.
     */
    href?: string;

    /**
     * Called when the path segment is clicked.
     * @returns True or void to continue, false to, if an `href` is specified, prevent navigation.
     */
    onClick?: () => boolean | void;
  }[];

  /**
   * The tabs to show.
   */
  tabs?: {
    /**
     * The name of the tab.
     */
    name: string;

    /**
     * The title of the tab.
     */
    title: string;

    /**
     * The URL to navigate to, when the tab is clicked.
     */
    href?: string;

    /**
     * True to disable the tab, otherwise false.
     */
    disabled?: boolean;

    /**
     * Called when the tab is clicked.
     * @returns True or void to continue, false to prevent the tab change.
     */
    onClick?: () => boolean | void;
  }[];

  /**
   * The name identifying the active tab, or undefined to activate the first tab.
   */
  tab?: string;

  /**
   * The action elements.
   */
  actionElements?: JSX.Element;

  /**
   * Called when the active tab changes.
   * @param tabName The name of the new active tab.
   * @param tabIndex The index of the new active tab.
   * @returns True or void to continue, false to, if an `href` is specified, prevent navigation.
   */
  onTabChange?: (tabName: string, tabIndex: number) => boolean | void;
}

/**
 * Represents the header of a page, which shows the title and breadcrumbs,
 * along with any tabs and actions available on the page.
 */
@observer
export class PageHeaderComponent extends React.Component<Props> {
  public render() {
    return (
      <div className="pageHeader">
        <div className="pageHeader-top">
          {this.renderPath()}
          {this.props.actionElements && (
            <div className="pageHeader-actionContainer">
              {this.props.actionElements}
            </div>
          )}
        </div>

        <div className="pageHeader-toolbar">
          {this.renderTabs()}
          {this.renderChildren()}
        </div>
      </div>
    );
  }

  private renderPath() {
    return (
      this.props.path &&
      this.props.path.length > 0 && (
        <h1 className="pageHeader-path font-larger line-height-1 user-select-text">
          {this.props.path.map((s, i) => (
            <div key={`${i}|${s.title}`} className="pageHeader-path-segment">
              {i > 0 && <Icon name="ico-arrow-forward-ios" />}
              <div
                onClick={() => {
                  if (s.onClick && s.onClick() === false) {
                    return;
                  }
                  if (s.href) {
                    this.props.history!.push(s.href);
                  }
                }}
              >
                {s.title}
              </div>
            </div>
          ))}
        </h1>
      )
    );
  }

  private renderTabs() {
    return (
      this.props.tabs && (
        <div className={`pageHeader-tabs ${this.props.tabs.length === 0 ? 'hidden' : ''}`}>
          {this.props.tabs.map((t, i) => (
            <div
              key={t.name}
              className={`pageHeader-tabs-tab font-label-base
              ${t.disabled ? "disabled" : ""}
              ${this.isActiveTab(t.name, i) ? "active" : ""}`}
              onClick={() => {
                if (!this.isActiveTab(t.name, i)) {
                  if (t.onClick && t.onClick() === false) {
                    return;
                  }
                  if (
                    this.props.onTabChange &&
                    this.props.onTabChange(t.name, i) === false
                  ) {
                    return;
                  }
                  if (t.href) {
                    this.props.history!.push(t.href);
                  }
                }
              }}
            >
              {t.title}
            </div>
          ))}
          {this.props.tabs.length === 0 &&
            <div
              key="placeholder-tab"
              className={"pageHeader-tabs-tab font-label-base"}
            >
              &nbsp;
            </div>
          }
        </div>
      )
    );
  }

  private renderChildren() {
    return (
      this.props.children && (
        <div className="pageHeader-actions">{this.props.children}</div>
      )
    );
  }

  private isActiveTab(tabName: string, index: number): boolean {
    return this.props.tab ? tabName === this.props.tab : index === 0;
  }
}
