/**
 * ========================================================================
 * SURVEY STORE - Complete Survey Management System
 * ========================================================================
 * 
 * This file manages all survey data and operations for the application.
 * It uses Svelte 5 Runes for reactive state management and provides
 * a clean API for components to interact with survey data.
 * 
 * KEY FEATURES:
 * - Reactive state with $state() for automatic UI updates
 * - Full CRUD operations for surveys, sections, and questions
 * - Draft system for unsaved changes
 * - Response data fetching
 * - Optimistic updates pattern
 * - SSR-safe with browser detection
 * 
 * @module surveys.svelte.js
 * ========================================================================
 */

// ============================================================
// 1. IMPORTS & DEPENDENCIES
// ============================================================

/**
 * SVELTEKIT ENVIRONMENT
 * - browser: Boolean flag for client-side rendering
 * - Used to prevent API calls during Server Side Rendering (SSR)
 * - Critical for hydration and preventing server/client mismatches
 */
import { browser } from "$app/environment";

/**
 * SVELTE STORE SYSTEM
 * - writable(): Creates a Svelte 4 style store for external state
 * - get(): Reads current store value without subscribing
 * - Used for draftStore which needs cross-component access
 * - This is a legacy pattern alongside Svelte 5's $state()
 */
import { writable, get } from 'svelte/store';

/**
 * SURVEY API FUNCTIONS
 * All functions interact with the backend REST API
 * 
 * getSurveys          - GET /api/surveys - Fetch all surveys
 * fetchSurvey         - GET /api/surveys/:id - Fetch single survey
 * createSurvey        - POST /api/surveys - Create new survey
 * removeSurvey        - DELETE /api/surveys/:id - Delete survey
 * publishSurveyApi    - POST /api/surveys/:id/publish - Publish survey
 * 
 * The 'as' keyword renames imports to avoid naming conflicts
 * e.g., getSurvey as fetchSurvey - avoids conflict with our getSurvey function
 */
import {
	getSurveys,
	getSurvey as fetchSurvey,
	createSurvey,
	deleteSurvey as removeSurvey,
	publishSurvey as publishSurveyApi,
} from "$lib/api/surveys";

/**
 * SECTION API FUNCTIONS
 * 
 * getSections         - GET /api/surveys/:id/sections
 * createSection       - POST /api/surveys/:id/sections
 * updateSectionApi    - PUT /api/sections/:id
 * deleteSectionApi    - DELETE /api/sections/:id
 */
import {
	getSections,
	createSection,
	updateSection as updateSectionApi,
	deleteSection as deleteSectionApi,
} from "$lib/api/sections";

/**
 * QUESTION API FUNCTIONS
 * 
 * getQuestions        - GET /api/surveys/:id/sections/:sectionId/questions
 * createQuestion      - POST /api/surveys/:id/sections/:sectionId/questions
 * updateQuestionApi   - PUT /api/questions/:id
 * deleteQuestionApi   - DELETE /api/questions/:id
 * reorderQuestionsApi - PUT /api/sections/:id/reorder
 */
import {
	getQuestions,
	createQuestion,
	updateQuestion as updateQuestionApi,
	deleteQuestion as deleteQuestionApi,
	reorderQuestions as reorderQuestionsApi,
} from "$lib/api/questions";

/**
 * RESPONSE API FUNCTIONS
 * 
 * fetchResponses      - GET /api/surveys/:id/responses
 */
import { getResponses as fetchResponses } from "$lib/api/responses";

// ============================================================
// 2. STATE MANAGEMENT
// ============================================================

/**
 * DRAFT STORE (Svelte 4 Store)
 * 
 * 📝 Purpose: Preserve unsaved changes across page navigation
 * 🔄 Type: Writable store (can be updated with .set())
 * 📦 Usage: 
 *   - Save: draftStore.set(surveyData)
 *   - Read: get(draftStore) or subscribe()
 *   - Clear: draftStore.set(null)
 * 
 * Why use writable instead of $state?
 * - Need cross-component/page access (not just within Svelte files)
 * - Compatible with both Svelte 4 and 5
 * - Can be imported and used anywhere
 * 
 * ⚠️ IMPORTANT: Stores data as JSON, so use deep cloning
 */
