import { Avatar, Comment, Form, Input } from 'antd';
import React from 'react';

export interface DiscussionEditorProps { 
    onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    value: string;
    authorAvatar: React.ReactNode;
}

export const DiscussionEditor = ({ onKeyDown, onChange, value, authorAvatar }: DiscussionEditorProps) => (
    <Comment
        avatar={
            <>
                <Avatar style={{display: 'block'}} src={authorAvatar} alt="Han Solo" />
            </>
        }
        content={
            <div>
                <Form.Item>
                    <Input.TextArea 
                        value={value}
                        onKeyDown={onKeyDown}
                        onChange={onChange}
                    />
                </Form.Item>
            </div>
        }
    />
);
