const vscode = require('vscode');


function showInformationWithProgressAndTimeout(message, timeMilliSeconds) {
	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: message,
		cancellable: false,
	}, async (progress, token) => {
		// Simulate a task that takes 5 seconds
		for (let i = 0; i < 50; i++) {
			if (token.isCancellationRequested) {
				// Task canceled, stop updating progress
				return;
			}

			// Update progress every 100 milliseconds
			await new Promise(resolve => setTimeout(resolve, timeMilliSeconds));
			progress.report({ increment: 2 });
		}

		// After 5 seconds, the progress will be automatically dismissed
	});
}



module.exports = {
	showInformationWithProgressAndTimeout
};