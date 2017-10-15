export default {
    getHashParams: () => {
        let hashParams = {};
        let e;
        let a = /\+/g; // Regex for replacing addition symbol with a space
        let r = /([^&;=]+)=?([^&;]*)/g;
        let d = s => {
            return decodeURIComponent(s.replace(a, " "));
        };
        let q = window.location.hash.substring(1);
        e = r.exec(q);
        while (e) {
            hashParams[d(e[1])] = d(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    },
    ucfirst: str => {
        str += "";
        let f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    },
    validateJSON: input => {
        if (typeof input === "object") {
            return true;
        }
        try {
            JSON.parse(input);
        } catch (ex) {
            return false;
        }
        return true;
    }
};
