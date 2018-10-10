import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import TranslateButton from "../TranslationHelpers/Button";
import NoteTextItem from "./NoteTextItem";

import {
    noteTextsUpdate,
    notesTextsAddNote,
    // notesTextsUpdateNote,
    notesTextsDeleteNote
} from "../../Actions/note_texts";
import NoteTextTypeParser from "../../Helpers/NoteTextTypeParser";

const styles = {
    paper: {
        padding: 24
    },
    textField: {
        width: "100%"
    },
    button: {
        width: "100%"
    }
};

class NoteTextForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            message: "",
            messageValid: false
        };
    }

    componentDidMount() {
        if (this.props.event && !this.props.noteTextsLoading) this.updateNotes();
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        if (
            this.props.event &&
            nextProps.event &&
            this.props.noteTextsLoading &&
            this.props.event.id !== nextProps.event.id
        ) {
            this.updateNotes();
        }
        return null;
    }
    componentDidUpdate() {}

    updateNotes = () => {
        const { event, user, noteTextsLoading } = this.props;
        const parsedEventType = NoteTextTypeParser(event);

        // ignore if false
        if (parsedEventType === false) return;

        if (!noteTextsLoading) {
            // console.log(
            //     "update",
            //     parsedEventType,
            //     user.id,
            //     event.monetary_account_id,
            //     event.id
            // );
            this.props.noteTextsUpdate(parsedEventType, user.id, event.monetary_account_id, event.id);
        }
    };

    addNote = () => {
        const { event, user, noteTextsLoading } = this.props;
        const parsedEventType = NoteTextTypeParser(event);

        // ignore if false
        if (parsedEventType === false) return;

        if (!noteTextsLoading && this.state.messageValid) {
            this.props.notesTextsAddNote(
                parsedEventType,
                user.id,
                event.monetary_account_id,
                event.id,
                this.state.message
            );

            this.setState({
                message: "",
                messageValid: false
            });
        }
    };

    onChange = event => {
        this.setState({
            message: event.target.value,
            messageValid: event.target.value.length > 0
        });
    };

    render() {
        const { event, user, noteTexts, noteTextsEventId, noteTextsLoading } = this.props;

        // ignore if event mismatch
        if (!event || !noteTextsEventId || noteTextsEventId !== event.id) return null;

        const parsedEventType = NoteTextTypeParser(event);

        // ignore if false
        if (parsedEventType === false) return null;

        const noteTextItems = noteTexts.map(noteText => {
            return (
                <NoteTextItem
                    noteText={noteText}
                    user={user}
                    event={event}
                    eventType={parsedEventType}
                    noteTextsLoading={noteTextsLoading}
                    notesTextsDeleteNote={this.props.notesTextsDeleteNote}
                    // notesTextsUpdateNote={this.props.notesTextsUpdateNote}
                />
            );
        });

        return (
            <Paper style={styles.paper}>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <List>{noteTextItems}</List>
                    </Grid>

                    <Grid item xs={12} sm={8} md={10}>
                        <TextField style={styles.textField} onChange={this.onChange} value={this.state.message} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <TranslateButton
                            variant="contained"
                            color="primary"
                            style={styles.button}
                            disabled={noteTextsLoading || !this.state.messageValid}
                            onClick={this.addNote}
                        >
                            Send
                        </TranslateButton>
                    </Grid>

                    {/*<Grid item xs={12}>*/}
                    {/*<Button*/}
                    {/*variant="contained"*/}
                    {/*style={styles.button}*/}
                    {/*disabled={noteTextsLoading}*/}
                    {/*onClick={this.updateNotes}*/}
                    {/*>*/}
                    {/*list note*/}
                    {/*</Button>*/}
                    {/*</Grid>*/}
                </Grid>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,

        noteTexts: state.note_texts.note_texts,
        noteTextsEventId: state.note_texts.event_id,
        noteTextsLoading: state.note_texts.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        noteTextsUpdate: (event_type, user_id, account_id, event_id) =>
            dispatch(noteTextsUpdate(BunqJSClient, event_type, user_id, account_id, event_id)),
        notesTextsAddNote: (event_type, user_id, account_id, event_id, content) =>
            dispatch(notesTextsAddNote(BunqJSClient, event_type, user_id, account_id, event_id, content)),
        // notesTextsUpdateNote: (
        //     event_type,
        //     user_id,
        //     account_id,
        //     event_id,
        //     content,
        //     note_id
        // ) =>
        //     dispatch(
        //         notesTextsUpdateNote(
        //             BunqJSClient,
        //             event_type,
        //             user_id,
        //             account_id,
        //             event_id,
        //             content,
        //             note_id
        //         )
        //     ),
        notesTextsDeleteNote: (event_type, user_id, account_id, event_id, note_id) =>
            dispatch(notesTextsDeleteNote(BunqJSClient, event_type, user_id, account_id, event_id, note_id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(NoteTextForm));
