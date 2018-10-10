import React from "react";
import { connect } from "react-redux";
import InteractiveMap from "react-map-gl/src/components/interactive-map";
import Marker from "react-map-gl/src/components/marker";

import MarkerIcon from "@material-ui/icons/LocationOn";

// import the mapbox css sheet
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
    "pk.eyJ1IjoiYnVucWNvbW11bml0eSIsImEiOiJjam1uZnExcjgwcjEzM3ZwazhuaDBmNWw1In0.iKFjMHlXQ8PkvTagdi74-w";

const styles = {
    map: {
        width: "100%",
        height: "100%"
    }
};

class GeoLocationMap extends React.Component {
    state = {
        show: false,
        mapStyle: "mapbox://styles/bunqcommunity/cjmngc001153m2ss143lhxlzw",
        mapStyleMode: "none",
        viewport: {
            zoom: 12,
            pitch: 45,
            height: 600,
            width: 600
        }
    };

    onResizeHandler = null;

    componentDidMount() {
        this.setState({
            show: true,
            viewport: {
                ...this.state.viewport,
                ...this.props.geoLocation
            }
        });
    }
    componentDidUpdate() {
        this.updateMap();
    }

    componentWillUnmount() {
        // ensure the on resize event is gone
        if (this.onResizeHandler !== null) {
            window.removeEventListener("resize", this.onResizeHandler);
        }
    }

    onResize = () => {
        const containerRef = this.props.containerRef.current;
        const containerWidth = containerRef.clientWidth;
        const containerHeight = containerRef.clientHeight;

        this.setState({
            viewport: {
                ...this.state.viewport,
                width: containerWidth,
                height: containerHeight
            }
        });
    };

    updateMap = () => {
        const viewport = { ...this.state.viewport };

        // check if map style should change
        if (this.props.theme !== this.state.mapStyleMode) {
            if (this.props.theme === "DefaultTheme") {
                // light theme
                this.setState({
                    mapStyle: "mapbox://styles/bunqcommunity/cjmngc001153m2ss143lhxlzw",
                    mapStyleMode: this.props.theme
                });
            } else {
                // dark theme
                this.setState({
                    mapStyle: "mapbox://styles/bunqcommunity/cjmnlb1gjcg012slt1urnvlpo",
                    mapStyleMode: this.props.theme
                });
            }
        }

        // get container width and height
        let containerWidth = viewport.width;
        let containerHeight = viewport.height;
        if (this.props.containerRef && this.props.containerRef.current) {
            let containerRef = this.props.containerRef.current;
            containerWidth = containerRef.clientWidth;
            containerHeight = containerRef.clientHeight;

            // check if a onresize handler is set yet
            if (this.onResizeHandler === null) {
                this.onResizeHandler = window.addEventListener("resize", this.onResize);
            }

            if (viewport.width !== containerWidth || viewport.height !== containerHeight) {
                this.setState({
                    show: true,
                    viewport: {
                        ...viewport,
                        width: containerWidth,
                        height: containerHeight
                    }
                });
            }
        }
    };

    render() {
        const { show, viewport, mapStyle } = this.state;
        const { t, geoLocation } = this.props;

        if (!show) return null;

        return (
            <InteractiveMap
                {...viewport}
                style={styles.map}
                mapStyle={mapStyle}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                onViewportChange={newViewport => this.setState({ viewport: { ...viewport, ...newViewport } })}
            >
                <Marker latitude={geoLocation.latitude} longitude={geoLocation.longitude}>
                    <MarkerIcon
                        style={{
                            color: this.props.theme === "DefaultTheme" ? "#0029ff" : "white"
                        }}
                    />
                </Marker>
            </InteractiveMap>
        );
    }
}

const mapStateToProps = state => {
    return {
        theme: state.options.theme
    };
};

export default connect(mapStateToProps)(GeoLocationMap);
