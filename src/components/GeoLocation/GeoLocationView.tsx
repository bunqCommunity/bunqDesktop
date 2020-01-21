import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import GeoLocationMap from "./GeoLocationMap";
import TranslateButton from "~components/TranslationHelpers/Button";

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

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class GeoLocationView extends React.PureComponent<IProps> {
    static defaultProps = {
        visible: false
    };

    state: IState;

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
                    <GeoLocationMap t={t} geoLocation={geoLocation} containerRef={this.containerRef}/>
                </div>
                <TranslateButton
                    onClick={this.props.onClose}
                    variant="outlined"
                    style={{
                        position: "fixed",
                        top: 12,
                        left: 12
                    }}
                >
                    Back
                </TranslateButton>
            </Dialog>
        );
    }
}

export default GeoLocationView;
