// import useComponentSize from '@rehooks/component-size'

export default function createCircle(child, bounds, radius = 40) {
  const diameter = radius * 2

  // use the provided data attr, else use the center of the bounds
  const x = bounds.width * 0.5 + child.props['data-x'] || bounds.width * 0.5 + Math.random()
  const y = bounds.height * 0.5 + child.props['data-y'] || bounds.height * 0.5 + Math.random()

  return {
    id: child.key,
    diameter,
    radius,
    position: {
      x,
      y,
    },
  }
}
