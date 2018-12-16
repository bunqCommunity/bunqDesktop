import React from "react";
import PropTypes from "prop-types";

import FileUpload from "../CustomSVG/FileUpload";

const contentSize = 320;

const styles = {
    dropZone: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        // border styling
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5
    },
    fileInput: {
        display: "none"
    },
    fileUploadIcon: {
        width: "100%",
        height: "100%"
    },
    imagePreview: {
        width: "auto",
        maxWidth: contentSize,
        height: "auto",
        maxHeight: contentSize
    }
};

const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

class FilePicker extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            imagePreviewUrl: false
        };

        this.fileInput = React.createRef();
    }

    handleFileDrop = files => {
        if (this.fileInput.current.files.length > 0) {
            const file = this.fileInput.current.files[0];

            if (allowedFileTypes.includes(file.type)) {
                if (!file) return;

                this.props.handleFileDrop(file);

                const reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        imagePreviewUrl: reader.result
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    render() {
        return (
            <div style={styles.dropZone}>
                <label htmlFor="file-input" key="file-input-label">
                    {this.state.imagePreviewUrl ? (
                        <img key="file-picker-image" src={this.state.imagePreviewUrl} style={styles.imagePreview} />
                    ) : (
                        <FileUpload key="file-picker-upload-icon" style={styles.fileUploadIcon} />
                    )}
                </label>
                <input
                    id="file-input"
                    key="file-input"
                    type="file"
                    ref={this.fileInput}
                    style={styles.fileInput}
                    onChange={this.handleFileDrop}
                />
            </div>
        );
    }
}

FilePicker.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default FilePicker;
