import React, { useState, useRef, useEffect } from 'react';
import { Input, Space } from 'antd';
import type { InputRef } from 'antd';

interface IdCardInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const IdCardInput: React.FC<IdCardInputProps> = ({ value = '', onChange }) => {
  const splitValueIntoParts = (val: string) => {
    const digits = val.replace(/-/g, '');
    return {
      part1: digits.slice(0, 1),
      part2: digits.slice(1, 5),
      part3: digits.slice(5, 10),
      part4: digits.slice(10, 12),
      part5: digits.slice(12, 13),
    };
  };

  const [parts, setParts] = useState(splitValueIntoParts(value));

  const inputRefs = [
    useRef<InputRef>(null),
    useRef<InputRef>(null),
    useRef<InputRef>(null),
    useRef<InputRef>(null),
    useRef<InputRef>(null),
  ];

  useEffect(() => {
    setParts(splitValueIntoParts(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value: inputValue } = e.target;
    const digitsOnly = inputValue.replace(/\D/g, '');
    const partName = `part${index + 1}` as keyof typeof parts;

    const newParts = { ...parts, [partName]: digitsOnly };
    setParts(newParts);

    const combinedValue = `${newParts.part1}${newParts.part2}${newParts.part3}${newParts.part4}${newParts.part5}`;
    if (onChange) {
      onChange(combinedValue);
    }

    const maxLengths = [1, 4, 5, 2, 1];
    if (digitsOnly.length === maxLengths[index] && index < inputRefs.length - 1) {
      inputRefs[index + 1].current!.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && e.currentTarget.value === '' && index > 0) {
      inputRefs[index - 1].current!.focus();
    }
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        ref={inputRefs[0]}
        value={parts.part1}
        onChange={(e) => handleChange(e, 0)}
        onKeyDown={(e) => handleKeyDown(e, 0)}
        maxLength={1}
        style={{ width: '10%', textAlign: 'center', borderRadius: '6px' }}
      />
      <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>-</span>
      <Input
        ref={inputRefs[1]}
        value={parts.part2}
        onChange={(e) => handleChange(e, 1)}
        onKeyDown={(e) => handleKeyDown(e, 1)}
        maxLength={4}
        style={{ width: '25%', textAlign: 'center', borderRadius: '6px' }}
      />
       <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>-</span>
      <Input
        ref={inputRefs[2]}
        value={parts.part3}
        onChange={(e) => handleChange(e, 2)}
        onKeyDown={(e) => handleKeyDown(e, 2)}
        maxLength={5}
        style={{ width: '30%', textAlign: 'center', borderRadius: '6px' }}
      />
       <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>-</span>
       <Input
        ref={inputRefs[3]}
        value={parts.part4}
        onChange={(e) => handleChange(e, 3)}
        onKeyDown={(e) => handleKeyDown(e, 3)}
        maxLength={2}
        style={{ width: '20%', textAlign: 'center', borderRadius: '6px' }}
      />
       <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>-</span>
       <Input
        ref={inputRefs[4]}
        value={parts.part5}
        onChange={(e) => handleChange(e, 4)}
        onKeyDown={(e) => handleKeyDown(e, 4)}
        maxLength={1}
        style={{ width: '15%', textAlign: 'center', borderRadius: '6px' }}
      />
    </Space.Compact>
  );
};

export default IdCardInput;