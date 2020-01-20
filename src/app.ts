import "~helpers/context_menu";
import "~helpers/external_links";
import BunqDesktopClient from "~components/BunqDesktopClient";

export type AppWindow = Window & { BunqDesktopClient: BunqDesktopClient; t: Function };
