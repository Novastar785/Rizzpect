import React, { useState, useEffect, useRef } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

interface TypewriterTextProps extends TextProps {
  text: string;
  speed?: number; // ms por caracter
  onComplete?: () => void;
  style?: TextStyle;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 15, // Velocidad rápida por defecto
  onComplete, 
  style, 
  ...props 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);
  // CAMBIO: Usamos 'any' para evitar el conflicto de tipos entre NodeJS.Timeout y number
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Reiniciar si el texto cambia
    setDisplayedText('');
    index.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]);

  return (
    <Text style={style} {...props}>
      {displayedText}
    </Text>
  );
};