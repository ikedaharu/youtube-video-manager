from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from typing import List, Optional
from datetime import datetime
import logging
import httpx
from fastapi import HTTPException


app = FastAPI()

# ロガーの設定
logging.basicConfig(level=logging.INFO)  # デフォルトはINFOレベルでデバッグ時のみ DEBUG レベルに変更する
logger = logging.getLogger(__name__)


# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# YouTube API の設定
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")  # 環境変数からAPIキーを取得

YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3"

class VideoInfo(BaseModel):
    title: str
    url: str
    published_at: str
    channel_title: str

async def get_video_info(video_url: str) -> VideoInfo:
    # URLからビデオIDを抽出
    video_id = video_url.split("v=")[-1].split("&")[0]
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{YOUTUBE_API_URL}/videos",
            params={
                "part": "snippet",
                "id": video_id,
                "key": YOUTUBE_API_KEY
            }
        )
        
        # デバッグ用のロギング
        logger.debug("Response status code: %s", response.status_code)
        logger.debug("Response JSON: %s", response.json())
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch video info")
            
        data = response.json()
        if not data["items"]:
            raise HTTPException(status_code=404, detail="Video not found")
            
        video_data = data["items"][0]["snippet"]
        
        return VideoInfo(
            title=video_data["title"],
            url=video_url,
            published_at=video_data["publishedAt"],
            channel_title=video_data["channelTitle"]
        )

@app.post("/api/video-info")
async def fetch_video_info(video_url: str):
    return await get_video_info(video_url)