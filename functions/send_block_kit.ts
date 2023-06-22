import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const SendBlockKitDefinition = DefineFunction({
  callback_id: "send_block_kit",
  title: "Send Formatted Message",
  description: "Send a Block Kit message",
  source_file: "functions/send_block_kit.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel for Approvals",
      },
      username: {
        type: Schema.types.string,
        description: "Username to post as",
      },
      icon: {
        type: Schema.types.string,
        description: "icon URL or :emoji: to use",
      },
      json: {
        type: Schema.types.string,
        description: "Block Kit JSON",
      },
    },
    required: ["json", "channel"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  SendBlockKitDefinition,
  async ({ inputs, client }) => {
    // Check if it's JSON aka Block Kit
    const parsedJSON = parseJSON(inputs.json);
    try {
      await client.chat.postMessage(
        {
          channel: inputs.channel,
          ...!parsedJSON && { text: inputs.json }, // itextf not JSON, treat it as
          ...parsedJSON &&
            { blocks: parsedJSON.blocks ? parsedJSON.blocks : parsedJSON }, // BK
          ...inputs.username && { username: inputs.username }, // Username override
          ...(inputs.icon && inputs.icon.startsWith("http")) &&
            { icon_url: inputs.icon }, // Icon override as URL
          ...(inputs.icon && !inputs.icon.startsWith("http")) &&
            { icon_emoji: inputs.icon }, // Icon override as emoji
        },
      );
    } catch (error) {
      console.log("oops: ", error);
    }
    return { outputs: {} };
  },
);

// Chrck if a string is JSON
const parseJSON = (jsonString: string) => {
  try {
    const parsedJSON = JSON.parse(jsonString);
    if (parsedJSON && typeof parsedJSON === "object") {
      return parsedJSON;
    }
  } catch (error) {
    // error
  }
  return false;
};
