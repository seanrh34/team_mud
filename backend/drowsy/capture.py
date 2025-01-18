import cv2
import os
from datetime import datetime

def capture_webcam():
    # Open a connection to the webcam (0 is the default camera)
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()

        if not ret:
            print("Error: Could not read frame.")
            break

        # Display the resulting frame
        cv2.imshow('Webcam', frame)

        # Check for key presses
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('c'):
            # Save the snapshot
            filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".png"
            cv2.imwrite(filename, frame)
            print(f"Snapshot saved as {filename}")

    # When everything is done, release the capture
    cap.release()
    cv2.destroyAllWindows()

# Call the function to start capturing from the webcam
capture_webcam()