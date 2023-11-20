const HEAT_COLORS = [
  '#009586', // teal
  '#F35A28', // orange
  '#B92585', // pink
  '#86220B', // red
]

export default function heat(number = 0) {
  return HEAT_COLORS[number];
}