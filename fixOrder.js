const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const MIDIFile = require('midifile');
const MIDIEvents = require("midievents");
const arrayBufferToBuffer = require('arraybuffer-to-buffer');

const inputFolder = './input/';
const outputFolder = './output/';
const backupFolder = './backup/';
const songs = [
    '--ignore--',
    '--ignore--',
    '--ignore--',
    'Down in flames',
    'The Man',
    'Let it go',
    'Leave it',
    'The Road',
    'Today',
    'Breaking out',
    'June',
    'Climb back 20',
    'Dark Nights',
    'Crush',
    'Empty Sidewalks',
];

songs.forEach(fixOrder);

function fixOrder(songName, index) {
    const fileName = `${songName}.mid`;
    const path = `${inputFolder}${fileName}`;
    if (!fs.existsSync(path)) {
        console.log(`No file for ${songName}`);
        return;
    }

    createBackup(fileName);

    const midiFile = getMidiFile(path);
    const { events, previousIndex } = changeSongIndex(midiFile.getTrackEvents(0), index);
    midiFile.setTrackEvents(0, events);

    console.log(`Changed index from ${previousIndex} to ${index} for "${songName}"`);
    writeMidiFile(fileName, midiFile);
}

function getMidiFile(path) {
    const inputBuffer = fs.readFileSync(path);
    const inputArrayBuffer = new Uint8Array(inputBuffer).buffer
    return new MIDIFile(inputArrayBuffer);
}

function createBackup(fileName) {
    const dateString = (new Date()).toISOString().replace(/\D+/g, '_')
    fs.copySync(`${inputFolder}${fileName}`, `${backupFolder}${dateString}${fileName}`);
}

// Has sideeffects, yolo
function changeSongIndex(events, index) {
    let previousIndex;
    events.map(event => {
        if(event.type === MIDIEvents.EVENT_MIDI && event.subtype === MIDIEvents.EVENT_MIDI_CONTROLLER){
            if (event.param1 === 47) {
                previousIndex = event.param2;
                event.param2 = index;
            }
        }
        return event;
    });
    return { events, previousIndex };
}

function writeMidiFile(fileName, midiFile) {
    const outputArrayBuffer = midiFile.getContent();
    mkdirp.sync(outputFolder);
    fs.writeFileSync(`${outputFolder}${fileName}`, arrayBufferToBuffer(outputArrayBuffer));
}
