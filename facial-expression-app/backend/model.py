import sys
import base64
import cv2
import numpy as np
from some_emotion_model import EmotionDetector  # Replace with your model

def decode_image(image_data):
    image_bytes = base64.b64decode(image_data.split(",")[1])
    nparr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def main():
    if len(sys.argv) < 2:
        print("Error: No image provided")
        sys.exit(1)

    image_data = sys.argv[1]
    image = decode_image(image_data)

    detector = EmotionDetector()  # Replace with your model class
    emotion = detector.predict(image)  # Replace with your model's prediction method

    print(emotion)

if __name__ == "__main__":
    main()
