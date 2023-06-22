import { Manifest } from "deno-slack-sdk/mod.ts";
import { SendBlockKitDefinition } from "./functions/send_block_kit.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "send-block-kit",
  description: "Send Block Kit JSON messages",
  icon: "assets/slack.png",
  workflows: [],
  functions: [SendBlockKitDefinition],
  outgoingDomains: [],
  datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "chat:write.customize",
  ],
});
