from drowsydetector import *

def main():
    # video_path = "test.mp4"
    # video_cap = cv2.VideoCapture(video_path)
    
    video_cap = cv2.VideoCapture(0) # for getting frames from the webcam
    
    count = score = 0

    while True:
        success, image = video_cap.read()
        if not success:
            break

        image = cv2.resize(image, (800, 500))

        count += 1
        # process every nth frame
        n = 5
        if count % n == 0:
            eye_flag, mouth_flag = process_image(image)
            # if any flag is true, increment the score
            # if eye_flag or mouth_flag:
            #     score += 1
            # else:
            #     score -= 1
            #     if score < 0:
            #         score = 0z
            if eye_flag and mouth_flag:
                score += 1
            else:
                score -= 1
                if score < 0:
                    score = 0

        # write the score values at bottom left of the image
        font = cv2.FONT_HERSHEY_SIMPLEX
        text_x = 10
        text_y = image.shape[0] - 10
        text = f"Score: {score}"
        cv2.putText(image, text, (text_x, text_y), font, 1, (0, 255, 0), 2, cv2.LINE_AA)

        if score >= 30:
            text_x = image.shape[1] - 300
            text_y = 40
            text = "STOP SNOOZING"
            cv2.putText(image, text, (text_x, text_y), font, 1, (0, 0, 255), 2, cv2.LINE_AA)

        cv2.imshow('drowsiness detection', image)

        # exit if any key is pressed
        if cv2.waitKey(1) & 0xFF != 255:
            break

    video_cap.release()
    cv2.destroyAllWindows()

img_path = '20250118_140516.png'
# highlight_facial_points(img_path)

img = cv2.imread(img_path)
# process_image(img)

# output: eye_flag, mouth_flag
# eye_flag - true if eyes are closed, false otherwise
# mouth_flag - true if mouth is open (yawning), false otherwise

main()