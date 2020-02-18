export default function (controller) {
  return {
    centerX: controller.width / 2,
    centerY: controller.height / 2,
    sqBound: Math.min(controller.width, controller.height),
    centerPos() {
      return new Vec2(controller.width / 2, controller.height / 2);
    },
    randomRadius(max) {
      var r = Math.random() * Math.PI * 2;
      var d = Math.random() * max;
      return new Vec2(Math.cos(r) * d, Math.sin(r) * d);
    },
    randomX() {
      return Math.random() * controller.width;
    },
    randomY() {
      return Math.random() * controller.height;
    }
  };
};