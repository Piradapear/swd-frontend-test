"use client";
import React, { useState, useEffect, FC } from 'react';
import {
    ConfigProvider,
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Radio,
    Row,
    Col,
    Table,
    Space,
    Typography,
    Checkbox,
    Modal
} from 'antd';
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import thTH from 'antd/locale/th_TH';
import enUS from 'antd/locale/en_US';

import '../../../i18n/locales/config';
import styles from './style.module.scss';
import { RootState, AppDispatch } from '../../../store/store';
import { User, addUser, editUser, deleteUser, deleteMultipleUsers, setUsers } from '../../../store/userSlice';
import IdCardInput from '../../_core/InputCardID/IdCardInput';

const { Title } = Typography;
const { Option } = Select;

const FormAndTablePage: FC = () => {
    const { t, i18n } = useTranslation();
    const dispatch: AppDispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.list);

    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const antdLocale = i18n.language === 'th' ? thTH : enUS;

    // Loads users from local storage on initial render.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const storedUsers = localStorage.getItem('users');
                if (storedUsers && storedUsers !== 'undefined') {
                const parsedUsers = JSON.parse(storedUsers);
                if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
                    dispatch(setUsers(parsedUsers));
                }
                }
            } catch (error) {
                console.error("Failed to load users from local storage", error);
            }
        }
    }, []);

    // Saves users to local storage whenever the list changes.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (users.length > 0 || localStorage.getItem('users') !== '[]') {
                try {
                localStorage.setItem('users', JSON.stringify(users));
                } catch (error) {
                console.error("Failed to save users to local storage", error);
                }
            }
        }
    }, [users]);

    const onFinish = (values: any) => {
        const phoneNumber = `${values.phoneCode || ''}${values.phoneNum || ''}`;
        const { phoneCode, phoneNum, ...restValues } = values;
        
        const userData = {
        ...restValues,
        phoneNumber: phoneNumber,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : '',
        };
        
        if (editingUser) {
            dispatch(editUser({ ...editingUser, ...userData }));
            Modal.success({ content: t('user_updated_success'), okText: t('ok'), });
        } else {
            dispatch(addUser(userData));
            Modal.success({ content: t('user_added_success'), okText: t('ok') });
        }

        form.resetFields();
        setEditingUser(null);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        
        const codes = ['+66', '+1', '+33'];
        let phoneCode = '+66';
        let phoneNum = user.phoneNumber || '';

        for (const code of codes) {
            if (phoneNum.startsWith(code)) {
                phoneCode = code;
                phoneNum = phoneNum.substring(code.length);
                break;
            }
        }

        form.setFieldsValue({
        ...user,
        birthDate: user.birthDate ? dayjs(user.birthDate) : null,
        phoneCode: phoneCode,
        phoneNum: phoneNum,
        });
    };

    // Deletes a single user(In line table)
    const handleDelete = (userId: string) => {
        Modal.confirm({
        title: t('confirm_deletion'),
        content: t('delete_user_confirmation'),
        okText: t('ok'),
        cancelText: t('cancel'),
        onOk: () => {
            dispatch(deleteUser(userId));
        },
        });
    };

    // Deletes all selected users from the table.
    const handleDeleteSelected = () => {
        if (selectedRowKeys.length === 0) return;
        Modal.confirm({
        title: t('delete_items'),
        content: t('delete_warning'),
        okText: t('ok'),
        cancelText: t('cancel'),
        onOk: () => {
            dispatch(deleteMultipleUsers(selectedRowKeys as string[]));
            setSelectedRowKeys([]);
        },
        });
    };

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // Translates static data values for display.
    const translateValue = (type: 'prefix' | 'gender' | 'nationality', value: string) => {
        const translations: { [key: string]: { [lang: string]: string } } = {
        
        'Male': { en: 'Male', th: 'ชาย' },
        'Female': { en: 'Female', th: 'หญิง' },
        'Unspecified': { en: 'Unspecified', th: 'ไม่ระบุ' },
        
        'Thai': { en: 'Thai', th: 'ไทย' },
        'American': { en: 'American', th: 'อเมริกัน' },
        'French': { en: 'French', th: 'ฝรั่งเศส' }
        };
        return translations[value] ? translations[value][i18n.language as 'en' | 'th'] || value : value;
    };

    const columns: TableProps<User>['columns'] = [
    { 
        title: t('table_name'), 
        dataIndex: 'firstName', 
        key: 'name', 
        render: (_, record) => `${record.firstName} ${record.lastName}`,
        sorter: (a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return nameA.localeCompare(nameB);
        },
    },
    { 
        title: t('table_gender'), 
        dataIndex: 'gender', 
        key: 'gender',
        render: (_, record) => translateValue('gender', record.gender),
        sorter: (a, b) => translateValue('gender', a.gender).localeCompare(translateValue('gender', b.gender)),
    },
    { 
        title: t('table_phone'), 
        dataIndex: 'phoneNumber', 
        key: 'phoneNumber',
        sorter: (a, b) => (a.phoneNumber || '').localeCompare(b.phoneNumber || ''),
    },
    { 
        title: t('table_nationality'), 
        dataIndex: 'nationality', 
        key: 'nationality',
        render: (_, record) => translateValue('nationality', record.nationality),
        sorter: (a, b) => translateValue('nationality', a.nationality).localeCompare(translateValue('nationality', b.nationality)),
    },
    {
        title: t('table_manage'),
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a onClick={() => handleEdit(record)}>{t('edit')}</a>
                <a onClick={() => handleDelete(record.id)}>{t('delete')}</a>
            </Space>
        ),
    },];

    return (
        <ConfigProvider locale={antdLocale}>
            <div className={styles.body}>
                <header className={styles.header}>
                    <Title level={2} style={{ color: 'black', margin: 0 }}>{t('page_2_title')}</Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'end' }}>
                        <Select
                            defaultValue={i18n.language}
                            onChange={handleLanguageChange}
                            style={{ width: 80 }}
                        >
                            <Option value="en">EN</Option>
                            <Option value="th">ไทย</Option>
                        </Select>
                        <Button style={{ width: 60 }} href="/">{t('home')}</Button>
                    </div>
                </header>

                <div className={styles.formContainer}>
                    <Form form={form} layout="horizontal" onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item name="prefix" label={t('prefix')} rules={[{ required: true, message: t('prefix_required') }]}>
                                    <Select placeholder={t('prefix')}>
                                    <Option value="Mr.">{t('mr')}</Option>
                                    <Option value="Mrs.">{t('mrs')}</Option>
                                    <Option value="Ms.">{t('ms')}</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={9}>
                                <Form.Item name="firstName" label={t('firstname')} rules={[{ required: true, message: t('firstname_required') }]}>
                                    <Input/>
                                </Form.Item>
                            </Col>

                            <Col span={9}>
                                <Form.Item name="lastName" label={t('lastname')} rules={[{ required: true, message: t('lastname_required') }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={9}>
                            <Form.Item name="birthDate" label={t('birthdate')} rules={[{ required: true, message: t('birthdate_required') }]}>
                                <DatePicker placeholder={t('select_birthdate')} style={{ width: '100%' }} />
                            </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name="nationality" label={t('nationality')} rules={[{ required: true, message: t('nationality_required') }]}>
                                    <Select placeholder={t('select_nationality')}>
                                    <Option value="Thai">{t('thai')}</Option>
                                    <Option value="American">{t('american')}</Option>
                                    <Option value="French">{t('french')}</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="idCardNumber" label={t('id_card_number')}>
                                    <IdCardInput />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="gender" label={t('gender')} rules={[{ required: true, message: t('gender_required') }]}>
                                    <Radio.Group>
                                    <Radio value="Male">{t('male')}</Radio>
                                    <Radio value="Female">{t('female')}</Radio>
                                    <Radio value="Unspecified">{t('unspecified')}</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={10}>
                                <Form.Item name="phoneCode" label={t('phone_number')} rules={[{ required: true, message: t('phone_code_required') }]}>
                                    <Select>
                                    <Option value="+66">🇹🇭 +66</Option>
                                    <Option value="+1">🇺🇸 +1</Option>
                                    <Option value="+33">🇫🇷 +33</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={1} style={{ textAlign: 'center'}}>
                                
                            </Col>

                            <Col span={12}>
                                <Form.Item name="phoneNum" rules={[{ required: true, message: t('phone_number_required') }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="passportNumber" label={t('passport_number')}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="expectedSalary" label={t('expected_salary')} rules={[{ required: true, message: t('expected_salary_required') }]}>
                                    <Input type="number" />
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{ textAlign: 'center' }}>
                                <Form.Item>
                                    <Space size={40}>
                                        <Button htmlType="button" onClick={() => { form.resetFields(); setEditingUser(null); }}>{t('reset')}</Button>
                                        <Button htmlType="submit">{editingUser ? t('update') : t('submit')}</Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.tableActions}>
                    <Checkbox
                        indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < users.length}
                        checked={users.length > 0 && selectedRowKeys.length === users.length}
                        onChange={(e) => {
                        const allRowKeys = e.target.checked ? users.map((user:any) => user.id) : [];
                        setSelectedRowKeys(allRowKeys);
                        }}
                    >
                        {t('select_all')}
                    </Checkbox>
                    <Button onClick={handleDeleteSelected} disabled={selectedRowKeys.length === 0}>{t('delete')}</Button>
                    </div>

                    <Table 
                    rowKey="id" 
                    rowSelection={rowSelection} 
                    columns={columns} 
                    dataSource={users} 
                    pagination={{ 
                        pageSize: 10,
                        position: ['topRight'],
                        className: 'custom-pagination',
                        showSizeChanger: false,
                        itemRender: (current, type, originalElement) => {
                        if (type === 'prev') {
                            return <Button style={{ border: 'none', background: 'transparent' }}>{t('btn_prev')}</Button>;
                        }
                        if (type === 'next') {
                            return <Button style={{ border: 'none', background: 'transparent' }}>{t('btn_next')}</Button>;
                        }
                        if (type === 'page') {
                            return (
                            <span style={{
                                display: 'inline-block',
                                width: '32px',
                                height: '30px',
                                lineHeight: '30px',
                                textAlign: 'center',
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#1890ff',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}>
                                {current}
                            </span>
                            );
                        }
                        return originalElement;
                        }
                    }} 
                    />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default FormAndTablePage;