import React from "react";
import { ipcRenderer } from "electron";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import { bunqTransparantLogo } from "../Helpers/Base64Images";
import { formatIban } from "../Helpers/Utils";

import { applicationSetPDFMode } from "../Actions/application";
import { openSnackbar } from "../Actions/snackbar";
import { setTheme } from "../Actions/options";

const styles = {
    bunqLogo: {
        height: 100
    },
    list: {},
    divider: {
        borderBottom: "solid 1px grey"
    }
};

class PDFExportHelper extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            hadDarkTheme: false
        };
    }

    componentDidMount() {
        // set ipc event listener
        ipcRenderer.on("wrote-pdf", this.handleWrotePdf);

        // keep track if a dark theme was set and reset it after the pdf save event
        if (this.props.theme === "DarkTheme") {
            this.setState({
                hadDarkTheme: true
            });

            this.props.setTheme("DefaultTheme");
        }
    }

    componentWillUnmount() {
        // remove ipc listener
        ipcRenderer.removeListener("wrote-pdf", this.handleWrotePdf);
    }

    handleWrotePdf = (event, path) => {
        const pdfText = this.props.t("Stored PDF file at");

        // reset theme if it was set to dark theme
        if (this.state.hadDarkTheme) {
            this.props.setTheme("DarkTheme");
        }

        // display the success message
        this.props.openSnackbar(`${pdfText}: ${path}`);

        // revert pdf save mode
        this.props.applicationSetPDFMode(false);
    };

    render() {
        const {
            t,
            payment,
            formattedPaymentAmount,
            paymentDate,
            paymentDateUpdated = false,
            personalAlias,
            counterPartyAlias
        } = this.props;

        const counterPartyIban = counterPartyAlias.iban;
        const merchantReferenceText = t("Merchant reference");
        const mandateIdentifierText = t("Mandate identifier");
        const creditSchemeIdentifierText = t("Credit scheme identifier");

        return (
            <div>
                <img style={styles.bunqLogo} src={bunqTransparantLogo} />

                <List style={styles.list}>
                    {personalAlias && (
                        <React.Fragment>
                            <ListItem>
                                <ListItemText primary={t("Account holder")} secondary={personalAlias.display_name} />
                            </ListItem>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText
                                    primary={t("Account number")}
                                    secondary={formatIban(personalAlias.iban)}
                                />
                            </ListItem>
                            <Divider style={styles.divider} />
                        </React.Fragment>
                    )}

                    <ListItem>
                        <ListItemText primary={t("Amount")} secondary={formattedPaymentAmount} />
                    </ListItem>
                    <Divider style={styles.divider} />

                    <ListItem>
                        <ListItemText
                            primary={t("Description")}
                            secondary={payment.description ? payment.description : " - "}
                        />
                    </ListItem>
                    <Divider style={styles.divider} />

                    <ListItem>
                        <ListItemText primary={t("Date created")} secondary={paymentDate} />
                    </ListItem>
                    <Divider style={styles.divider} />

                    {paymentDateUpdated &&
                        paymentDate !== paymentDateUpdated && (
                            <React.Fragment>
                                <ListItem>
                                    <ListItemText primary={t("Date updated")} secondary={paymentDateUpdated} />
                                </ListItem>

                                <Divider style={styles.divider} />
                            </React.Fragment>
                        )}

                    <ListItem>
                        <ListItemText primary={t("Counterparty name")} secondary={counterPartyAlias.display_name} />
                    </ListItem>

                    {counterPartyIban && (
                        <React.Fragment>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText
                                    primary={t("Counterparty IBAN")}
                                    secondary={formatIban(counterPartyIban)}
                                />
                            </ListItem>
                        </React.Fragment>
                    )}

                    {payment.merchant_reference && (
                        <React.Fragment>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText primary={merchantReferenceText} secondary={payment.merchant_reference} />
                            </ListItem>
                        </React.Fragment>
                    )}

                    {payment.mandate_identifier && (
                        <React.Fragment>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText primary={mandateIdentifierText} secondary={payment.mandate_identifier} />
                            </ListItem>
                        </React.Fragment>
                    )}

                    {payment.credit_scheme_identifier && (
                        <React.Fragment>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText
                                    primary={creditSchemeIdentifierText}
                                    secondary={payment.credit_scheme_identifier}
                                />
                            </ListItem>
                        </React.Fragment>
                    )}
                </List>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        theme: state.options.theme,

        pdfSaveModeEnabled: state.application.pdf_save_mode_enabled
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        applicationSetPDFMode: enabled => dispatch(applicationSetPDFMode(enabled)),

        setTheme: theme => dispatch(setTheme(theme))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PDFExportHelper);
