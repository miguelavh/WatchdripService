import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { getAppWidgetSize } from "@zos/ui";
import { DEVICE_WIDTH } from "../utils/config/device";

import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_TRANSPARENT,
} from "../utils/config/constants";

const { w,h } = getAppWidgetSize()

export const Colors = {
  default:0x333333,
  defaultTransparent:0x059AF7,
  white:0xffffff,
  black:0x000000,
  bgHigh:0xfdef03,
  bgLow:0xfd030f,
  accent:0xffbeff37,
};

export const IMG_LOGO = {
  x: (DEVICE_WIDTH-w)/2+px(10),
  y: px(10),
  src: 'images/logomin.png',
};

export const IMG_LOADING_PROGRESS = {
  x: (DEVICE_WIDTH-w)/2+(w - px(50)),
  y: px(10),
  w: px(40),
  h: px(40),
  src: 'images/gearmin.png',
  angle:0,
  pos_x: px(0),
  pos_y: px(0),
  center_x: px(20),
  center_y: px(20),
  auto_scale: true,
};

export const BG_VALUE_TEXT = {
  x: (DEVICE_WIDTH-w)/2+(w - px(200)) / 2,
  y: px(10),
  w: px(200),
  h: px(65),
  color: Colors.white,
  text_size: px(65),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.NONE,
};

export const BG_TIME_TEXT = {
  x: (DEVICE_WIDTH-w)/2+(w - px(200)) / 2,
  y: px(10)+px(65)+px(10),
  w: px(200),
  h: px(35),
  color: Colors.white,
  text_size: px(35),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.NONE,
};

export const BG_TREND_IMAGE = {
  src: 'watchdrip/arrowsmin/None.png',
  x: (DEVICE_WIDTH-w)/2+(w - px(115)),
  y: px(10),
  w: px(45),
  h: px(45),
};

export const BG_STALE_RECT = {
  x: (DEVICE_WIDTH-w)/2+(w - px(180)) / 2,
  y: px(10)+px(30),
  w: px(180),
  h: px(5),
  color: Colors.white,
  visible: false,
};