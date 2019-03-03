import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";

import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from "@material-ui/icons/Edit";
import { humanReadableDate } from "../../Functions/Utils";
import NoteTextTypeParser from "../../Functions/NoteTextTypeParser";

const styles = {};

class NoteTextItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            editMessage: "",
            editMessageValid: false
        };
    }

    // updateNote = e => {
    //     const {
    //         noteText,
    //         event,
    //         eventType,
    //         user,
    //         noteTextsLoading
    //     } = this.props;
    //     const noteTextInfo = noteText.NoteText;
    //
    //     if (!noteTextsLoading && this.state.editMessageValid) {
    //         this.props.notesTextsUpdateNote(
    //             eventType,
    //             user.id,
    //             event.monetary_account_id,
    //             event.id,
    //             this.state.editMessage,
    //             noteTextInfo.id
    //         );
    //     }
    // };

    deleteNote = () => {
        const { noteText, event, user, noteTextsLoading } = this.props;
        const noteTextInfo = noteText.NoteText;
        const parsedEventType = NoteTextTypeParser(event);

        if (!noteTextsLoading) {
            this.props.notesTextsDeleteNote(
                parsedEventType,
                user.id,
                event.monetary_account_id,
                event.id,
                noteTextInfo.id
            );
        }
    };

    render() {
        const { noteText } = this.props;
        const noteTextInfo = noteText.NoteText;

        return (
            <ListItem>
                <ListItemText primary={noteTextInfo.content} secondary={humanReadableDate(noteTextInfo.updated)} />
                <ListItemSecondaryAction>
                    {/*<IconButton onClick={console.log}>*/}
                    {/*<EditIcon />*/}
                    {/*</IconButton>*/}

                    <IconButton onClick={this.deleteNote}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default NoteTextItem;