export const draftStore = writable(null);

/**
 * REACTIVE STATE (Svelte 5 Runes)
 * 
 * surveys - Array of all surveys loaded from the API
 * 
 * ⚡ $state() makes this reactive - UI updates automatically when changed
 * 
 * IMPORTANT REACTIVITY RULES:
 * ✅ DO use: surveys.push(item)        - Add item
 * ✅ DO use: surveys.splice(index, 1)  - Remove item
 * ✅ DO use: surveys[index] = newItem  - Update item
 * ✅ DO use: surveys.length = 0        - Clear array
 * 
 * ❌ DON'T use: surveys = []           - Breaks reactivity!
 * ❌ DON'T use: surveys = newArray     - Breaks reactivity!
 * 
 * Why? $state() tracks the array reference, not the contents.
 * Mutating the array (push/splice) keeps the reference.
 * Reassigning changes the reference and breaks the connection.
 * 
 * Each survey object has this structure:
 * {
 *   id: string,                // Unique identifier
 *   title: string,             // Survey title
 *   description: string,       // Survey description
 *   status: 'Draft' | 'Published', // Display format
 *   responses: number,         // Response count
 *   sections: [],              // Array of section objects
 *   updatedAt: string,         // ISO timestamp
 *   // ... plus any other backend properties
 * }
 */
let surveys = $state([]);

// ============================================================
// 3. PLACEHOLDER FUNCTIONS
// ============================================================

/**
 * save() - Placeholder function
 * 
 * Currently does nothing. Reserved for future implementation.
 * May be used for auto-save functionality or manual save.
 * 
 * @returns {void}
 */
function save() {}

// ============================================================
// 4. CORE SURVEY OPERATIONS
// ============================================================

/**
 * load() - Fetch all surveys from the API
 * 
 * 🎯 Purpose: Initialize or refresh the survey list
 * 🔄 Called: On page load, after create/delete operations
 * 🛡️ SSR-safe: Returns early if not in browser
 * 
 * Flow:
 * 1. Check if in browser (skip during SSR)
 * 2. Call API to get all surveys
 * 3. Clear the reactive array using splice()
 * 4. Transform data and push to reactive array
 * 
 * @async
 * @returns {Promise<void>}
 */
async function load() {
	// 🔒 SSR Check: Prevent API calls during server-side rendering
	if (!browser) return;

	// 🌐 API Call: Fetch all surveys from backend
	const data = await getSurveys();

	// 🔄 Clear array while maintaining reactivity
	// splice(0, surveys.length) removes all elements
	// This keeps the same array reference, so reactivity is preserved
	surveys.splice(0, surveys.length);

	// 📊 Transform and Add Data
	// Using spread operator (...) to map each survey
	surveys.push(
		...data.map((survey) => ({
			...survey, // Copy all original properties

			// 🏷️ Transform status to display-friendly format
			// Backend uses 'published' or 'draft' (lowercase)
			// Frontend displays 'Published' or 'Draft' (capitalized)
			status: survey.status === "published" ? "Published" : "Draft",

			// 📊 Set default response count
			// Uses nullish coalescing (??) to fallback to 0
			// This handles cases where responses might be undefined
			responses: survey.responses ?? 0,

			// 📋 Initialize empty sections array
			// Each survey starts with no sections loaded
			sections: [],

			// 🕐 Keep the update timestamp
			updatedAt: survey.updatedAt,
		})),
	);
}

/**
 * addSurvey() - Create a new survey
 * 
 * 🎯 Purpose: Add a new survey to the system
 * 🔄 Called: When user creates a new survey
 * 
 * Flow:
 * 1. Call API to create survey
 * 2. Transform the returned data
 * 3. Add to beginning of surveys array (newest first)
 * 
 * @async
 * @param {Object} data - Survey creation data
 * @param {string} data.title - Survey title
 * @param {string} [data.description] - Survey description (optional)
 * @returns {Promise<Object>} Created survey
 */
