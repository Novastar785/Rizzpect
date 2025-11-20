import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  // Actualizamos también aquí para que no haya fuentes mezcladas
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Regular' }]} />;
}