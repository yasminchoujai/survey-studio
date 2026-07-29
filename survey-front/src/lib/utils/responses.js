export function getAnswer(response, questionId) {
	if (!response) return undefined;

	if (Array.isArray(response.answers)) {
		return response.answers.find(
			(answer) => answer.questionId === questionId
		)?.value;
	}

	if (response.answers && typeof response.answers === 'object') {
		return response.answers[questionId];
	}

	return undefined;
}


export function isAnswered(value) {
	if (value === undefined || value === null) return false;
	if (Array.isArray(value)) return value.length > 0;
	if (typeof value === 'string') return value.trim().length > 0;
	return true;
}

export function formatAnswer(question, value) {
	if (!isAnswered(value)) return null;

	if (question.type === 'multiple_choice' && Array.isArray(value)) {
		return value;
	}

	if (question.type === 'rating') {
		return `${value} / 5`;
	}

	return String(value);
}