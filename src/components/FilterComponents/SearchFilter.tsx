import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

import ClearIcon from "@material-ui/icons/Clear";

import { setSearchFilter, clearSearchFilter } from "~actions/filters";
import { AppWindow } from "~app";
import { AppDispatch, ReduxState } from "~store/index";

interface IState {
}

interface IProps {
    t: AppWindow["t"];
    style: CSSProperties;
}

class SearchFilter extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    static defaultProps = {
        style: {}
    };

    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    handleChange = event => {
        this.props.setSearchFilter(event.target.value);
    };

    render() {
        const t = this.props.t;
        return (
            <TextField
                label={t("Filter by keyword")}
                style={this.props.style}
                value={this.props.searchTerm}
                onChange={this.handleChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={this.props.clearSearchFilter}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        );
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        searchTerm: state.search_filter.search_term
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        setSearchFilter: searchTerm => dispatch(setSearchFilter(searchTerm)),
        clearSearchFilter: () => dispatch(clearSearchFilter())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilter);
