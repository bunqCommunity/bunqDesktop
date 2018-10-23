import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = {};

class SavingsGoalListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { t, savingsGoal } = this.props;
        console.log("savingsGoal");

        return (
            <ListItem>
                <ListItemText primary={savingsGoal.id} />
            </ListItem>
        );
    }
}

export default SavingsGoalListItem;
