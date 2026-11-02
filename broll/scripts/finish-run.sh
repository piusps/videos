#!/bin/zsh
# Finish chain: wait for raw.mp4 render, 1.1x, music bed 0.15 + sfx.json, loudnorm -14, upload encode <10 MB, cover.
# Usage: [MUSVOL=0.11] scripts/finish-run.sh <run> <music.mp3> <entry-pattern>   (FP-N: MUSVOL=0.11)
set -e
cd "/Users/pius/LinkedIn Generator/broll"
R=runs/$1; MUS=$2; PAT=$3
FF=node_modules/ffmpeg-static/ffmpeg
while pgrep -f "remotion render.*$PAT" >/dev/null; do sleep 5; done
test -s $R/raw.mp4 || { echo "FEHLT: $R/raw.mp4"; exit 1; }
node scripts/speed-ramp.mjs --in $R/raw.mp4 --out $R/sped.mp4 --factor 1.1
DUR=$($FF -i $R/sped.mp4 2>&1 | grep Duration | sed -E "s/.*Duration: ([0-9:.]+).*/\1/" | awk -F: "{print \$1*3600+\$2*60+\$3}")
node scripts/prepare-music.mjs --in "$MUS" --out $R/bed.m4a --duration $DUR
node scripts/mux-music.mjs --video $R/sped.mp4 --out $R/mux.mp4 --music $R/bed.m4a --music-volume ${MUSVOL:-0.15} --sfx $R/sfx.json
$FF -v error -y -i $R/mux.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=9" -ar 48000 -c:a aac -b:a 256k $R/$1-final.mp4
mkdir -p $R/upload
$FF -v error -y -i $R/$1-final.mp4 -c:v libx264 -preset slow -crf 21 -maxrate 2300k -bufsize 4600k -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $R/upload/$1.mp4
$FF -v error -y -i $R/$1-final.mp4 -frames:v 1 -q:v 2 $R/upload/cover.jpg
echo FINISH_OK
