const path = require("path");

const shared =  {
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
	},
};

module.exports = [
	{
		...shared,
		entry: "./src/client.ts",
		target: ["web"],
		output: {
			...shared.output,
			filename: "public/js/client.js",
		},
	},
	{
		...shared,
		entry: {server: "./src/server.ts"},
		target: ["node"],
	}
];
