import React from "react";
import "./styles.scss";
import { TablePaginationComponent, PaginationDisplayMode } from "./pagination";
import Localization from "../../localization";
import { SortingDirection } from "shared/src/model/general/sorting";
import { Link } from "react-router-dom";
import LoadingOverlay from "../loading/overlay";
import { GUID } from "..";

export interface Header {
  content: string | JSX.Element;
  key: string;
}

export type Row = string | JSX.Element | undefined;

export interface TableProps {
  // tslint:disable-next-line:no-any
  data: { headers: Header[]; rows: Row[][] };
  generateURL?(index: number): string | undefined;
  accordionRows?(rowIndex?: number): JSX.Element;
  totalRowsText?: string;
  highlightedRowIndexes?: number[];
  disabledRowIndexes?: number[];
  canSelectRow?: boolean | ((index: number) => boolean);
  newVersion?: boolean;
  loading: boolean;
  pagination?: {
    pages: number;
    currentPageIndex: number;
    resultsPerPage: number;
    onPageChange(nextPage: number, previousPage?: number);
    displayMode?: PaginationDisplayMode;
  };
  sorting?: {
    current: { key: string; direction: SortingDirection };
    onChange(key: string, direction: SortingDirection);
  };
  gridTemplateColumns?: string;
}

export interface TableState {
  // tslint:disable-next-line:no-any
  sorting?: { key: any; direction: SortingDirection };
  hoveredRowIndex?: number;
  hoveredColumnRow?: number;
  accordionContent?: JSX.Element;
}

export class TableComponent extends React.Component<TableProps, TableState> {
  static defaultProps = {
    loading: false,
    data: { headers: [], rows: [] }
  };

  constructor(props: TableProps) {
    super(props);
    this.state = { sorting: props.sorting ? props.sorting.current : undefined };
  }

  // tslint:disable-next-line:no-any
  renderTableHeader(headers: Header[]) {
    let array: JSX.Element[] = [];

    headers.map((header, index) => {
      let classNames: string = "c-gridTable-header font-heading";

      if (
        this.state.sorting &&
        this.state.sorting.direction &&
        this.state.sorting.key === header.key
      ) {
        classNames += " " + this.state.sorting.direction;
      }

      if (this.props.sorting) {
        classNames += " c-gridTable-headerSorting";
      }

      if (
        this.state.hoveredColumnRow !== undefined &&
        this.state.hoveredColumnRow === index
      ) {
        classNames += " c-gridTable-focusColumn";
      }

      array.push(
        <div
          className={classNames}
          onClick={() => this.toggleSorting(header)}
          key={header.content + header.key}
          onMouseEnter={() => this.setState({ hoveredColumnRow: index })}
          onMouseLeave={() => this.setState({ hoveredColumnRow: undefined })}
        >
          {header.content}
          {this.props.sorting && <span className="c-gridTable-header-arrows" />}
        </div>
      );
    });

    return <div className="c-gridTable-row">{array}</div>;
  }

  // tslint:disable-next-line:no-any
  toggleSorting(header: Header) {
    if (!this.props.sorting) {
      return;
    }

    let direction: SortingDirection;

    if (
      this.props.data === undefined ||
      this.props.data.rows === undefined ||
      this.props.data.rows.length <= 0 ||
      this.props.sorting === undefined
    ) {
      return;
    }

    if (this.state.sorting) {
      if (this.state.sorting.key !== header.key) {
        direction = "Descending";
      } else {
        if (this.state.sorting.direction === "Ascending") {
          direction = "Descending";
        } else {
          direction = "Ascending";
        }
      }
    } else {
      direction = "Ascending";
    }

    this.setState({
      sorting: {
        key: header.key,
        direction: direction
      }
    });

    this.props.sorting.onChange(header.key, direction);

    if (this.props.pagination) {
      const currentPageIndex = this.props.pagination.currentPageIndex;
      this.props.pagination.currentPageIndex = 0;
      this.props.pagination.onPageChange(0, currentPageIndex);
    }
  }

