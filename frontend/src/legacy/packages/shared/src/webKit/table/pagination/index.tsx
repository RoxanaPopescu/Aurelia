import React from "react";
import "./styles.scss";
import DetectMobile from "../../utillity/detectMobile";

export type PaginationDisplayMode = "fixed" | "sticky";

export interface TablePaginationProps {
  pages: number;
  currentPageIndex: number;
  displayMode?: PaginationDisplayMode;
  onPageChange(nextPage: number, previousPage?: number);
  onResultsPerPageChanged?(value: number);
}
export interface TablePaginationState {
  currentPageIndex: number;
  previousPageIndex: number;
  pagesArray: number[];
  resultsPerPage: number;
  dropdownOpen: boolean;
}

export class TablePaginationComponent extends React.Component<
  TablePaginationProps,
  TablePaginationState
> {
  pagesToShow: number;
  constructor(props: TablePaginationProps) {
    super(props);

    if (DetectMobile.isMobileView) {
      this.pagesToShow = 5;
    } else {
      this.pagesToShow = 10;
    }

    this.state = {
      currentPageIndex: props.currentPageIndex ? props.currentPageIndex : 0,
      previousPageIndex: props.currentPageIndex ? props.currentPageIndex : 0,
      pagesArray: this.getPagesArray(),
      resultsPerPage: 40,
      dropdownOpen: false
    };
  }

  componentWillReceiveProps(nextProps: TablePaginationProps) {
    this.setState({
      currentPageIndex: nextProps.currentPageIndex,
      pagesArray: this.getPagesArray()
    });
  }

  getPagesArray() {
    let array: number[] = [];
    if (this.props.currentPageIndex) {
      if (this.props.currentPageIndex > this.pagesToShow - 1) {
        for (
          let i = this.props.currentPageIndex - this.pagesToShow;
          i <= this.props.currentPageIndex;
          i++
        ) {
          array.push(i);
        }
      } else {
        for (let i = 0; i < this.pagesToShow; i++) {
          array.push(i);
        }
      }
    } else {
      if (this.props.pages > this.pagesToShow) {
        for (let i = 0; i < this.pagesToShow; i++) {
          array.push(i);
        }
      } else {
        for (let i = 0; i < this.props.pages; i++) {
          array.push(i);
        }
      }
    }

    return array;
  }

  changePage(nextIndex: number) {
    // Failsafe
    if (nextIndex < 0) {
      nextIndex = this.props.pages - 1;
    } else if (nextIndex >= this.props.pages) {
      nextIndex = 0;
    }

    let pagesArray: number[] = [];
    if (nextIndex === 0) {
      for (let i = 0; i <= this.pagesToShow; i++) {
        pagesArray.push(i);
      }
    } else if (nextIndex === this.props.pages - 1) {
      let i = this.props.pages - 1 - this.pagesToShow;
      for (i; i <= this.props.pages - 1; i++) {
        pagesArray.push(i);
      }
    } else {
      pagesArray = this.state.pagesArray;
      if (this.state.currentPageIndex + 1 === nextIndex) {
        if (
          this.state.currentPageIndex ===
          this.state.pagesArray[this.state.pagesArray.length - 1]
        ) {
          pagesArray.shift();
          pagesArray.push(nextIndex);
        }
      } else if (this.state.currentPageIndex - 1 === nextIndex) {
        if (this.state.currentPageIndex === this.state.pagesArray[0]) {
          pagesArray.splice(-1, 1);
          pagesArray.unshift(nextIndex);
        }
      }
    }

    if (this.props.onPageChange) {
      this.props.onPageChange(nextIndex, this.state.currentPageIndex);
    }
    this.setState({
      previousPageIndex: this.state.currentPageIndex,
      currentPageIndex: nextIndex,
      pagesArray: pagesArray
    });
  }

  renderPage(index: number, inactive?: boolean) {
    let className: string = "c-pagination-pages-page";
    if (index === this.state.currentPageIndex) {
      className += " active";
    }
    if (inactive) {
      className += " inactive";
    }
    return (
      <div
        className={className}
        key={"page-" + index}
        onClick={() => !inactive && this.changePage(index)}
      >
        <span>{index + 1}</span>
      </div>
    );
  }

  private renderResultsPerPage() {
    let array: JSX.Element[] = [];

    [20, 30, 40, 50].forEach(value => {
      array.push(
        <div
          key={`${value}-resultsPerPage`}
          className="c-pagination-dropdown-value"
          onClick={() => {
            this.setState({ resultsPerPage: value });
            if (this.props.onResultsPerPageChanged) {
              this.props.onResultsPerPageChanged(value);
            }
          }}
        >
          {value}
        </div>
      );
    });

    return (
      <div className="c-pagination-amountOfResults" key="resultsPerPage">
        Antal pr. side
        <div
          className={`c-pagination-resultsPerPage${
            this.state.dropdownOpen ? " open" : ""
          }`}
          onClick={() =>
            this.setState({ dropdownOpen: !this.state.dropdownOpen })
          }
        >
          {this.state.resultsPerPage}
          {this.props.onResultsPerPageChanged && (
            <div className="c-pagination-dropdown">{array}</div>
          )}
        </div>
      </div>
    );
  }

  renderPagination() {
    let array: JSX.Element[] = [];

    array.push(this.renderResultsPerPage());

    array.push(
      <div
        key="previousPage"
        className={
          this.state.currentPageIndex === 0
            ? "c-pagination-navigation previousPage inactive"
            : "c-pagination-navigation previousPage"
        }
        onClick={() =>
          this.state.currentPageIndex !== 0 &&
          this.changePage(this.state.currentPageIndex - 1)
        }
      >
        <span />
      </div>
    );

    array.push(
      <div
        key="nextPage"
        className={
          this.state.currentPageIndex === this.props.pages - 1 ||
          this.props.pages === 0
            ? "c-pagination-navigation nextPage inactive"
            : "c-pagination-navigation nextPage"
        }
        onClick={() =>
          this.state.currentPageIndex !== this.props.pages - 1 &&
          this.props.pages !== 0 &&
          this.changePage(this.state.currentPageIndex + 1)
        }
      >
        <span />
      </div>
    );

    return array;
  }

  render() {
    let classNames = "c-pagination font-label-base";
    if (this.props.displayMode && this.props.displayMode === "sticky") {
      classNames += " c-pagination-sticky";
    } else {
      classNames += " c-pagination-fixed";
    }

    return (
      <div className={classNames}>
        <div className="c-pagination-content">{this.renderPagination()}</div>
      </div>
    );
  }
}
