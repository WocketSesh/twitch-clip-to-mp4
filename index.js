const { Plugin } = require("powercord/entities");
const { get } = require("powercord/http");

const baseUrl = "https://api.twitch.tv/helix/clips?id=";

const clientId = ""; // <--- your client id here
const token = ""; // <--- your access token here

module.exports = class Tomp4 extends Plugin {
	startPlugin() {
		powercord.api.commands.registerCommand({
			command: "tomp4",
			description: "Converts a twitch clip url to mp4 url",
			usage: "{c} [URL]",
			executor: async (args) => {
				if (!args[0])
					return {
						send: false,
						result: "You Need To Provide A URL",
					};

				let slug = args[0].split("/")[args[0].split("/").length - 1];

				const { body } = await get(`${baseUrl}${slug}`)
					.set("Accept", "application/vnd.twitchtv.v5+json")
					.set("Authorization", `Bearer ${token}`)
					.set("Client-id", clientId);

				if (!body.data[0])
					return { send: false, result: "Invalid Twitch Clip URL" };

				return {
					send: true,
					result: body.data[0].thumbnail_url.split("-p")[0] + ".mp4",
				};
			},
		});
	}

	pluginWillUnload() {
		powercord.api.commands.unregisterCommand("tomp4");
	}
};
