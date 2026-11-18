#!/usr/bin/env python3
"""Create an original, royalty-free ambient electronic bed for the Gource video.

The soundtrack is synthesized from oscillators in this script; it does not use
samples, loops, or recordings from third parties.
"""

from __future__ import annotations

import argparse
import math
import wave
from array import array
from pathlib import Path

SAMPLE_RATE = 48_000
CHORDS = (
    (48, 55, 60, 64, 67),  # Cmaj9
    (45, 52, 57, 60, 64),  # Am9
    (41, 48, 53, 57, 60),  # Fmaj9
    (43, 50, 55, 59, 62),  # Gmaj9
    (38, 45, 50, 53, 57),  # Dm9
    (43, 50, 55, 60, 64),  # Gsus / Gadd9
)
ARP_PATTERN = (0, 2, 3, 1, 4, 2, 3, 1)


def midi_frequency(note: int) -> float:
    return 440.0 * (2.0 ** ((note - 69) / 12.0))


def create_soundtrack(duration: float, output: Path) -> None:
    if duration <= 7:
        raise ValueError("Video duration must be longer than the 7-second title sequence.")

    total_frames = round(duration * SAMPLE_RATE)
    fade_seconds = min(2.2, duration / 5)
    samples = array("h")

    chord_duration = 4.0
    chord_frequencies = [
        tuple(midi_frequency(note) for note in chord) for chord in CHORDS
    ]

    for frame in range(total_frames):
        time = frame / SAMPLE_RATE
        chord_index = int(time / chord_duration) % len(CHORDS)
        frequencies = chord_frequencies[chord_index]

        # Slow, warm pad with a very quiet octave shimmer.
        pad = 0.0
        for voice, frequency in enumerate(frequencies):
            phase = 2.0 * math.pi * frequency * time
            pad += math.sin(phase + voice * 0.19) * (0.52 if voice < 3 else 0.32)
            pad += math.sin(phase * 2.0) * 0.045

        # A restrained, high-register arpeggio adds motion without competing
        # with the repository visualization.
        beat = time * 1.5
        step = int(beat) % len(ARP_PATTERN)
        step_progress = beat - int(beat)
        arp_note = CHORDS[chord_index][ARP_PATTERN[step]] + 24
        arp_frequency = midi_frequency(arp_note)
        arp_envelope = math.exp(-step_progress * 5.0)
        arp = math.sin(2.0 * math.pi * arp_frequency * time) * arp_envelope * 0.13

        bass_frequency = midi_frequency(CHORDS[chord_index][0] - 12)
        bass = math.sin(2.0 * math.pi * bass_frequency * time) * 0.16

        # Gentle stereo width, with a slow movement in the pad.
        movement = math.sin(2.0 * math.pi * time / 13.0) * 0.08
        left = (pad * 0.115 + arp + bass) * (0.94 + movement)
        right = (pad * 0.115 + arp * 0.92 + bass) * (0.94 - movement)

        fade_in = min(1.0, time / fade_seconds)
        fade_out = min(1.0, (duration - time) / fade_seconds)
        envelope = max(0.0, min(fade_in, fade_out))
        left = max(-0.92, min(0.92, left * envelope))
        right = max(-0.92, min(0.92, right * envelope))

        samples.append(round(left * 32767))
        samples.append(round(right * 32767))

    if samples.itemsize != 2:
        raise RuntimeError("Expected 16-bit audio samples.")

    output.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(output), "wb") as audio_file:
        audio_file.setnchannels(2)
        audio_file.setsampwidth(2)
        audio_file.setframerate(SAMPLE_RATE)
        audio_file.writeframes(samples.tobytes())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--duration", type=float, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    create_soundtrack(args.duration, args.output)
    print(f"Created original ambient soundtrack: {args.output} ({args.duration:.2f}s)")


if __name__ == "__main__":
    main()
