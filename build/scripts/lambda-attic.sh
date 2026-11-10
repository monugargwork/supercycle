#!/bin/bash
# Render the attic reel on Remotion Lambda (run from the project folder on the Mac, after `npm i`).
# Needs REMOTION_AWS_ACCESS_KEY_ID / REMOTION_AWS_SECRET_ACCESS_KEY in a .env file or the shell (see README_RENDER.md).
set -e
REGION=${REGION:-ap-south-1}
# 1. the render function (once per Remotion version; re-running is harmless)
npx remotion lambda functions deploy --region=$REGION --memory=3009 --disk=10240 --timeout=900
# 2. upload the project (re-run after every code change)
npx remotion lambda sites create src/index.ts --site-name=attic-reel --region=$REGION
# 3. render: 1440x2560, captions burned in, software WebGL (Lambda has no GPU)
npx remotion lambda render attic-reel AtticReel --region=$REGION \
  --props='{"captions":true}' --scale=1.3333 --codec=h264 --crf=16 \
  --gl=swangle --timeout=120000 --frames-per-lambda=40 \
  --out-name="attic-v1.mp4" "out/Attic v1.mp4"
# the mp4 lands in out/ (and stays in your S3 bucket; delete it there when done to avoid storage cost)
