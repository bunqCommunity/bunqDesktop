import os from "~importwrappers/os";

export default () => {
    return os.platform() === "darwin";
};
