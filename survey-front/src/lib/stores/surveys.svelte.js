// Import browser utility to check if code runs in browser or server (SSR)
import { browser } from "$app/environment";

/*
|--------------------------------------------------------------------------
| Import Survey API functions
|--------------------------------------------------------------------------
| These functions communicate with the backend.
| We rename some imports (using "as") to avoid name conflicts with
| our store functions.
*/

// Import API functions for survey operations
// - getSurveys: fetch all surveys
// - fetchSurvey: fetch a single survey (renamed to avoid conflict with getSurvey function below)
// - createSurvey: create a new survey
// - removeSurvey: delete a survey (renamed to avoid conflict with deleteSurvey function below)
// - publishSurveyApi: publish a survey (renamed to avoid conflict with publishSurvey function below)
import {
	getSurveys,
	getSurvey as fetchSurvey,
	createSurvey,
	deleteSurvey as removeSurvey,
	publishSurvey as publishSurveyApi,
} from "$lib/api/surveys";

/*
|--------------------------------------------------------------------------
| Import Section API functions
|--------------------------------------------------------------------------
*/

// Import API functions for section operations
import {
	getSections,           // fetch all sections for a survey
	createSection,         // create a new section
	updateSection as updateSectionApi,  // update a section (renamed)
	deleteSection as deleteSectionApi,  // delete a section (renamed)
} from "$lib/api/sections";

/*
|--------------------------------------------------------------------------
| Import Question API functions
|--------------------------------------------------------------------------
*/

// Import API functions for question operations
import {
	getQuestions,          // fetch all questions for a section
	createQuestion,        // create a new question
	updateQuestion as updateQuestionApi,  // update a question (renamed)
	deleteQuestion as deleteQuestionApi,  // delete a question (renamed)
	reorderQuestions as reorderQuestionsApi, // reorder questions after drag-drop (renamed)
} from "$lib/api/questions";

/*
|--------------------------------------------------------------------------
| Import Responses API
|--------------------------------------------------------------------------
*/

// Import function to fetch survey responses
import { getResponses as fetchResponses } from "$lib/api/responses";

/*
|--------------------------------------------------------------------------
| Global Survey State
|--------------------------------------------------------------------------
| $state() is Svelte 5's reactive state.
|
| Every component using useSurveys() shares this array.
|
| Whenever this array changes, every component updates automatically.
*/

// Create reactive state variable that holds all surveys
// $state() makes it reactive - any change triggers UI updates
let surveys = $state([]);

/*
|--------------------------------------------------------------------------
| Placeholder save function
|--------------------------------------------------------------------------
| Reserved for later if you want autosave.
*/

// Empty function placeholder for future autosave functionality
function save() {}

/*
|--------------------------------------------------------------------------
| Load Dashboard Surveys
|--------------------------------------------------------------------------
|
| Gets every survey from the backend.
| Converts backend values into frontend values.
|
| Browser check prevents this from running during SSR.
*/

// Async function to load all surveys from the backend
async function load() {
	// If not in browser (i.e., running on server during SSR), exit early
	if (!browser) return;

	// 1. Request surveys from API - waits for response
	const data = await getSurveys();

	// 2. Empty the existing surveys array using splice (removes all elements)
	surveys.splice(0, surveys.length);

	// 3. Add the new surveys to the array
	//    .push() adds items, ...data.map() transforms each survey
	const sortedSurveys = data.sort(
	(a, b) =>
		new Date(b.updatedAt) - new Date(a.updatedAt)
);


surveys.push(
	...sortedSurveys.map((survey) => ({
		...survey,

		status:
			survey.status === "published"
				? "Published"
				: "Draft",

		responses: survey.responses ?? 0,

		sections: [],

		updatedAt: survey.updatedAt,
	}))
);
}

/*
|--------------------------------------------------------------------------
| Create Survey
|--------------------------------------------------------------------------
*/

// Async function to create a new survey
async function addSurvey(data) {
	// 1. Create survey in backend by calling API
	const survey = await createSurvey(data);

	// 2. Immediately add it to frontend state (optimistic update)
	//    .unshift() adds to the beginning of the array
	surveys.unshift({
		...survey,  // Spread all properties from backend response

		// Convert status to frontend display format
		status:
			survey.status === "published"
				? "Published"
				: "Draft",

		// New surveys have 0 responses initially
		responses: 0,

		// No sections yet
		sections: [],

		// Keep the update timestamp
		updatedAt: survey.updatedAt,
	});
}

/*
|--------------------------------------------------------------------------
| Delete Survey
|--------------------------------------------------------------------------
*/

// Async function to delete a survey by ID
async function deleteSurvey(id) {
	// 1. Delete in backend first
	await removeSurvey(id);

	// 2. Find the survey in the local array by its ID
	const index = surveys.findIndex(
		(survey) => survey.id === id
	);

	// 3. If found (index !== -1), remove it from the array
	if (index !== -1) {
		surveys.splice(index, 1);  // Remove 1 item at the found index
	}
}

