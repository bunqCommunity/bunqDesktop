export function openModal(message, title) {
    return {
        type: "MODAL_OPEN",
        payload: {
            message: message,
            title: title
        }
    };
}
export function closeModal() {
    return {
        type: "MODAL_CLOSE"
    };
}
