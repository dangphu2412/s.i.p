import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, message, Row, Upload } from 'antd';
import Title from 'antd/lib/typography/Title';
import Dragger from 'antd/lib/upload/Dragger';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { logoutAction } from 'src/modules/auth/auth.action';
import { getMe, Profile } from 'src/modules/auth/auth.service';
import { getUploadUrl } from 'src/modules/post/post.service';
import { UserActions } from 'src/modules/user/user.action';

export function Settings(): JSX.Element {
    const dispatch = useDispatch();
    const [profile, setProfile] = useState<Profile>({
        avatar: '',
        fullName: '',
        id: 'UNKNOWN',
        username: '',
        headline: '',
        hashTag: ''
    });

    useEffect(() => {
        getProfile()
            .then()
            .catch(() => { dispatch(logoutAction()); });
    }, []);

    async function getProfile() {
        const request = getMe();
        await request.doRequest();
        const data = request.getData();
        setProfile(data);
    }

    function updateProfile() {
        dispatch(UserActions.updateProfile(profile));
    }

    return <ClientLayout>
        <Container className='py-10'>
            <Title level={2}>
                My details
            </Title>
            <Row>
                <Col className='pr-10' span={16}>
                    <Form
                        layout="vertical"
                        requiredMark={false}
                    >
                        <Form.Item label="Name" required>
                            <Input
                                placeholder="Place your cool name here"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                            />
                        </Form.Item>

                        <Form.Item label="Headline" required>
                            <Input
                                placeholder="Place your headline here"
                                value={profile.headline}
                                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                            />
                        </Form.Item>

                        <Button danger onClick={updateProfile}>
                            Save Changes
                        </Button>
                    </Form>
                </Col>
                <Col span={8}>
                    <Row>
                        <Col span={6}>
                            <Image
                                src={profile.avatar}
                                alt="User avatar"
                                height={80}
                                width={80}
                                preview={false}
                            />
                        </Col>

                        <Col span={18}>
                            <div>
                                <Upload
                                    name='files'
                                    action={getUploadUrl()}
                                    onChange={(info) => {
                                        if (info.file.status !== 'uploading') {
                                            console.log(info.file, info.fileList);
                                        }
                                        if (info.file.status === 'done') {
                                            message.success(`${info.file.name} file uploaded successfully`);
                                            const avatar = info.file.response.data[0];
                                            setProfile({
                                                ...profile,
                                                avatar
                                            });
                                        } else if (info.file.status === 'error') {
                                            message.error(`${info.file.name} file upload failed.`);
                                        }
                                    }}
                                >
                                    <Button>
                                        <UploadOutlined/> Click to Upload
                                    </Button>
                                </Upload>
                            </div>

                            <div className='p-color'>
                                Recommended size: 400x400px
                            </div>
                        </Col>
                    </Row>

                    <Dragger>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                    </Dragger>

                    <div>
                        Upload new banner
                    </div>
                    <div>
                        Recommended size: 1500x500px
                    </div>
                </Col>
            </Row>
        </Container>
    </ClientLayout>;
}