/*
|--------------------------------------------------------------------------
| Load One Survey
|--------------------------------------------------------------------------
|
| Backend returns:
| Survey
|
| Sections endpoint returns:
| Sections
|
| Questions endpoint returns:
| Questions
|
| We combine everything into one object.
*/

// Async function to fetch a single survey with all its sections and questions
async function getSurvey(id) {
	// 1. Fetch the survey data from API
	const survey = await fetchSurvey(id);

	// 2. Fetch all sections for this survey
	const sections = await getSections(id);

	// 3. Load every section's questions
	//    Loop through each section
	for (const section of sections) {
		// Fetch questions for this specific section
		section.questions = await getQuestions(id, section.id);
	}

	// 4. Return the complete survey object with all nested data
	return {
		...survey,  // Spread survey properties

		// Convert status to frontend display format
		status:
			survey.status === "published"
				? "Published"
				: "Draft",

		// Set response count (default to 0 if not provided)
		responses: survey.responses ?? 0,

		// Include all sections with their questions
		sections,

		// Keep update timestamp
		updatedAt: survey.updatedAt,
	};
}

/* ==========================
        BUILDER
========================== */

/*
|--------------------------------------------------------------------------
| Add Section
|--------------------------------------------------------------------------
*/

// Async function to add a new section to a survey
async function addSection(survey) {
	// 1. Create section in backend
	const section = await createSection(survey.id);

	// 2. Add to frontend state immediately (optimistic update)
	//    Push the new section with an empty questions array
	survey.sections.push({
		...section,
		questions: [],  // New section starts with no questions
	});

	// 3. Return the created section
	return section;
}

/*
|--------------------------------------------------------------------------
| Update Section
|--------------------------------------------------------------------------
*/

// Async function to update an existing section
async function updateSection(survey, updatedSection) {
	// 1. Update section in backend
	const savedSection = await updateSectionApi(
		updatedSection.id,  // Which section to update
		updatedSection      // The new data
	);

	// 2. Find the section in the local survey object
	const existing = survey.sections.find(
		(section) => section.id === savedSection.id
	);

	// 3. If found, update it locally with the saved data
	if (existing) {
		// Object.assign merges savedSection properties into existing
		Object.assign(existing, savedSection);
	}

	// 4. Return the saved section
	return savedSection;
}

/*
|--------------------------------------------------------------------------
| Delete Section
|--------------------------------------------------------------------------
*/

// Async function to delete a section
async function deleteSection(survey, sectionId) {
	// 1. Delete section in backend
	await deleteSectionApi(sectionId);

	// 2. Find the section in the local array
	const index = survey.sections.findIndex(
		(section) => section.id === sectionId
	);

	// 3. If found, remove it from the array
	if (index !== -1) {
		survey.sections.splice(index, 1);
	}
}

/*
|--------------------------------------------------------------------------
| Add Question
|--------------------------------------------------------------------------
*/

// Async function to add a new question to a section
async function addQuestion(survey, sectionId, question) {
	// 1. Create question in backend
	const createdQuestion = await createQuestion(
		survey.id,      // Which survey
		sectionId,      // Which section
		question        // The question data
	);

	// 2. Find the section in the local survey
	const section = survey.sections.find(
		(s) => s.id === sectionId
	);

	// 3. If section not found, return null
	if (!section) return null;

	// 4. Initialize questions array if it doesn't exist
	if (!section.questions) {
		section.questions = [];
	}

	// 5. Add the new question to the section's questions array
	section.questions.push(createdQuestion);

	// 6. Return the created question
	return createdQuestion;
}

/*
|--------------------------------------------------------------------------
| Update Question
|--------------------------------------------------------------------------
*/

// Async function to update an existing question
async function updateQuestion(survey, updatedQuestion) {
	// 1. Update question in backend
	const savedQuestion = await updateQuestionApi(
		updatedQuestion.id,  // Which question
		updatedQuestion      // The new data
	);

	// 2. Loop through all sections to find the question
	for (const section of survey.sections) {
		// Find the question in this section by ID
		const existing = section.questions.find(
			(q) => q.id === savedQuestion.id
		);

		// If not found in this section, continue to next section
		if (!existing) continue;

		// If found, update it with the saved data
		Object.assign(existing, savedQuestion);

		// Return early since we found and updated it
		return savedQuestion;
	}

	// Return saved question even if not found locally
	return savedQuestion;
}

/*
|--------------------------------------------------------------------------
| Delete Question
|--------------------------------------------------------------------------
*/

// Async function to delete a question
async function deleteQuestion(survey, questionId) {
	// 1. Delete question in backend
	await deleteQuestionApi(questionId);

	// 2. Loop through all sections to find and remove the question
	for (const section of survey.sections) {
		// Find the question index in this section
		const index = section.questions.findIndex(
			(question) => question.id === questionId
		);

		// If found, remove it from the array
		if (index !== -1) {
			section.questions.splice(index, 1);
			return;  // Exit function after removal
		}
	}
}