async function addSurvey(data) {
	// 🌐 API Call: Create survey
	const survey = await createSurvey(data);

	// ⬆️ Add to beginning of array
	// unshift() adds to front, showing newest first
	// This is more intuitive for users
	surveys.unshift({
		...survey,
		status: survey.status === "published" ? "Published" : "Draft",
		responses: 0, // New survey has no responses yet
		sections: [], // New survey has no sections yet
		updatedAt: survey.updatedAt,
	});
}

/**
 * deleteSurvey() - Delete a survey by ID
 * 
 * 🎯 Purpose: Remove a survey from the system
 * 🔄 Called: When user deletes a survey
 * 
 * ⚡ Optimistic Update Pattern:
 * - Currently deletes from API first, then updates UI
 * - Could be optimized to update UI first, revert on error
 * 
 * @async
 * @param {string} id - Survey ID to delete
 * @returns {Promise<void>}
 */
async function deleteSurvey(id) {
	// 🌐 API Call: Delete survey
	await removeSurvey(id);

	// 🔍 Find survey in reactive array
	const index = surveys.findIndex((survey) => survey.id === id);

	// 🗑️ Remove if found
	if (index !== -1) {
		surveys.splice(index, 1);
	}
}

/**
 * getSurvey() - Fetch a single survey with all its data
 * 
 * 🎯 Purpose: Get complete survey with sections and questions
 * 🔄 Called: When opening a survey in the builder
 * 
 * Flow:
 * 1. Fetch base survey data
 * 2. Fetch all sections for the survey
 * 3. For each section, fetch its questions
 * 4. Return complete survey object
 * 
 * ⚠️ NOTE: This is a 'deep' fetch - it loads the entire survey tree
 * 
 * @async
 * @param {string} id - Survey ID to fetch
 * @returns {Promise<Object>} Complete survey with sections and questions
 */
async function getSurvey(id) {
	// 🌐 API Call: Fetch base survey
	const survey = await fetchSurvey(id);

	// 🌐 API Call: Fetch all sections
	const sections = await getSections(id);

	// 📥 Fetch questions for each section
	// Uses a for loop to handle async/await sequentially
	for (const section of sections) {
		section.questions = await getQuestions(id, section.id);
	}

	// 📦 Return complete survey
	return {
		...survey,
		status: survey.status === "published" ? "Published" : "Draft",
		responses: survey.responses ?? 0,
		sections, // Fully populated sections with questions
		updatedAt: survey.updatedAt,
	};
}

// ============================================================
// 5. BUILDER FUNCTIONS - Survey Editor Operations
// ============================================================

/**
 * ============================================================
 * SECTION OPERATIONS
 * ============================================================
 */

/**
 * addSection() - Add a new section to a survey
 * 
 * 🎯 Purpose: Create a new section in the survey
 * 🔄 Called: When user clicks "Add Section" in builder
 * 
 * Section Structure:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   questions: [],  // Array of question objects
 *   order: number   // Display order
 * }
 * 
 * @async
 * @param {Object} survey - Survey object to add section to
 * @returns {Promise<Object>} Created section
 */
async function addSection(survey) {
	// 🌐 API Call: Create section
	const section = await createSection(survey.id);

	// 📋 Add to survey with empty questions array
	survey.sections.push({
		...section,
		questions: [], // Initialize with no questions
	});

	return section;
}

/**
 * updateSection() - Update a section's properties
 * 
 * 🎯 Purpose: Save changes to a section
 * 🔄 Called: When user edits section title or description
 * 
 * Flow:
 * 1. Save to API
 * 2. Find local section
 * 3. Update in place (maintains reactivity)
 * 
 * 💡 Object.assign() merges properties into existing object
 * This preserves the object reference, maintaining reactivity
 * 
 * @async
 * @param {Object} survey - Survey containing the section
 * @param {Object} updatedSection - Updated section data
 * @returns {Promise<Object>} Saved section from API
 */
