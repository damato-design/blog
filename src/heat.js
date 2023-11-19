const HEAT_COLORS = [
  '#1AA8A7', // teal
  '#B84D98', // purple
  '#EA8729', // orange
  '#86220B', // red
]

export default function heat(number = 0) {
  return HEAT_COLORS[number];
}