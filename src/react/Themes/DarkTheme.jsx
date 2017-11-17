export default {
    themeName: "DarkTheme",
    palette: {
        common: {
            receivedPayment: "#8DC55F",
            sentPayment: "#FF3333"
        },
        requestResponse: {
            pending: "#dc975e",
            accepted: "#FF3333",
            rejected: "#a4a6a4",
            revoked: "#FF3333"
        },
        requestInquiry: {
            pending: "#2196f3",
            accepted: "#8DC55F",
            rejected: "#FF3333",
            revoked: "#a4a6a4"
        },
        bunqMeTabs: {
            awaiting_payment: "#62ca04",
            cancelled: "#3f56d6",
            expired: "#f50057"
        },
        type: "dark"
    },
    styles: {
        requestResponse: {
            pending: {
                opacity: 0.7
            },
            rejected: {
                textDecoration: "line-through"
            }
        },
        requestInquiry: {
            rejected: {
                textDecoration: "line-through"
            },
            revoked: {
                textDecoration: "line-through"
            }
        }
    }
};