  renderTableData(rows?: Row[][]) {
    let rowsArray: JSX.Element[] = [];
    if (rows) {
      if (this.props.data.rows.length === 0 && this.props.loading) {
        for (var i = 0; i < 10; i++) {
          this.props.data.headers.map((header, index) => {
            if (index === 0) {
              rowsArray.push(
                <div
                  key={`skeleton-row_${i}-column_${index}`}
                  className="c-gridTable-content c-gridTable-skeleton"
                />
              );
            } else if (index === this.props.data.headers.length - 1) {
              rowsArray.push(
                <div
                  key={`skeleton-row_${i}-column_${index}`}
                  className="c-gridTable-content c-gridTable-skeleton"
                />
              );
            } else {
              rowsArray.push(
                <div
                  key={`skeleton-row_${i}-column_${index}`}
                  className="c-gridTable-content c-gridTable-skeleton"
                />
              );
            }
          });
        }
      } else {
        rows.map((row, index) => {
          let rowArray: JSX.Element[] = [];
          row.map((column, columnIndex) => {
            let columnElement: JSX.Element | undefined;

            if (!(typeof column === "string")) {
              columnElement = column;
              column = "";
            }

            // Get class names related
            let classNames = " c-gridTable-content";

            if (
              this.state.hoveredColumnRow !== undefined &&
              this.state.hoveredColumnRow === columnIndex
            ) {
              classNames += " c-gridTable-focusColumn";
            }

            if (
              this.props.canSelectRow == null ||
              (this.props.canSelectRow instanceof Function
                ? this.props.canSelectRow(index)
                : this.props.canSelectRow)
            ) {
              if (index === this.state.hoveredRowIndex) {
                classNames += " selectable";
              }
            }

            let url: string | undefined;
            if (this.props.generateURL) {
              url = this.props.generateURL(index);
            }

            let rowKey = row
              // tslint:disable-next-line: no-any
              .map((c: any) => (c && c.key ? c.key : c))
              .toString();

            let key =
              (rowKey && rowKey.length > 2 ? rowKey : GUID.generate()) +
              column +
              this.props.data!.headers[columnIndex].key;

            if (url) {
              rowArray.push(
                <Link
                  key={key}
                  to={url}
                  className={classNames}
                  onMouseEnter={() => this.setState({ hoveredRowIndex: index })}
                  onMouseLeave={() =>
                    this.setState({ hoveredRowIndex: undefined })
                  }
                  title={column}
                  style={{
                    borderLeftWidth: columnIndex === 0 ? "1px" : undefined,
                    borderRightWidth:
                      columnIndex === row.length - 1 ? "1px" : undefined
                  }}
                >
                  {column ? column : columnElement ? columnElement : "--"}
                </Link>
              );
            } else {
              rowArray.push(
                <div
                  key={key}
                  className={classNames}
                  onMouseEnter={() => this.setState({ hoveredRowIndex: index })}
                  onMouseLeave={() =>
                    this.setState({ hoveredRowIndex: undefined })
                  }
                  title={column}
                  style={{
                    borderLeftWidth: columnIndex === 0 ? "1px" : undefined,
                    borderRightWidth:
                      columnIndex === row.length - 1 ? "1px" : undefined
                  }}
                >
                  {column ? column : columnElement ? columnElement : "--"}
                  {this.props.accordionRows &&
                    columnIndex === row.length - 1 && (
                      <div
                        onClick={() => {
                          var content: JSX.Element | undefined = undefined;
                          if (!this.state.accordionContent) {
                            content = this.props.accordionRows!(index);
                          } else {
                            this.props.accordionRows!(undefined);
                          }
                          this.setState({ accordionContent: content });
                        }}
                        className="c-gridTable-accordionToggle"
                      >
                        <div />
                      </div>
                    )}
                </div>
              );
            }
          });

          let rowClassName = "c-gridTable-row";
          if (
            this.props.highlightedRowIndexes &&
            this.props.highlightedRowIndexes.filter(hi => hi === index).length >
              0
          ) {
            rowClassName += " highlighted";
          }
          if (
            this.props.disabledRowIndexes &&
            this.props.disabledRowIndexes.filter(ai => ai === index).length > 0
          ) {
            rowClassName += " disabledRow";
          }
          if (this.state.accordionContent) {
            rowClassName += " accordionOpen";
          }

          rowsArray.push(
            <div key={row.toString() + index} className={rowClassName}>
              {rowArray}
              {this.renderAccordionContent()}
            </div>
          );
        });
      }
    }

    return rowsArray;
  }

  renderAccordionContent() {
    if (this.state.accordionContent) {
      return (
        <div className="c-gridTable-accordionContent">
          {this.state.accordionContent}
        </div>
      );
    } else {
      return <></>;
    }
  }

  renderNoResults() {
    return (
      <div className="c-gridTable-noResults">
        <h4 className="font-larger c-gridTable-noResults-headline">
          {Localization.sharedValue("Error_NoResults")}
        </h4>
      </div>
    );
  }

  renderSortingLoadingOverlay() {
    let className: string = "c-gridTable-sortingLoadingOverlay";
    if (this.props.loading) {
      className += " active";
    }

    return (
      <div className={className}>
        <h4 className="font-larger c-gridTable-sortingLoadingOverlay-indicator">
          <LoadingOverlay />
        </h4>
        {/* <h4 className="font-larger c-gridTable-sortingLoadingOverlay-headline">
          {Localization.sharedValue("General_Loading")}
        </h4> */}
      </div>
    );
  }

  render() {
    let tableClassnames = "c-gridTable";
    if (this.props.loading) {
      tableClassnames += " c-gridTable-loading";
    }
    if (this.props.data.rows.length === 0 && !this.props.loading) {
      tableClassnames += " c-gridTable-blank";
    }
    if (this.props.pagination) {
      tableClassnames += " c-gridTable-pagination";
    }

    return (
      <div
        className={`gridTable-container${
          this.props.newVersion
            ? " gridTable-container-new"
            : " gridTable-container-old"
        }`}
      >
        <div
          key="gridTable"
          className={tableClassnames}
          style={{
            gridTemplateColumns:
              this.props.gridTemplateColumns ||
              "repeat(" + this.props.data.headers.length + ", auto)"
          }}
        >
          {this.renderTableHeader(this.props.data.headers)}
          {this.renderTableData(this.props.data.rows)}
        </div>
        {this.props.data.rows.length === 0 &&
          !this.props.loading &&
          this.renderNoResults()}
        {this.props.pagination &&
          this.props.data.rows.length > 0 && (
            <TablePaginationComponent
              pages={this.props.pagination.pages}
              currentPageIndex={this.props.pagination.currentPageIndex}
              displayMode={this.props.pagination.displayMode}
              onPageChange={(nextPage, previousPage) =>
                this.props.pagination &&
                this.props.pagination.onPageChange(nextPage, previousPage)
              }
              onResultsPerPageChanged={() => {
                /* */
              }}
            />
          )}
        {this.renderSortingLoadingOverlay()}
      </div>
    );
  }
}
