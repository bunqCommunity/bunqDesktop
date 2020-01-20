import React from "react";
import { ipcRenderer } from "electron";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import bunqTransparantLogo from "./Base64BunqLogo";
import { formatIban } from "~functions/Utils";

import { actions as applicationActions } from "~store/application";
import { actions as snackbarActions } from "~store/snackbar";
import { setTheme } from "~actions/options";

const styles = {
    bunqLogo: {
        height: 100
    },
    list: {},
    divider: {
        borderBottom: "solid 1px grey"
    }
};

class PDFExportHelper extends React.PureComponent<any> {
    state: any;

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
                        <>
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
                        </>
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

                    {paymentDateUpdated && paymentDate !== paymentDateUpdated && (
                        <>
                            <ListItem>
                                <ListItemText primary={t("Date updated")} secondary={paymentDateUpdated} />
                            </ListItem>

                            <Divider style={styles.divider} />
                        </>
                    )}

                    <ListItem>
                        <ListItemText primary={t("Counterparty name")} secondary={counterPartyAlias.display_name} />
                    </ListItem>

                    {counterPartyIban && (
                        <>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText
                                    primary={t("Counterparty IBAN")}
                                    secondary={formatIban(counterPartyIban)}
                                />
                            </ListItem>
                        </>
                    )}

                    {payment.merchant_reference && (
                        <>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText primary={merchantReferenceText} secondary={payment.merchant_reference} />
                            </ListItem>
                        </>
                    )}

                    {payment.mandate_identifier && (
                        <>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText primary={mandateIdentifierText} secondary={payment.mandate_identifier} />
                            </ListItem>
                        </>
                    )}

                    {payment.credit_scheme_identifier && (
                        <>
                            <Divider style={styles.divider} />

                            <ListItem>
                                <ListItemText
                                    primary={creditSchemeIdentifierText}
                                    secondary={payment.credit_scheme_identifier}
                                />
                            </ListItem>
                        </>
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
        openSnackbar: message => dispatch(snackbarActions.open({ message })),

        applicationSetPDFMode: enabled => dispatch(applicationActions.setPdfMode(enabled)),

        setTheme: theme => dispatch(setTheme(theme))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PDFExportHelper);
