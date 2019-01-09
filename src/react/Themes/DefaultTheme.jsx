export default {
    themeName: "DefaultTheme",
    typography: {
        useNextVariants: true
    },
    palette: {
        type: "light",
        common: {
            receivedPayment: "#008000",
            sentPayment: "#ff0000"
        },
        requestResponse: {
            pending: "#ff7d12",
            accepted: "#ff0000",
            rejected: "#3d3f3d",
            revoked: "#3d3f3d"
        },
        requestInquiry: {
            pending: "#2196f3",
            accepted: "#008000",
            rejected: "#ff0000",
            revoked: "#3d3f3d",
            expired: "#3d3f3d"
        },
        masterCardAction: {
            authorized: "#FF3333",
            refunded: "#a4a6a4",
            blocked: "#a4a6a4",
            pending: "#2196f3"
        },
        bunqMeTabs: {
            awaiting_payment: "#62ca04",
            cancelled: "#FF3333",
            expired: "#a4a6a4"
        }
    },
    styles: {
        moneyInput: {
            color: "#000"
        },
        requestResponse: {
            pending: {},
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
            },
            expired: {
                textDecoration: "line-through"
            }
        },
        masterCardAction: {
            blocked: {
                textDecoration: "line-through"
            },
            refunded: {
                textDecoration: "line-through"
            }
        }
    }
};
