/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// FFmpeg logic for UXP context. 
// Uses Adobe UXP's plugin.launchProcess if available,
// or a standard exec if running in pure Node.

/**
 * Executes FFmpeg silencedetect filter and parses findings.
 * 
 * @param {string} audioPath - Path to the exported .wav file.
 * @param {number} threshold - dB threshold for silence (e.g. -30).
 * @param {number} minDuration - Minimum silence duration in ms.
 * @returns {Promise<Array<{start: number, end: number}>>} - List of seconds.
 */
export async function detectSilence(audioPath: string, threshold: number, minDuration: number): Promise<any[]> {
    const minDurSec = minDuration / 1000;
    
    // Command: ffmpeg -i input.wav -af silencedetect=noise=-30dB:duration=2 -f null -
    const cmd = `ffmpeg -i "${audioPath}" -af silencedetect=noise=${threshold}dB:d=${minDurSec} -f null -`;
    
    return new Promise((resolve, reject) => {
        // In UXP, we'd use plugin.launchProcess via the host.
        // For this example, we mock the execution and the parser logic.
        
        const shell = (window as any).plugin?.launchProcess; 
        
        if (!shell) {
            // Simulated response for UI testing in browser
            return resolve([
                { start: 1.2, end: 4.5 },
                { start: 10.1, end: 12.4 },
                { start: 25.8, end: 32.1 }
            ]);
        }
        
        shell(cmd, (err: any, stdout: string, stderr: string) => {
            if (err) return reject(err);
            
            // FFmpeg prints silencedetect output to stderr
            const patterns = parseFFmpegOutput(stderr || stdout);
            resolve(patterns);
        });
    });
}

/**
 * Parser for FFmpeg silencedetect output.
 * Looking for:
 * [silencedetect @ 0x...] silence_start: 1.234
 * [silencedetect @ 0x...] silence_end: 5.678 | silence_duration: 4.444
 */
function parseFFmpegOutput(output: string): Array<{start: number, end: number}> {
    const segments: Array<{start: number, end: number}> = [];
    
    const startRegex = /silence_start: (\d+\.?\d*)/g;
    const endRegex = /silence_end: (\d+\.?\d*)/g;
    
    let startMatch;
    let endMatch;
    
    // Extract all starts and ends
    const starts: number[] = [];
    const ends: number[] = [];
    
    while ((startMatch = startRegex.exec(output)) !== null) {
        starts.push(parseFloat(startMatch[1]));
    }
    
    while ((endMatch = endRegex.exec(output)) !== null) {
        ends.push(parseFloat(endMatch[1]));
    }
    
    // Match them up into pairs
    for (let i = 0; i < starts.length && i < ends.length; i++) {
        segments.push({
            start: starts[i],
            end: ends[i]
        });
    }
    
    return segments;
}
