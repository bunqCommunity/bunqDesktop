import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

const styles = {
    container: {
        flexGrow: 1,
        position: "relative"
    },
    suggestionsWrapper: {
        position: "absolute",
        zIndex: 10,
        left: 0,
        right: 0
    }
};

class InputSuggestions extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            selectedIndex: 0
        };
    }

    onBlur = event => {
        // delay so click event can react before onBlur
        setTimeout(() => {
            this.setState({ visible: false, selectedIndex: 0 });
        }, 150);
    };
    onFocus = event => this.setState({ visible: true });

    changeIndex = (nextIndex = true, count) => {
        const maxCount = count - 1;
        if (nextIndex === true && this.state.selectedIndex < maxCount) {
            this.setState({
                selectedIndex: this.state.selectedIndex + 1
            });
        } else if (nextIndex === false && this.state.selectedIndex > 0) {
            this.setState({
                selectedIndex: this.state.selectedIndex - 1
            });
        }
    };

    onSelectItem = item => event => {
        this.props.onSelectItem(item.field);
        if (this.props.onChangeName) {
            // on name change is set, update the name field aswell
            this.props.onChangeName(item.name);
        }
    };

    render() {
        const {
            wrapperStyle = {},
            items = [],
            onSelectItem,
            onKeyDown,
            onChangeName,
            onChange,
            InputComponent,
            ...otherProps
        } = this.props;

        let count = 0;

        const filteredItems = items.filter(item => {
            // already over limit
            if (count >= 5) return false;

            // don't both if visible is false
            if (!this.state.visible) return false;

            // check if a valid value is set
            if (!this.props.value) return false;

            // input data to lowercase
            const inputValue = this.props.value.toLowerCase().trim();
            const inputName = item.name.toLowerCase().trim();
            const inputField = item.field.toLowerCase().trim();

            // no input so no search
            if (!inputValue || inputValue.length === 0) return false;

            // ignore item if it is already a direct match
            if (inputValue === inputField) return false;

            const nameMatches = inputName.length > 0 && inputName.includes(inputValue);
            const fieldMatches = inputField.length > 0 && inputField.includes(inputValue);

            // check if either name or field matches the search query
            if (!nameMatches && !fieldMatches) return false;

            count++;

            return true;
        });

        // allow component to be overwritten by custom
        const InputFieldComponent = InputComponent ? InputComponent : TextField;

        return (
            <div style={{ ...styles.container, ...wrapperStyle }}>
                <InputFieldComponent
                    key="textfield"
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    onKeyDown={event => {
                        // call parent onKeyPress if set
                        if (this.props.onKeyDown) this.props.onKeyDown(event);

                        // prevent default for arrow keys and change selected item in list
                        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                            this.changeIndex(event.key === "ArrowDown", count);
                            event.preventDefault();
                        }

                        // select the current item
                        if (event.key === "Enter") {
                            const info = filteredItems[this.state.selectedIndex];
                            // only call event if info is set/visible
                            if (this.state.visible === true && info) {
                                this.onSelectItem(info)(event);
                                event.preventDefault();
                            }
                        }

                        // select the current item
                        if (event.key === "Tab") {
                            const info = filteredItems[this.state.selectedIndex];
                            // only call event if info is set/visible
                            if (this.state.visible === true && info) {
                                this.onSelectItem(info)(event);
                                event.preventDefault();
                            }
                        }
                    }}
                    onChange={event => {
                        // call parent onChange if set
                        if (onChange) onChange(event);

                        // reset selected index if input changed
                        this.setState({ selectedIndex: 0 });
                    }}
                    {...otherProps}
                />
                {this.state.visible ? (
                    <Paper key="paper-wrapper" style={styles.suggestionsWrapper} square>
                        {filteredItems.map((filteredItem, index) => (
                            <ListItem button key={index} onClick={this.onSelectItem(filteredItem)}>
                                {index === this.state.selectedIndex ? (
                                    <ListItemIcon>
                                        <ArrowRightIcon />
                                    </ListItemIcon>
                                ) : null}
                                <ListItemText
                                    inset={index !== this.state.selectedIndex}
                                    primary={filteredItem.field}
                                    secondary={filteredItem.name}
                                />
                            </ListItem>
                        ))}
                    </Paper>
                ) : null}
            </div>
        );
    }
}

InputSuggestions.propTypes = {
    itemSelected: PropTypes.func.isRequired,
    InputComponent: PropTypes.node
};

export default InputSuggestions;
