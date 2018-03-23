import * as React from "react";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import RuleCollection, {
    EventObject,
    EventObjectResult
} from "../../Types/RuleCollection";

import CheckIcon from "material-ui-icons/Check";
import CrossIcon from "material-ui-icons/Cancel";

const styles = {
    toggleVisibilityButton: {
        width: "100%",
        marginBottom: 16
    },
    paper: {
        textAlign: "center"
    }
};

class RuleCollectionPreview extends React.Component<any, any> {
    state = {
        visible: false
    };

    mergeEvents = (): EventObject[] => {
        const events = [
            ...this.props.payments.map(item => {
                return {
                    type: "Payment",
                    item: item.Payment
                };
            }),
            ...this.props.bunqMeTabs.map(item => {
                return {
                    type: "BunqMeTab",
                    item: item.BunqMeTab
                };
            }),
            ...this.props.requestInquiries.map(item => {
                return {
                    type: "RequestInquiry",
                    item: item.RequestInquiry
                };
            }),
            ...this.props.requestResponses.map(item => {
                return {
                    type: "RequestResponse",
                    item: item.RequestResponse
                };
            }),
            ...this.props.masterCardActions.map(item => {
                return {
                    type: "MasterCardAction",
                    item: item.MasterCardAction
                };
            })
        ];

        const sortedEvents = events.sort((a: EventObject, b: EventObject) => {
            const date1 = new Date(b.item.created);
            const date2 = new Date(a.item.created);
            return date1.getTime() - date2.getTime();
        });

        return sortedEvents;
    };

    render() {
        const toggleDisplay = (
            <Button
                variant="raised"
                style={styles.toggleVisibilityButton}
                onClick={event =>
                    this.setState({ visible: !this.state.visible })}
            >
                {this.state.visible ? "Hide preview" : "Show preview"}
            </Button>
        );

        let previewContent = null;
        if (this.state.visible) {
            const ruleCollection: RuleCollection | null = this.props
                .ruleCollection;
            if (ruleCollection === null) return null;

            const events: EventObject[] = this.mergeEvents();
            const filteredEvents: EventObjectResult[] = ruleCollection.filterItems(
                events
            );

            const items: any[] = filteredEvents.map(
                (event: EventObjectResult, index: any) => {
                    return (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`Matches: ${event.matches
                                    ? "yes"
                                    : "no"}`}
                                secondary={`Type: ${event.type}`}
                            />
                            <ListItemIcon>
                                {event.matches ? <CheckIcon /> : <CrossIcon />}
                            </ListItemIcon>
                        </ListItem>
                    );
                }
            );

            previewContent = (
                <Paper style={styles.paper}>
                    <List>{items}</List>
                </Paper>
            );
        }

        return (
            <React.Fragment>
                {toggleDisplay}

                {previewContent}
            </React.Fragment>
        );
    }
}

export default RuleCollectionPreview;