async function updateSection(survey, updatedSection) {
	// 🌐 API Call: Save section updates
	const savedSection = await updateSectionApi(
		updatedSection.id,
		updatedSection,
	);

	// 🔍 Find existing section in survey
	const existing = survey.sections.find(
		(section) => section.id === savedSection.id,
	);

	// 🔄 Update in place if found
	if (existing) {
		Object.assign(existing, savedSection);
	}

	return savedSection;
}

/**
 * deleteSection() - Delete a section from a survey
 * 
 * 🎯 Purpose: Remove a section and all its questions
 * 🔄 Called: When user deletes a section
 * 
 * ⚠️ NOTE: This also deletes all questions in the section
 * 
 * @async
 * @param {Object} survey - Survey containing the section
 * @param {string} sectionId - ID of section to delete
 * @returns {Promise<void>}
 */
async function deleteSection(survey, sectionId) {
	// 🌐 API Call: Delete section
	await deleteSectionApi(sectionId);

	// 🔍 Find section in survey
	const index = survey.sections.findIndex(
		(section) => section.id === sectionId,
	);

	// 🗑️ Remove if found
	if (index !== -1) {
		survey.sections.splice(index, 1);
	}
}

/**
 * ============================================================
 * QUESTION OPERATIONS
 * ============================================================
 */

/**
 * addQuestion() - Add a new question to a section
 * 
 * 🎯 Purpose: Create a new question in a section
 * 🔄 Called: When user adds a question via QuestionTypePicker
 * 
 * Question Structure:
 * {
 *   id: string,
 *   label: string,        // Question text
 *   type: string,         // 'text', 'single_choice', 'multiple_choice', etc.
 *   description: string,  // Help text
 *   required: boolean,    // Is this question required?
 *   placeholder: string,  // Placeholder text for input
 *   options: [],          // For choice questions: array of options
 *   order: number         // Display order
 * }
 * 
 * @async
 * @param {Object} survey - Survey containing the section
 * @param {string} sectionId - ID of section to add question to
 * @param {Object} question - Question data to create
 * @returns {Promise<Object>} Created question
 */
async function addQuestion(survey, sectionId, question) {
	// 🌐 API Call: Create question
	const createdQuestion = await createQuestion(survey.id, sectionId, question);

	// 🔍 Find target section
	const section = survey.sections.find((s) => s.id === sectionId);

	// 🛡️ Safety check: Return if section not found
	if (!section) return;

	// 📋 Initialize questions array if needed
	if (!section.questions) {
		section.questions = [];
	}

	// ✅ Add question to section
	section.questions.push(createdQuestion);

	return createdQuestion;
}

/**
 * updateQuestion() - Update a question's properties
 * 
 * 🎯 Purpose: Save changes to a question
 * 🔄 Called: When user edits question via QuestionSettings
 * 
 * Flow:
 * 1. Save to API
 * 2. Search all sections for the question
 * 3. Update in place (maintains reactivity)
 * 
 * 💡 Searches all sections because questions can be in any section
 * 
 * @async
 * @param {Object} survey - Survey containing the question
 * @param {Object} updatedQuestion - Updated question data
 * @returns {Promise<Object>} Saved question from API
 */
async function updateQuestion(survey, updatedQuestion) {
	// 🌐 API Call: Save question updates
	const savedQuestion = await updateQuestionApi(
		updatedQuestion.id,
		updatedQuestion,
	);

	// 🔍 Search all sections for the question
	for (const section of survey.sections) {
		const existing = section.questions.find((q) => q.id === savedQuestion.id);

		// 🔄 Update in place if found
		if (!existing) continue;

		Object.assign(existing, savedQuestion);

		return savedQuestion;
	}

	// Return saved question even if not found locally
	return savedQuestion;
}

/**
 * deleteQuestion() - Delete a question from a survey
 * 
 * 🎯 Purpose: Remove a question from its section
 * 🔄 Called: When user deletes a question
 * 
 * Flow:
 * 1. Delete from API
 * 2. Search all sections
 * 3. Remove from section
 * 
 * 💡 Returns early after removal (exit loop)
 * 
 * @async
 * @param {Object} survey - Survey containing the question
 * @param {string} questionId - ID of question to delete
 * @returns {Promise<void>}
 */
