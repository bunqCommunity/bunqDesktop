import os from "../ImportWrappers/os";

export default () => {
    return os.platform() === "darwin";
};
