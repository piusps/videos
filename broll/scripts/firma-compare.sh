#!/bin/bash
# Vergleich-Brett: reference video frames (left) vs engine style frames (right), same frame numbers.
# usage: scripts/firma-compare.sh <reference.mp4> <tag-run-dir e.g. runs/firma-ep/tag1> "55 79 120 ..."
set -e
cd "$(dirname "$0")/.."
FF=node_modules/ffmpeg-static/ffmpeg
FONT=/System/Library/Fonts/Helvetica.ttc
REF="$1"; RUN="$2"; FR="$3"
W="$RUN/compare"; mkdir -p "$W"; rm -f "$W"/*
i=0
for f in $FR; do
  e=$(ls "$RUN"/style-frames/sf-$(printf %04d "$f")-*.png | head -1)
  "$FF" -y -loglevel error -i "$REF" -vf "select=eq(n\,$f)" -frames:v 1 "$W/ref-$f.png"
  "$FF" -y -loglevel error -i "$W/ref-$f.png" -i "$e" -filter_complex \
    "[0]scale=300:-1,drawtext=fontfile=$FONT:text='v7 $f':x=6:y=6:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6[a];[1]scale=300:-1,drawtext=fontfile=$FONT:text='engine $f':x=6:y=6:fontsize=20:fontcolor=white:box=1:boxcolor=0xE8762C@0.85[b];[a][b]hstack,pad=iw+12:ih+12:6:6:color=white" \
    "$W/pair-$(printf %02d $i).png"
  i=$((i+1))
done
n=$i; cols=4
inputs=(); L=""; lay=""
for k in $(seq 0 $((n-1))); do
  inputs+=(-i "$W/pair-$(printf %02d $k).png"); L="$L[$k]"
  lay="$lay|$(( (k%cols)*612 ))_$(( (k/cols)*545 ))"
done
"$FF" -y -loglevel error "${inputs[@]}" -filter_complex "${L}xstack=inputs=$n:layout=${lay#|}:fill=white" -frames:v 1 -q:v 3 "$RUN/vergleich-v7-engine.jpg"
echo "$RUN/vergleich-v7-engine.jpg"
