from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from io import BytesIO
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import uvicorn
import logging
from enum import Enum
import drowsydetector
import cv2
import matplotlib.pyplot as plt
import face_recognition
from scipy.spatial import distance

# add logging to the app
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)


class Status(Enum):
    SLEEPING = 1
    AWAKE = 0


# Initialize FastAPI
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this later for security)
    allow_credentials=True,
    allow_methods=["POST"],  # Allow only POST requests (POST)
    allow_headers=["*"],  # Allow all headers
)

class ImageData(BaseModel):
    image: str

def process(image_data: str):
    # Decode base64 image and convert 
    img_data = base64.b64decode(image_data.split(',')[1])
    np_arr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    image = cv2.resize(image, (640, 480))  # Resize the image#
    return image


@app.post("/predict")
async def predict(data: ImageData):
    image = process(data.image)
    #print(type(image))
    try:
        eye_flag, mouth_flag = drowsydetector.process_image(image)
        #print(type(image), eye_flag, mouth_flag)
        if eye_flag and mouth_flag:
            return {"status": Status.SLEEPING.value}
        else:
            return {"status": Status.AWAKE.value}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error processing the image")

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=5001)
