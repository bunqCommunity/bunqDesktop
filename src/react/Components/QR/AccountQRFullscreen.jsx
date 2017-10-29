import React from "react";
import Dialog from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import Slide from "material-ui/transitions/Slide";
import Grid from "material-ui/Grid";
import AccountQRCode from "./AccountQRCode";

const styles = {};

class AccountQRFullscreen extends React.PureComponent {
    state = {
        open: false
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <div>
                <IconButton onClick={this.handleClickOpen} raised>
                    <QRIcon />
                </IconButton>
                <Dialog
                    fullScreen
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                    transition={<Slide direction="up" />}
                >
                    <Grid container justify={"center"} align={"center"}>
                        <Grid item xs={12} sm={8} md={6} lg={4}>
                            <AccountQRCode />
                        </Grid>
                    </Grid>
                </Dialog>
            </div>
        );
    }
}

export default AccountQRFullscreen;
