import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import GeoLocationView from "./GeoLocationView";

class GeoLocationListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false
        };
    }

    onClick = () => {
        this.setState({
            visible: !this.state.visible
        });
    };
    onClose = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        const { t, geoLocation } = this.props;

        // don't render if no geolocation is set
        if (!geoLocation) return null;

        return (
            <React.Fragment>
                <ListItem button onClick={this.onClick}>
                    <ListItemText primary={t("Geolocation")} secondary={t("Click to view")} />
                </ListItem>
                <GeoLocationView t={t} onClose={this.onClose} visible={this.state.visible} geoLocation={geoLocation} />
            </React.Fragment>
        );
    }
}

export default GeoLocationListItem;
