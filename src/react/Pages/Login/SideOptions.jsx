import React from "react";
import Input from "@material-ui/core/Input";
import Switch from "@material-ui/core/Switch";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";

const styles = {
    card: {
        width: 250,
        marginLeft: 8,
        marginTop: 48
    },
    cardContent: {
        backgroundColor: "#ffffff",
        textAlign: "center"
    },
    toggleOptionsButton: {
        zIndex: 1,
        height: 48
    },
    button: {
        width: "100%",
        marginTop: 20
    },
    formControl: {
        width: "100%",
        marginBottom: 8
    },
    inputLabel: {
        color: "#000000"
    },
    apiInput: {
        width: "100%",
        marginTop: 20,
        color: "#000000"
    },
    toggle: {
        marginTop: 10,
        color: "#000000"
    },
    text: {
        color: "#000000"
    }
};
export default props => {
    const {
        t,
        openOptions,
        apiKey,
        apiKeyValid,
        sandboxMode,
        wildcardMode,
        currentIp,
        currentIpValid,
        gettingCurrentIpLoading,
        buttonDisabled,
        sandboxButtonDisabled,
        setApiKeyClassname,

        // functions
        handleSandboxChange,
        handleWildcardModeChange,
        handleChange,
        createSandboxUser,
        setRegistration
    } = props;

    return (
        openOptions && (
            <Card style={styles.card} className="animated fadeIn">
                <CardContent style={styles.cardContent}>
                    <FormControl style={styles.formControl}>
                        <InputLabel style={styles.inputLabel}>API Key</InputLabel>
                        <Input
                            style={styles.apiInput}
                            className={"text-input"}
                            onChange={handleChange("apiKey")}
                            value={apiKey}
                            error={!apiKeyValid}
                            onKeyPress={ev => {
                                if (ev.key === "Enter" && buttonDisabled === false) {
                                    setRegistration();
                                    ev.preventDefault();
                                }
                            }}
                        />
                    </FormControl>

                    <FormControlLabel
                        style={styles.toggle}
                        label={
                            <TranslateTypography variant="body1" style={styles.text}>
                                Enable sandbox mode?
                            </TranslateTypography>
                        }
                        control={
                            <Switch
                                checked={sandboxMode}
                                onChange={handleSandboxChange}
                                aria-label="enable or disable sandbox mode"
                            />
                        }
                    />

                    <FormControlLabel
                        style={styles.toggle}
                        label={
                            <TranslateTypography variant="body1" style={styles.text}>
                                Enable wildcard mode?
                            </TranslateTypography>
                        }
                        control={
                            <Switch
                                checked={wildcardMode}
                                onChange={handleWildcardModeChange}
                                aria-label="enable or disable wildcard mode"
                            />
                        }
                    />

                    {wildcardMode && (
                        <FormControl style={styles.formControl}>
                            <InputLabel style={styles.inputLabel}>Current IP Address</InputLabel>
                            <Input
                                style={styles.apiInput}
                                className={"text-input"}
                                onChange={handleChange("currentIp")}
                                value={currentIp ? currentIp : ""}
                                error={!currentIpValid}
                                disabled={gettingCurrentIpLoading}
                            />
                        </FormControl>
                    )}

                    {sandboxMode ? (
                        <TranslateButton
                            variant="contained"
                            color="secondary"
                            disabled={sandboxButtonDisabled}
                            style={styles.button}
                            onClick={createSandboxUser}
                        >
                            Create a sandbox account
                        </TranslateButton>
                    ) : null}

                    <TranslateButton
                        variant="contained"
                        color="primary"
                        className={setApiKeyClassname}
                        disabled={buttonDisabled}
                        style={styles.button}
                        onClick={setRegistration}
                    >
                        Set API Key
                    </TranslateButton>
                </CardContent>
            </Card>
        )
    );
};
