import React from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";

import { userLogin } from "../../Actions/user";

const styles = {
    card: {
        marginBottom: 16
    },
    cardContainers: {
        backgroundColor: "#ffffff",
        color: "#000000"
    },
    loginButton: {
        width: "100%",
        marginTop: 8
    },
    clearButton: {
        width: "100%",
        marginTop: 20
    },
    apiInput: {
        width: "100%",
        marginTop: 20
    },
    environmentToggle: {
        marginTop: 10
    }
};

class UserItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    selectAccount = type => {
        return () => {
            this.props.loginUser(type, true);
        };
    };

    render() {
        const { user, userKey } = this.props;
        const imageUUID = user.avatar.image[0].attachment_public_uuid;

        return (
            <Card style={styles.card}>
                <CardHeader
                    style={styles.cardContainers}
                    disableTypography={true}
                    avatar={
                        <Avatar>
                            <LazyAttachmentImage BunqJSClient={this.props.BunqJSClient} imageUUID={imageUUID} />
                        </Avatar>
                    }
                    title={user.display_name}
                />
                <CardContent style={styles.cardContainers}>
                    <Button
                        disabled={this.props.userLoading}
                        onClick={this.selectAccount(userKey)}
                        variant="raised"
                        color={"primary"}
                        style={styles.loginButton}
                    >
                        Login
                    </Button>
                </CardContent>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        loginUser: (type, updated = false) => dispatch(userLogin(BunqJSClient, type, updated))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserItem);
