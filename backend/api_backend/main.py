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
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import face_recognition
from scipy.spatial import distance

# add logging to the app
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Status(Enum):
    SLEEPING = 0
    AWAKE = 1


# Initialize FastAPI
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this later for security)
    allow_credentials=True,
    allow_methods=["POST"],  # Allow only POST requests (POST)
    allow_headers=["*"],  # Allow all headers
)


# Load your model here

class ImageData(BaseModel):
    image: str

def process(image_data: str):
    # Decode base64 image
    img_data = base64.b64decode(image_data.split(',')[1])
    #image = cv2.cvtColor(img_data, cv2.COLOR_BGR2RGB)
    #image = cv2.imread(img_data)
    # Preprocess image (resize, normalize, etc. based on model)
    #image = cv2.resize(image, (640, 480))  #Resize the image
    np_arr = np.frombuffer(img_data, np.uint8)
    
    # Decode image using OpenCV
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    # Preprocess image (resize, normalize, etc. based on model)
    image = cv2.resize(image, (640, 480))  # Resize the image#
    #image = np.array(image) / 255.0  # Normalize to [0, 1]
    #image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image


@app.post("/predict")
async def predict(data: ImageData):
    image = process(data.image)
    print(type(image))
    try:
        
        eye_flag, mouth_flag = drowsydetector.process_image(image)
        print(type(image), eye_flag, mouth_flag)
        if eye_flag and mouth_flag:
            return {"status": Status.SLEEPING.value}
        else:
            return {"status": Status.AWAKE.value}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error processing the image")

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=5000)