async function deleteQuestion(survey, questionId) {
	// 🌐 API Call: Delete question
	await deleteQuestionApi(questionId);

	// 🔍 Search all sections
	for (const section of survey.sections) {
		const index = section.questions.findIndex(
			(question) => question.id === questionId,
		);

		// 🗑️ Remove if found and exit
		if (index !== -1) {
			section.questions.splice(index, 1);
			return; // Exit loop after removal
		}
	}
}

/**
 * duplicateQuestion() - Duplicate an existing question
 * 
 * 🎯 Purpose: Create a copy of a question
 * 🔄 Called: When user duplicates a question
 * 
 * Flow:
 * 1. Find the question in all sections
 * 2. Create a deep copy with "Copy" suffix
 * 3. Add the copy to the same section
 * 
 * 💡 Uses addQuestion() to handle the creation
 * 
 * @async
 * @param {Object} survey - Survey containing the question
 * @param {string} questionId - ID of question to duplicate
 * @returns {Promise<Object>} Newly created duplicate question
 */
async function duplicateQuestion(survey, questionId) {
	// 🔍 Find the question
	for (const section of survey.sections) {
		const question = section.questions.find((q) => q.id === questionId);

		// Skip if not found in this section
		if (!question) continue;

		// 📋 Create copy with modifications
		const copy = {
			// 📝 Add "Copy" suffix to label
			label: `${question.label} Copy`,

			// 🔄 Copy all properties
			type: question.type,
			description: question.description,
			required: question.required,
			placeholder: question.placeholder,

			// 📋 Spread options array (creates a new array)
			options: [...(question.options ?? [])],
		};

		// ➕ Add the copy to the same section
		return await addQuestion(survey, section.id, copy);
	}
}

/**
 * reorderSectionQuestions() - Reorder questions within a section
 * 
 * 🎯 Purpose: Save the new order of questions after drag-and-drop
 * 🔄 Called: After user drags questions to reorder them
 * 
 * Flow:
 * 1. Extract question IDs in current display order
 * 2. Send new order to API
 * 
 * 💡 The UI order is already updated via drag-and-drop
 * This function only persists that order to the backend
 * 
 * @async
 * @param {Object} survey - Survey containing the section
 * @param {Object} section - Section containing questions to reorder
 * @returns {Promise<void>}
 */
async function reorderSectionQuestions(survey, section) {
	// 🛡️ Validation: Ensure we have valid data
	if (!survey || !section) return;
	if (!section.questions?.length) return;

	// 📋 Extract question IDs in display order
	const order = section.questions.map((question) => question.id);

	// 🌐 API Call: Save new order
	await reorderQuestionsApi(
		survey.id,
		section.id,
		order
	);
}

/**
 * ============================================================
 * PUBLISHING
 * ============================================================
 */

/**
 * publishSurvey() - Publish a survey
 * 
 * 🎯 Purpose: Change survey status from Draft to Published
 * 🔄 Called: When user clicks "Publish" in builder
 * 
 * Flow:
 * 1. Call API to publish survey
 * 2. Update local survey status
 * 3. Update survey in main surveys list if present
 * 
 * 💡 Updates are made in-place to maintain reactivity
 * 
 * @async
 * @param {Object} survey - Survey to publish
 * @returns {Promise<Object>} Updated survey from API
 */
async function publishSurvey(survey) {
	// 🌐 API Call: Publish survey
	const updatedSurvey = await publishSurveyApi(survey.id);

	// 🏷️ Transform status
	const status = updatedSurvey.status === "published" ? "Published" : "Draft";

	// 🔄 Update local survey
	survey.status = status;
	survey.updatedAt = updatedSurvey.updatedAt;

	// 🔄 Update in main surveys list if present
	const existing = surveys.find((s) => s.id === survey.id);

	if (existing) {
		existing.status = status;
		existing.updatedAt = updatedSurvey.updatedAt;
	}

	return updatedSurvey;
}

