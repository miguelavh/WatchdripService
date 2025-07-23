import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";

import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_TRANSPARENT,
} from "../utils/config/constants";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../utils/config/device";

export const Colors = {
  default:0x333333,
  defaultTransparent:0x059AF7,
  white:0xffffff,
  black:0x000000,
  bgHigh:0xffa0a0,
  bgLow:0x8bbbff,
  accent:0xffbeff37,
};

export const FETCH_BUTTON = {
  x: (DEVICE_WIDTH - px(320)) / 2,
  y: (DEVICE_HEIGHT - px(80) - px(60)-px(30)),
  w: px(320),
  h: px(80),
  text_size: px(40),
  radius: px(12),
  normal_color: DEFAULT_COLOR,
  press_color: DEFAULT_COLOR_TRANSPARENT,
  text: "Start Service",
};

export const FETCH_RESULT_TEXT = {
  x: px(50),
  y: DEVICE_HEIGHT - px(50)-px(30),
  w: DEVICE_WIDTH - px(100),
  h: px(40),
  color: 0xffffff,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP,
};

export const IMG_LOGO = {
  x: (DEVICE_WIDTH)/2-px(70),
  y: px(20),
  src: 'images/logo.png',
};

export const IMG_LOADING_PROGRESS = {
  x: (DEVICE_WIDTH)/2+px(10),
  y: px(20),
  src: 'images/gear.png',
  angle:0,
  center_x: 30,
  center_y: 30,
};

export const BG_VALUE_TEXT = {
  x: (DEVICE_WIDTH - px(250)) / 2,
  y: DEVICE_HEIGHT - px(20) - px(95)-px(80)-px(60)-px(60)-px(30),
  w: px(250),
  h: px(95),
  color: Colors.white,
  text_size: px(95),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.NONE,
};

export const BG_TIME_TEXT = {
  x: (DEVICE_WIDTH - px(250)) / 2,
  y: DEVICE_HEIGHT  - px(10) - px(80)-px(60)-px(60)-px(30),
  w: px(250),
  h: px(40),
  color: Colors.white,
  text_size: px(40),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.NONE,
};

export const BG_TREND_IMAGE = {
  src: 'watchdrip/arrows/None.png',
  x: DEVICE_WIDTH - px(100),
  y: DEVICE_HEIGHT  - px(20) - px(85)-px(80)-px(60)-px(60)-px(30),
  w: px(45),
  h: px(45),
};

export const BG_STALE_RECT = {
  x: (DEVICE_WIDTH - px(180)) / 2,
  y: DEVICE_HEIGHT  - px(20) - px(85)-px(80)-px(60)-px(60)+px(40)-px(30),
  w: px(180),
  h: px(5),
  color: Colors.white,
  visible: false,
};