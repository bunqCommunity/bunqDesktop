import React from "react";
import Grid from "@material-ui/core/Grid";
import { HuePicker } from "react-color";

const defaultLeftColor = "#667eea";
const defaultRightColor = "#764ba2";
const defaultColor = `linear-gradient(90deg, ${defaultLeftColor} 0%, ${defaultRightColor} 100%)`;

const styles = {
    huePickerGrid: {
        padding: 8
    },
    previewGrid: {
        padding: 8
    }
};

class GradientColorPicker extends React.Component {
    state = {
        colorLeft: defaultLeftColor,
        colorRight: defaultRightColor
    };

    parseGradient() {
        const regexPattern = /linear-gradient\(90deg,[ ]?(\#[0123456789abcdef]{6}) 0%,[ ]?(\#[0123456789abcdef]{6}) 100%\)/;
        const color = this.props.value || defaultColor;

        const matches = color.match(regexPattern);
        if (matches && matches.length > 0) {
            if (matches[1] !== this.state.colorLeft || matches[2] !== this.state.colorRight) {
                this.setState({
                    colorLeft: matches[1],
                    colorRight: matches[2]
                });
            }
        } else {
            if (this.state.colorLeft !== defaultLeftColor || this.state.colorRight !== defaultRightColor) {
                this.setState({
                    colorLeft: defaultLeftColor,
                    colorRight: defaultRightColor
                });
            }
        }
    }

    componentDidMount() {
        this.parseGradient();
    }
    componentDidUpdate() {
        this.parseGradient();
    }

    onChangeLeft = color => {
        this.props.onChange(`linear-gradient(90deg, ${color.hex} 0%, ${this.state.colorRight} 100%)`);
    };
    onChangeRight = color => {
        this.props.onChange(`linear-gradient(90deg, ${this.state.colorLeft} 0%, ${color.hex} 100%)`);
    };

    render() {
        const background = `linear-gradient(90deg, ${this.state.colorLeft} 0%, ${this.state.colorRight} 100%)`;

        return (
            <Grid container>
                <Grid item xs={12} sm={6} style={styles.huePickerGrid}>
                    <HuePicker width="100%" onChange={this.onChangeLeft} color={this.state.colorLeft} />
                </Grid>
                <Grid item xs={12} sm={6} style={styles.huePickerGrid}>
                    <HuePicker width="100%" onChange={this.onChangeRight} color={this.state.colorRight} />
                </Grid>

                <Grid item xs={12} style={styles.previewGrid}>
                    <div
                        style={{
                            width: "100%",
                            height: 12,
                            borderRadius: 3,
                            background: background
                        }}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default GradientColorPicker;
