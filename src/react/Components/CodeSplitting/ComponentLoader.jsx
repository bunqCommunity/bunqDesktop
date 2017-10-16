import React from "react";
import Loadable from "react-loadable";
import Loading from "./Loading";

export default (importCallback) =>
    Loadable({
        loader: importCallback,
        LoadingComponent: Loading,
        delay: 300
    });
