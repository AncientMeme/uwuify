import cv2 as cv
import numpy as np

from PIL import Image


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
    aspect_ratio = cat.shape[1]/cat.shape[0]
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


if __name__ == '__main__':
    x, y = 10, 10
    img = np.array(Image.open("/opt/Meow/assesets/demo_photo.jpg"))
    img_overlay_rgba = np.array(Image.open("/opt/Meow/assesets/selected_cats/cat.1.jpg"))
    img = cv.cvtColor(img, cv.COLOR_RGB2RGBA).copy()
    img_overlay_rgba = cv.cvtColor(img_overlay_rgba, cv.COLOR_RGB2RGBA).copy()

    img_overlay_rgba = resizeCat(img, img_overlay_rgba, 0.8)

    # Perform blending
    alpha_mask = img_overlay_rgba[:, :, 3] / 255.0
    # print(img_overlay_rgba[:, :, 3].shape)
    img_result = img[:, :, :3].copy()
    img_overlay = img_overlay_rgba[:, :, :3]
    overlay_image_alpha(img_result, img_overlay, x, y, alpha_mask)

    kernel = np.ones((5, 5), np.float32) / 15
    dst = cv.filter2D(img_result, -1, kernel)

    # Save result
    Image.fromarray(img_result).save("img_result3.jpg")