/**
 * ============================================================
 * BULK OPERATIONS
 * ============================================================
 */

/**
 * saveAllQuestions() - Save all questions in a survey
 * 
 * 🎯 Purpose: Bulk save all questions at once
 * 🔄 Called: Before publishing or when saving all changes
 * 
 * Flow:
 * 1. Loop through all sections
 * 2. Loop through all questions
 * 3. Update each question individually
 * 
 * 💡 Sequential saves to avoid overwhelming the API
 * Could be parallelized with Promise.all() for better performance
 * 
 * @async
 * @param {Object} survey - Survey containing questions to save
 * @returns {Promise<void>}
 */
async function saveAllQuestions(survey) {
	// 🔄 Loop through all sections
	for (const section of survey.sections) {
		// 🔄 Loop through all questions in section
		for (const question of section.questions) {
			// 💾 Save each question individually
			await updateQuestion(survey, question);
		}
	}
}

// ============================================================
// 6. RESPONSE OPERATIONS
// ============================================================

/**
 * getResponses() - Fetch all responses for a survey
 * 
 * 🎯 Purpose: Get survey response data
 * 🔄 Called: When viewing survey results/responses
 * 
 * @async
 * @param {string} surveyId - Survey ID to fetch responses for
 * @returns {Promise<Array>} Survey responses
 */
async function getResponses(surveyId) {
	return await fetchResponses(surveyId);
}

/**
 * getSurveyWithResponses() - Fetch survey with its responses
 * 
 * 🎯 Purpose: Get complete survey data with responses
 * 🔄 Called: When viewing survey analytics or results
 * 
 * 💡 Uses Promise.all() for parallel fetching
 * This is faster than sequential fetching
 * 
 * @async
 * @param {string} surveyId - Survey ID to fetch
 * @returns {Promise<Object>} Survey and its responses
 */
async function getSurveyWithResponses(surveyId) {
	// ⚡ Parallel fetching for better performance
	const [survey, responses] = await Promise.all([
		getSurvey(surveyId),      // 📋 Fetch survey with sections/questions
		fetchResponses(surveyId), // 📊 Fetch responses
	]);

	return {
		survey,
		responses,
	};
}

// ============================================================
// 7. DRAFT MANAGEMENT
// ============================================================

/**
 * saveDraft() - Save survey to draft store
 * 
 * 🎯 Purpose: Preserve unsaved changes across navigation
 * 🔄 Called: Whenever survey data changes
 * 
 * 💡 Deep Clone: JSON.parse(JSON.stringify()) creates a complete copy
 * This prevents the draft from being mutated by reference
 * 
 * Why deep clone?
 * Without it: const draft = survey creates a reference
 * Changes to draft would also change the original survey!
 * 
 * @param {Object} survey - Survey to save as draft
 * @returns {void}
 */
function saveDraft(survey) {
	if (survey) {
		// 📦 Deep clone to prevent mutations
		// JSON.stringify() converts to JSON string
		// JSON.parse() converts back to object
		// Result: Completely new object with no references
		draftStore.set(JSON.parse(JSON.stringify(survey)));
	}
}

/**
 * clearDraft() - Clear the draft store
 * 
 * 🎯 Purpose: Remove draft after saving/publishing
 * 🔄 Called: After successful save or publish
 * 
 * @returns {void}
 */
function clearDraft() {
	draftStore.set(null);
}

// ============================================================
// 8. PUBLIC API - Exported for Components
// ============================================================

/**
 * useSurveys() - Main hook/function to access survey functionality
 * 
 * 🎯 Purpose: Provide a clean API for components
 * 🔄 Called: In components via import
 * 
 * 💡 This is the only exported function from this module
 * All other functions and state are only accessible through this
 * 
 * USAGE IN COMPONENTS:
 * ```javascript
 * import { useSurveys } from '$lib/stores/surveys.svelte.js';
 * 
 * const { surveys, load, addSurvey, deleteSurvey } = useSurveys();
 * 
 * onMount(() => {
 *   load();
 * });
 * ```
 * 
 * @returns {Object} All surveys, functions, and state
 */
