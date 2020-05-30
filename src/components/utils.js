/**
 * @public
 * external js
 */
const init = {
  /**
   * @description is the exact time the browser renders anything
   * as visually different from what was on the screen before navigation
   */
  firstPaint: true,
  /**
   * @description is the exact time the browser renders the first bit of
   * content from the DOM
   */
  firstContentfulPaint: true,
  /**
   * @description measures the time from when a user first interacts with your site
   * to the time when the browser is actually able to respond to that interaction..
   */
  firstInputDelay: true,
  /**
   * @description Loggin based on ENV
   */
  logging: isEnvOneOf(["dev", "aws_dev"]),
};
