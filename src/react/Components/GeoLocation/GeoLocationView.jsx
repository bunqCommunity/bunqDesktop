import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import GeoLocationMap from "./GeoLocationMap";

const Transition = props => <Slide direction={"up"} {...props} />;

const styles = {
    dialog: {
        marginTop: 50
    },
    content: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
};

class GeoLocationView extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {};

        this.containerRef = React.createRef();
    }

    render() {
        const { t, geoLocation, visible } = this.props;

        return (
            <Dialog fullScreen style={styles.dialog} open={visible} TransitionComponent={Transition}>
                <div style={styles.content} ref={this.containerRef}>
                    <GeoLocationMap t={t} geoLocation={geoLocation} containerRef={this.containerRef} />
                </div>
                <Button
                    onClick={this.props.onClose}
                    variant="contained"
                    style={{
                        position: "fixed",
                        top: 12,
                        left: 12
                    }}
                >
                    Back
                </Button>
            </Dialog>
        );
    }
}

GeoLocationView.defaultProps = {
    visible: false
};

export default GeoLocationView;
