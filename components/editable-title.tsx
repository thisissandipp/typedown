import { Input } from '@/components/ui/input';
import React from 'react';

interface EditableTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => Promise<void>;
}

export function EditableTitle({ title, onTitleChange }: EditableTitleProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setInputValue(title);
  }, [title]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (inputValue.trim() && inputValue !== title) {
      onTitleChange(inputValue);
    } else {
      setInputValue(title);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(title);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return isEditing ? (
    <Input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyDown={handleInputKeyDown}
      className="mt-4 text-3xl font-semibold tracking-tight text-balance"
    />
  ) : (
    <h1
      onClick={handleTitleClick}
      className="mt-4 text-3xl font-semibold tracking-tight text-balance"
    >
      {title}
    </h1>
  );
}
