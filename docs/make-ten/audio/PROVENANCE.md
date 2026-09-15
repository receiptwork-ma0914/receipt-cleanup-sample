# Prerecorded learning prompts

Generated locally on September 14, 2026 EDT / September 15 UTC for the two original educational prototypes. No hosted TTS service, account, paid voice, macOS voice, voice clone or runtime speech dependency was used.

## Ready-to-bundle files

| Set | Contents | WAV total | MP3 total | Speech duration |
|---|---:|---:|---:|---:|
| `age3/` | 12 prompt clips, each WAV and MP3 | 1,946,400 bytes | 362,256 bytes | 44.12 seconds |
| `age6/` | 17 prompt clips, each WAV and MP3 | 3,387,558 bytes | 627,662 bytes | 76.80 seconds |

Each directory has `manifest.json` with the exact text, filenames, duration, PCM peak, byte counts and SHA-256 checksums. Use either format; MP3 is smaller. Copy the chosen clips into the app's `assets/audio/`. Keep all prompt text visible and handle failed playback with the existing visual fallback. Playback should follow a user gesture. Only one prompt should play at a time; stop it when changing activities.

`age3-prompts.json` contains the exact strings supplied by the age-three app builder. `age6-prompts.json` follows the exact main prompts in the age-six builder's `content.js` and `app.js`, including the two-step final activity. Age-six recordings cover the main instructions, not every title, hint, feedback message or dynamically generated count.

## Engine and source

- **Engine:** eSpeak NG **1.52.0**, compiled locally from its official release source.
- **Source archive:** https://github.com/espeak-ng/espeak-ng/archive/refs/tags/1.52.0.tar.gz
- **Archive SHA-256:** `bb4338102ff3b49a81423da8a1a158b420124b055b60fa76cfb4b18677130a23`.
- **Local executable SHA-256:** `2ef59be6a8500565e26ba2e8c471d6e77db877f11bd9a0de209323d4d39cae67`.
- **Voice:** built-in `en-us+f3`; 140 words/minute, pitch 60, amplitude 85.
- **Synthesis:** built-in formant engine. MBROLA, speech-player, sound-device output and asynchronous output were disabled. No external voice model was loaded. The build fetched the Sonic dependency pinned by the release at commit `fbf75c3d6d846bad3bb3d456cbc5d07d9fd8c104`.
- **Export:** eSpeak writes 22,050 Hz, mono, signed 16-bit PCM WAV. Existing local FFmpeg converts that to mono 22,050 Hz MP3 at 64 kbps.
- **Build location:** `tools/` in this task directory; no system installation. Build/configuration logs and a copy of the engine's GPL license are retained under `provenance/`.

## Commercial redistribution assessment

The official [eSpeak NG release README](https://github.com/espeak-ng/espeak-ng/blob/1.52.0/README.md) identifies the project as GPL version 3 or later and describes its formant synthesis and WAV output. [The release license, section 2](https://github.com/espeak-ng/espeak-ng/blob/1.52.0/COPYING) permits running the program and covers output only when that output itself constitutes a covered work. GPL licensing permits commercial use; it is not a noncommercial license.

The [GNU license FAQ on generated output](https://www.gnu.org/licenses/gpl-faq.html.en#GPLOutput) explains that transformed user input generally keeps the input's copyright status, while substantial copied program content can be an exception. These files synthesize the original short prompt text using the built-in formant voice; they do not bundle or link the engine into the web apps. On that basis, the prerecorded speech may be redistributed as app assets, including commercially. This is a source-based assessment of this generation setup, not an additional voice-specific permission statement from the maintainers. No separate restrictive voice-model terms were used or found for this built-in setup.

The original prompts and generator are provided under MIT terms in `LICENSE-original.txt`; generated files are offered on the same permissive terms to the extent copyright exists in them. This does not relicense eSpeak NG or its source. Anyone redistributing the engine itself must follow its GPL terms. The app bundle needs the generated assets and provenance, not this directory's build tools, engine binaries, source archive or third-party sample recordings.

## Regenerate

From the workspace root:

```sh
cmake -S work/learning-audio/tools/espeak-ng-1.52.0 -B work/learning-audio/tools/build -DCMAKE_BUILD_TYPE=Release -DUSE_MBROLA=OFF -DUSE_LIBPCAUDIO=OFF -DUSE_SPEECHPLAYER=OFF -DBUILD_TESTING=OFF -DUSE_ASYNC=OFF
cmake --build work/learning-audio/tools/build --parallel 4
python3 work/learning-audio/generate.py work/learning-audio/age3-prompts.json --output work/learning-audio/age3
python3 work/learning-audio/generate.py work/learning-audio/age6-prompts.json --output work/learning-audio/age6
```

The source archive is retained locally; extract it into `tools/` before building on a new checkout. CMake, a C/C++ compiler, Python 3 and FFmpeg with libmp3lame are needed. The script sets the task-local speech-data path explicitly.

## Verification and limits

All 29 WAV files contain nonzero audio frames, use the expected mono 16-bit format and have nonzero peaks below the clipping limit. All 29 MP3 files decoded to completion with FFmpeg. Exact strings and numerical prompts are preserved in the manifests. No live auditory listening or child usability assessment was performed; this is a clear but synthetic-sounding voice, not natural recorded narration. Test the selected app's playback in the browser before submission. Keep the text fallback regardless of audio availability.