export function useSurveys() {
	return {
		// ============================================================
		// REACTIVE STATE
		// ============================================================
		
		/**
		 * surveys - Array of all surveys (reactive)
		 * 🔄 UI updates when this changes
		 * 📋 Read-only in component - use functions to modify
		 */
		surveys,

		// ============================================================
		// CORE FUNCTIONS
		// ============================================================
		
		/** load() - Load all surveys from API */
		load,
		
		/** save() - Placeholder for future use */
		save,

		// ============================================================
		// SURVEY CRUD
		// ============================================================
		
		/** getSurvey() - Get single survey with sections/questions */
		getSurvey,
		
		/** addSurvey() - Create new survey */
		addSurvey,
		
		/** deleteSurvey() - Delete survey */
		deleteSurvey,

		// ============================================================
		// SECTION OPERATIONS
		// ============================================================
		
		/** addSection() - Add section to survey */
		addSection,
		
		/** updateSection() - Update section */
		updateSection,
		
		/** deleteSection() - Delete section */
		deleteSection,

		// ============================================================
		// QUESTION OPERATIONS
		// ============================================================
		
		/** addQuestion() - Add question to section */
		addQuestion,
		
		/** updateQuestion() - Update question */
		updateQuestion,
		
		/** deleteQuestion() - Delete question */
		deleteQuestion,
		
		/** duplicateQuestion() - Duplicate question */
		duplicateQuestion,
		
		/** reorderSectionQuestions() - Reorder questions */
		reorderSectionQuestions,

		// ============================================================
		// PUBLISHING
		// ============================================================
		
		/** publishSurvey() - Publish survey */
		publishSurvey,

		// ============================================================
		// RESPONSES
		// ============================================================
		
		/** getResponses() - Get survey responses */
		getResponses,
		
		/** getSurveyWithResponses() - Get survey with responses */
		getSurveyWithResponses,

		// ============================================================
		// BULK OPERATIONS
		// ============================================================
		
		/** saveAllQuestions() - Save all questions */
		saveAllQuestions,

		// ============================================================
		// DRAFT MANAGEMENT
		// ============================================================
		
		/** draftStore - Svelte store for drafts */
		draftStore,
		
		/** saveDraft() - Save draft */
		saveDraft,
		
		/** clearDraft() - Clear draft */
		clearDraft,
	};
}

/**
 * ============================================================
 * DATA FLOW SUMMARY
 * ============================================================
 * 
 * 1. COMPONENT CALLS useSurveys()
 * 2. COMPONENT CALLS load() on mount
 * 3. load() FETCHES data from API
 * 4. data is TRANSFORMED to display format
 * 5. surveys array is UPDATED (reactive)
 * 6. UI automatically RE-RENDERS with new data
 * 
 * MUTATIONS:
 * 1. COMPONENT calls function (e.g., addSurvey())
 * 2. Function CALLS API
 * 3. Function UPDATES surveys array
 * 4. UI automatically UPDATES
 * 
 * DRAFT FLOW:
 * 1. User makes changes
 * 2. saveDraft() is called
 * 3. survey is DEEP CLONED
 * 4. draftStore is UPDATED
 * 5. Draft persists across navigation
 * 
 * ============================================================
 * BEST PRACTICES
 * ============================================================
 * 
 * ✅ Use $state() for reactive data
 * ✅ Use splice/push/unshift for array mutations
 * ✅ Use browser check for SSR safety
 * ✅ Use nullish coalescing (??) for defaults
 * ✅ Deep clone before saving to stores
 * ✅ Use Promise.all() for parallel fetches
 * ✅ Return early for validation checks
 * ✅ Use descriptive function and variable names
 * 
 * ❌ Don't reassign $state() variables (breaks reactivity)
 * ❌ Don't make API calls during SSR without checking
 * ❌ Don't mutate objects without cloning if needed
 * ❌ Don't use nested loops without performance consideration
 * 
 * ============================================================
 */