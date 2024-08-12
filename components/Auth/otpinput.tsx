import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface OTPInputProps extends Omit<TextInputProps, 'onChangeText'> {
  value: string;
  index: number;
  onChangeText: (text: string, index: number) => void;
}

const OTPInput = React.forwardRef<TextInput, OTPInputProps>(({ value, onChangeText, index, ...props }, ref) => {
  const handleChangeText = (text: string) => {
    onChangeText(text, index);
  };

  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={handleChangeText}
      maxLength={1}
      keyboardType="numeric"
      textAlign="center"
      ref={ref}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 5,
    fontSize: 20,
    textAlign: 'center',
    borderStyle: 'dashed',
  },
});

export default OTPInput;
