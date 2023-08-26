import cv2 as cv
import numpy as np
from PIL import Image
from io import BytesIO
import requests
import random
import os

incremental = 0

def openImage(path):
    image = cv.imread(path)

    return image

def showImage(image):
    cv.imshow('Original image', image)
    cv.waitKey(0)
    cv.destroyAllWindows()

def resizeCat(original, cat, ratio):
    ori_shape = original.shape
    ori_width = ori_shape[0]
    ori_height = ori_shape[1]
    min_origin = min(ori_width, ori_height)
    aspect_ratio = cat.shape[0]/cat.shape[1]
    resizedCat = cv.resize(cat, (round(min_origin * ratio), round(min_origin * ratio * aspect_ratio)))
    return resizedCat


def overlay_image_alpha(img, img_overlay, x, y, alpha_mask):
    """Overlay `img_overlay` onto `img` at (x, y) and blend using `alpha_mask`.

    `alpha_mask` must have same HxW as `img_overlay` and values in range [0, 1].
    """
    # Image ranges
    y1, y2 = max(0, y), min(img.shape[0], y + img_overlay.shape[0])
    x1, x2 = max(0, x), min(img.shape[1], x + img_overlay.shape[1])

    # Overlay ranges
    y1o, y2o = max(0, -y), min(img_overlay.shape[0], img.shape[0] - y)
    x1o, x2o = max(0, -x), min(img_overlay.shape[1], img.shape[1] - x)

    # Exit if nothing to do
    if y1 >= y2 or x1 >= x2 or y1o >= y2o or x1o >= x2o:
        return

    # Blend overlay within the determined ranges
    img_crop = img[y1:y2, x1:x2]
    img_overlay_crop = img_overlay[y1o:y2o, x1o:x2o]
    alpha = alpha_mask[y1o:y2o, x1o:x2o, np.newaxis]
    alpha_inv = 1.0 - alpha

    img_crop[:] = alpha * img_overlay_crop + alpha_inv * img_crop

def overlayFlow(img, img_overlay_rgba):
    x, y = 10, 10
    img = cv.cvtColor(img, cv.COLOR_RGB2RGBA).copy()
    img_overlay_rgba = cv.cvtColor(img_overlay_rgba, cv.COLOR_RGB2RGBA).copy()
    img_overlay_rgba = resizeCat(img, img_overlay_rgba, 1)

    # Perform blending
    alpha_mask = img_overlay_rgba[:, :, 3] / 255.0
    img_result = img[:, :, :3].copy()
    img_overlay = img_overlay_rgba[:, :, :3]
    overlay_image_alpha(img_result, img_overlay, x, y, alpha_mask)

    # Save result
    # Image.fromarray(img_result).save("img_result3.jpg")
    global incremental
    img_name = str(incremental) + ".jpg"
    incremental += 1
    savePath = "static/" + img_name
    Image.fromarray(img_result).save(savePath)
    return savePath

def downloadImg(url):
    # url -->content --> wrap it for BytesIO --> open as Image and then convert
    img = Image.open(BytesIO(requests.get(url).content)).convert("RGB")
    img = np.array(img)
    return img

def findRandomCat():
    list = os.listdir('static/cropped')
    return 'static/cropped/' + list[random.randint(0, len(list) - 1)]

def downloadImgs(urls):
    file_paths = []
    script_dir = os.path.dirname(__file__)
    # url -->content --> wrap it for BytesIO --> open as Image and then convert
    for url in urls:
        image = downloadImg(url)
        cat_url = findRandomCat()
        abs_file_path = os.path.join(script_dir, cat_url)
        random_cat = np.array(Image.open(abs_file_path))
        file_path = overlayFlow(image,random_cat)
        file_paths.append(file_path)
    return file_paths

if __name__ == '__main__':
    downloadImgs(['https://i.ytimg.com/vi/L45Ua8weKqs/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC9XUQUbDSSoNC2SwmU10yn5tbCLQ'])
