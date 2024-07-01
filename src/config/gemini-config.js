import { config } from "dotenv";
config();

import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_AI_SECRET;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
});

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 8192,
	responseMimeType: "text/plain",
};

	const chatSession = model.startChat({
		generationConfig,

		history: [],
	});

	// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
	// console.log(result.response.text());
export default chatSession;




//-----------------------------------------------------------------------------------------------------------------------------
// gemini-config.js
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI({
// 	apiKey: "process.env.GEMINI_AI_SECRET",
// 	projectId: process.env.GEMINI_PROJECT_ID,
// });
// const googleAI=genAI.getGenerativeModel({ model: "gemini-1.5-flash"})

// export default googleAI;
//-----------------------------------------------------------------------------------------------------------------------------

// // gemini-config.js
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const configureGoogleGenerativeAI = () => {
//   return new GoogleGenerativeAI({
//     apiKey: process.env.GEMINI_AI_SECRET,
//     projectId: process.env.GEMINI_PROJECT_ID,
//   });
// };

// const googleAI = configureGoogleGenerativeAI();

// export default googleAI;
