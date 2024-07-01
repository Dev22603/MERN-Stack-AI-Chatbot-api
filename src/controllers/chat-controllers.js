// import User from "../models/User.js";
// import { configureOpenAI } from "../config/openai-config.js";
// import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
// export const generateChatCompletion = async (
// req,res,next
// ) => {
//   const { message } = req.body;
//   try {
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user)
//       return res
//         .status(401)
//         .json({ message: "User not registered OR Token malfunctioned" });
//     // grab chats of user
//     const chats = user.chats.map(({ role, content }) => ({
//       role,
//       content,
//     }));
//     chats.push({ content: message, role: "user" });
//     user.chats.push({ content: message, role: "user" });

//     // send all chats with new one to openAI API
//     const config = configureOpenAI();
//     const openai = new OpenAIApi(config);
//     // get latest response
//     const chatResponse = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: chats,
//     });
//     user.chats.push(chatResponse.data.choices[0].message);
//     await user.save();
//     return res.status(200).json({ chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const sendChatsToUser = async (
// req,res,next
// ) => {
//   try {
//     //user token check
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     return res.status(200).json({ message: "OK", chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({ message: "ERROR", cause: error.message });
//   }
// };

// export const deleteChats = async (
// req,res,next
// ) => {
//   try {
//     //user token check
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     //@ts-ignore
//     user.chats = [];
//     await user.save();
//     return res.status(200).json({ message: "OK" });
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({ message: "ERROR", cause: error.message });
//   }
// };

// chat-controller.js
import User from "../models/User.js";
import chatSession from "../config/gemini-config.js";

export const generateChatCompletion = async (req, res, next) => {
	const { message } = req.body;
	try {
		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json({
				message: "User not registered OR Token malfunctioned",
			});
		}

		// Grab chats of user
		const chats = user.chats.map(({ role, content }) => ({
			role,
			content,
		}));
		chats.push({ content: message, role: "user" });
		user.chats.push({ content: message, role: "user" });

		// const result = await googleAI.sendMessage(message);
		// const chatResponse = result.response.text();
		// console.log(chatResponse);
		const result = await chatSession.sendMessage(message);
		const chatResponse = result.response.text();
		console.log(chatResponse);
	
		// Add the response to user's chats
		user.chats.push({ content: chatResponse, role: "assistant" });
		await user.save();
		
		
		/*const chatResponse = await googleAI.generateChatMessage({
		  messages: chats,
		});*/

		// user.chats.push(chatResponse.message);
		await user.save();
		return res.status(200).json({ chats: user.chats });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export const sendChatsToUser = async (req, res, next) => {
	try {
		// User token check
		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res
				.status(401)
				.send("User not registered OR Token malfunctioned");
		}
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Permissions didn't match");
		}
		return res.status(200).json({ message: "OK", chats: user.chats });
	} catch (error) {
		console.log(error);
		return res.status(200).json({ message: "ERROR", cause: error.message });
	}
};

export const deleteChats = async (req, res, next) => {
	try {
		// User token check
		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res
				.status(401)
				.send("User not registered OR Token malfunctioned");
		}
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Permissions didn't match");
		}

		// Clear user's chats array
		user.chats = [];
		await user.save();
		return res.status(200).json({ message: "OK" });
	} catch (error) {
		console.log(error);
		return res.status(200).json({ message: "ERROR", cause: error.message });
	}
};
