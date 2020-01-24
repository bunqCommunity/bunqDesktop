import "~helpers/context_menu";
import "~helpers/external_links";
import BunqDesktopClient from "~components/BunqDesktopClient";
import { CryptoWorkerQueue } from "~functions/Crypto/CryptoWorkerWrapper";

export type AppWindow = Window & {
    BunqDesktopClient?: BunqDesktopClient;
    t: Function;
    BUNQDESKTOP_LANGUAGE_SETTING: string;
    cryptoWorkerQueue: CryptoWorkerQueue;
};
