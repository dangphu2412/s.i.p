import React from 'react';
import {Form, Input, Button} from 'antd';

export interface DiscussionEditorProps { 
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onSubmit?: React.MouseEventHandler<HTMLElement>;
    submitting?: boolean;
    value?: string;
}

export const DiscussionEditor = ({ onChange, onSubmit, submitting, value }: DiscussionEditorProps) => (
    <>
        <Form.Item>
            <Input.TextArea onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Send
            </Button>
        </Form.Item>
    </>
);