/*
|--------------------------------------------------------------------------
| Duplicate Question
|--------------------------------------------------------------------------
|
| Creates a new question using the old one.
*/

// Async function to duplicate an existing question
async function duplicateQuestion(survey, questionId) {
	// 1. Loop through all sections to find the question
	for (const section of survey.sections) {
		// Find the question in this section
		const question = section.questions.find(
			(q) => q.id === questionId
		);

		// If not found in this section, continue
		if (!question) continue;

		// 2. Create a copy of the question with "Copy" appended to label
		const copy = {
			label: `${question.label} Copy`,  // Add "Copy" to the label
			type: question.type,               // Same question type
			description: question.description, // Same description
			required: question.required,       // Same required status
			placeholder: question.placeholder, // Same placeholder
			options: [...(question.options ?? [])], // Copy options array
		};

		// 3. Add the copy as a new question
		return await addQuestion(survey, section.id, copy);
	}

	// Return null if question not found
	return null;
}

/*
|--------------------------------------------------------------------------
| Reorder Questions
|--------------------------------------------------------------------------
|
| After drag-and-drop we only send:
|
| [id1,id2,id3,id4]
|
| Backend updates order.
*/

// Async function to reorder questions after drag-and-drop
async function reorderSectionQuestions(survey, section) {
	// Guard clauses: exit if survey, section, or questions don't exist
	if (!survey || !section) return;
	if (!section.questions) return;

	// 1. Create an array of question IDs in the new order
	const order = section.questions.map(
		(question) => question.id
	);

	// 2. Send the new order to the backend
	await reorderQuestionsApi(
		survey.id,     // Which survey
		section.id,    // Which section
		order          // Array of IDs in the new order
	);
}

/*
|--------------------------------------------------------------------------
| Publish Survey
|--------------------------------------------------------------------------
*/

// Async function to publish a survey
async function publishSurvey(survey) {
	// 1. Call API to publish the survey
	const updatedSurvey = await publishSurveyApi(survey.id);

	// 2. Convert status to frontend display format
	const status = updatedSurvey.status === "published"
		? "Published"
		: "Draft";

	// 3. Update the local survey object with new status and timestamp
	survey.status = status;
	survey.updatedAt = updatedSurvey.updatedAt;

	// 4. Also update the survey in the main surveys list (dashboard)
	const existing = surveys.find(
		(s) => s.id === survey.id
	);

	if (existing) {
		existing.status = status;
		existing.updatedAt = updatedSurvey.updatedAt;
	}

	// 5. Return the updated survey
	return updatedSurvey;
}

/*
|--------------------------------------------------------------------------
| Save Every Question
|--------------------------------------------------------------------------
|
| Used before publishing.
|
| Loops through every section,
| then every question.
*/

// Async function to save all questions (used before publishing)
async function saveAllQuestions(survey) {
	// 1. Loop through every section
	for (const section of survey.sections) {
		// 2. Loop through every question in this section
		for (const question of section.questions) {
			// 3. Save each question individually
			await updateQuestion(survey, question);
		}
	}
}

/*
|--------------------------------------------------------------------------
| Responses
|--------------------------------------------------------------------------
*/

// Async function to fetch responses for a survey
async function getResponses(surveyId) {
	// Call API to fetch responses and return them
	return await fetchResponses(surveyId);
}

/*
|--------------------------------------------------------------------------
| Survey + Responses
|--------------------------------------------------------------------------
|
| Promise.all executes both requests simultaneously.
| This is faster than waiting for one then the other.
*/

// Async function to fetch survey and its responses in parallel
async function getSurveyWithResponses(surveyId) {
	// 1. Execute both API calls simultaneously using Promise.all
	const [survey, responses] = await Promise.all([
		getSurvey(surveyId),      // Fetch survey with sections and questions
		fetchResponses(surveyId), // Fetch responses for this survey
	]);

	// 2. Return both in one object
	return {
		survey,
		responses,
	};
}

/*
|--------------------------------------------------------------------------
| Export Store
|--------------------------------------------------------------------------
|
| Any component can do:
|
| const { load, addQuestion, ... } = useSurveys();
|
| and access these shared functions/state.
*/

// Export the store function that provides access to all functions and reactive state
export function useSurveys() {
	return {
		// Dashboard functions
		surveys,          // Reactive state (shared across components)
		load,             // Load all surveys
		save,             // Placeholder save function
		getSurvey,        // Get a single survey with all data
		addSurvey,        // Create a new survey
		deleteSurvey,     // Delete a survey

		// Builder functions
		addSection,       // Add a section
		updateSection,    // Update a section
		deleteSection,    // Delete a section

		addQuestion,      // Add a question
		updateQuestion,   // Update a question
		deleteQuestion,   // Delete a question
		duplicateQuestion, // Duplicate a question

		// Drag & Drop
		reorderSectionQuestions, // Reorder questions

		// Publish
		publishSurvey,    // Publish a survey
		saveAllQuestions, // Save all questions

		// Responses
		getResponses,     // Get survey responses
		getSurveyWithResponses, // Get survey + responses together
	};
}