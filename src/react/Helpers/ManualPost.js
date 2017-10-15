module.exports = url => {
    return () => {
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", url);
        document.body.appendChild(form);
        form.submit();
    };
};
