import React from 'react';
import {Form, Input, Button, Comment, Avatar} from 'antd';

export interface DiscussionEditorProps { 
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    value: string;
    authorAvatar: string;
}

export const DiscussionEditor = ({ onChange, value, authorAvatar }: DiscussionEditorProps) => (
    <Comment
        avatar={
            <>
                <Avatar style={{display: 'block'}} src={authorAvatar} alt="Han Solo" />
            </>
        }
        content={
            <div>
                <Form.Item>
                    <Input.TextArea onChange={onChange} value={value} />
                </Form.Item>
            </div>
        }
    />
);
