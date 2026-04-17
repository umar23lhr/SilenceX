/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Premiere Pro ExtendScript logic for Silence Remover
// This file runs in the ExtendScript (host) environment.

/**
 * Perform ripple deletes based on silent intervals.
 * Intervals should be in seconds.
 * 
 * @param {Array<{start: number, end: number}>} intervals - List of silent ranges.
 */
function removeSilence(intervalsJSON) {
  try {
    var intervals = JSON.parse(intervalsJSON);
    var activeSequence = app.project.activeSequence;
    
    if (!activeSequence) {
      return "No active sequence found.";
    }

    // Sort intervals by start time in descending order (backwards)
    // This is CRITICAL because ripple deletes shift the timeline content.
    // By working from end to start, the timestamps of earlier clips remain valid.
    intervals.sort(function(a, b) {
      return b.start - a.start;
    });

    for (var i = 0; i < intervals.length; i++) {
        var silence = intervals[i];
        
        // Convert seconds to Time objects
        var startTick = activeSequence.getInPoint(); // Just a reference, we'll set our own
        var endTick = activeSequence.getOutPoint();

        // Premiere Pro uses "Ticks" or seconds-based decimals.
        // For precision, we can use the Ticks per second (254,016,000,000).
        // Or simply set the CTI and perform extracts.
        
        var startTimeStr = silence.start.toString();
        var endTimeStr = silence.end.toString();

        // Perform the ripple delete (Extract)
        // extract(startTime, endTime, ignoreLockedTracks, rippleDelete, tracksToExtract)
        // In UXP, we often use the higher-level automation methods.
        
        activeSequence.setInPoint(startTimeStr);
        activeSequence.setOutPoint(endTimeStr);
        activeSequence.extract(); 
    }

    return "Successfully removed " + intervals.length + " silent segments.";
  } catch (err) {
    return "Error: " + err.message;
  }
}

/**
 * Export current sequence audio to a temporary location.
 * 
 * @param {string} tempPath - File path to save the .wav.
 */
function exportAudioToPath(tempPath) {
    var activeSequence = app.project.activeSequence;
    if (!activeSequence) return "No active sequence.";

    var presetPath = "C:\\Program Files\\Adobe\\Adobe Media Encoder 2024\\Presets\\System Presets\\Audio Only\\Waveform Audio.epr"; 
    // Note: Preset paths can vary. For a real plugin, you'd include a .epr in your assets.
    
    var jobID = app.encoder.encodeSequence(
        activeSequence,
        tempPath,
        presetPath,
        app.encoder.ENCODE_ENTIRE,
        1 // Remove from queue when done
    );
    
    return jobID;
}

// Global scope registration for UXP exposure
$.global.removeSilence = removeSilence;
$.global.exportAudioToPath = exportAudioToPath;
