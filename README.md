Kemper Midi Setlist Fixer
-------------------------

When a Kemper Profiler is midi controlled in Performance Mode songs are selected by index (CC47). This is a pain when your setlist changes a lot because you need to change all the song-selecting commands. This is an attempt at creating a tool to ease or even automate that process.

# The plan
- Save your control commands to .mid files (one file per song)
- Use the tool to update the order of songs in de .mid files
- Most DAWs will load the .mid files from disc and output the updated midi commands

# To-do
- ~~Proof of concept~~
- Provide UI for the setlist order
- Investigate automation (retrieve setlist from Kemper via USB?)
