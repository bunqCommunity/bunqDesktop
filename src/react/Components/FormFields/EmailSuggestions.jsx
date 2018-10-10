import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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

class EmailSuggestions extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false
        };
    }

    onBlur = event => {
        // delay so click event can react before onBlur
        setTimeout(() => {
            this.setState({ visible: false });
        }, 50);
    };

    onFocus = event => this.setState({ visible: true });

    onSelectItem = email => event => {
        // update the email value
        this.props.onSelectItem(email.email);
    };

    render() {
        const { wrapperStyle = {}, emails = [], onSelectItem, ...otherProps } = this.props;

        let count = 0;

        const filteredEmails = emails.filter(email => {
            // already over limit
            if (count >= 5) return false;

            // don't both if visible is false
            if (!this.state.visible) return false;

            // check if a valid value is set
            if (!this.props.value) return false;

            // input data to lowercase
            const inputValue = this.props.value.toLowerCase().trim();
            const inputName = email.name.toLowerCase().trim();
            const inputEmail = email.email.toLowerCase().trim();

            // no input so no search
            if (!inputValue || inputValue.length === 0) return false;

            // ignore item if it is already a direct match
            if (inputValue === inputEmail) return false;

            const nameMatches = inputName.length > 0 && inputName.includes(inputValue);
            const emailMatches = inputEmail.length > 0 && inputEmail.includes(inputValue);

            // check if either name or email matches the search query
            if (!nameMatches && !emailMatches) return false;

            count++;

            return true;
        });

        return (
            <div style={{ ...styles.container, ...wrapperStyle }}>
                <TextField key="textfield" type="email" onBlur={this.onBlur} onFocus={this.onFocus} {...otherProps} />
                {this.state.visible ? (
                    <Paper key="paper-wrapper" style={styles.suggestionsWrapper} square>
                        {filteredEmails.map((email, index) => (
                            <ListItem key={index} button onClick={this.onSelectItem(email)}>
                                <ListItemText primary={email.email} secondary={email.name} />
                            </ListItem>
                        ))}
                    </Paper>
                ) : null}
            </div>
        );
    }
}

EmailSuggestions.propTypes = {
    // itemSelected: PropTypes.func.isRequired
};

export default EmailSuggestions;
