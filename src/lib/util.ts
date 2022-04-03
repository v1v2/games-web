export const flattenXYZ = ({
  x,
  y,
  z,
}: {
  x?: number
  y?: number
  z?: number
}): [number, number, number] => [x, y, z]

export const calcDistance = (p1, p2) => {
  var a = p2.x - p1.x
  var b = p2.y - p1.y
  var c = p2.z - p1.z

  return Math.sqrt(a * a + b * b + c * c)
}
