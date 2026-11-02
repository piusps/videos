#!/bin/zsh
# Stage A for one run: wait for HeyGen render (read-only status API), download avatar + srt,
# raw whisper check, silence cut (0.35/0.1), word captions against script, skin filter + 1 s hold,
# face focus. Usage: scripts/stage-a-run.sh <run> <video_id> <target relative to public/, e.g. fpn-x/tightened-skin.mp4>
set -e
cd "/Users/pius/LinkedIn Generator/broll"
RUN=runs/$1; VID=$2; PUB=public/$3
FF=node_modules/ffmpeg-static/ffmpeg
K=$(grep '^HEYGEN_API_KEY=' .env | cut -d= -f2-)
while true; do
  J=$(curl -s -H "X-Api-Key: $K" "https://api.heygen.com/v3/videos/$VID")
  print -r -- "$J" | grep -q '"status"' || J=$(curl -s -H "X-Api-Key: $K" "https://api.heygen.com/v1/video_status.get?video_id=$VID")
  ST=$(print -r -- "$J" | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["status"])' 2>/dev/null || echo pending)
  [ "$ST" = completed ] && break
  [ "$ST" = failed ] && { echo "FAILED $J"; exit 1; }
  sleep 20
done
print -r -- "$J" > $RUN/heygen-status.json
URL=$(print -r -- "$J" | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["video_url"])')
SRT=$(print -r -- "$J" | python3 -c 'import sys,json;d=json.load(sys.stdin)["data"];print(d.get("caption_url") or d.get("subtitle_url") or "")')
curl -s -o $RUN/avatar.mp4 "$URL"
[ -n "$SRT" ] && curl -s -o $RUN/avatar.srt "$SRT" || true
$FF -v error -y -i $RUN/avatar.mp4 -ar 16000 -ac 1 $RUN/raw16.wav
whisper.cpp/build/bin/whisper-cli -m whisper.cpp/ggml-medium.bin -l de -mc 0 -f $RUN/raw16.wav -nt 2>/dev/null > $RUN/rawcheck.txt
node scripts/silence-cut.mjs --in $RUN/avatar.mp4 --out $RUN/tightened.mp4 --json $RUN/keep.json --min-silence 0.35 --pad 0.1
node scripts/transcribe.mjs --in $RUN/tightened.mp4 --out $RUN/captions.json --script $RUN/script.txt
mkdir -p "$(dirname $PUB)"
$FF -v error -y -i $RUN/tightened.mp4 -vf "colortemperature=temperature=6800:pl=1,colorbalance=rm=-0.05:rh=-0.04:bm=0.015,huesaturation=saturation=-0.10:colors=r,tpad=stop_mode=clone:stop_duration=1" -af "apad=pad_dur=1" -c:v libx264 -crf 12 -preset medium -c:a aac -b:a 256k $PUB
python3 scripts/facecheck/facefocus.py $RUN/tightened.mp4 0.52 > $RUN/facefocus.txt 2>&1 || true
echo STAGE_A_OK $1
