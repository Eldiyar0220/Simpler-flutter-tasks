const vscode = require('vscode');

const PROGRESS_STEPS = 50;

/**
 * Shows a self-dismissing notification with a progress bar.
 * The notification stays for roughly `stepMs * 50` milliseconds.
 */
function showTimedNotification(message, stepMs) {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: message,
        cancellable: false,
    }, async (progress, token) => {
        for (let i = 0; i < PROGRESS_STEPS; i++) {
            if (token.isCancellationRequested) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, stepMs));
            progress.report({ increment: 100 / PROGRESS_STEPS });
        }
    });
}

module.exports = {
    showTimedNotification,
};
