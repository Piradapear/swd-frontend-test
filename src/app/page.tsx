"use client";
import React, { FC } from 'react';
import { Card, Row, Col, Typography, Select } from 'antd';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import '../i18n/locales/config';
import styles from './page.module.css';

const { Title, Text } = Typography;

const HomePage: FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const tests = [
    { key: 'test1', href: '/testpage1' },
    { key: 'test2', href: '/testpage2' },
  ];

  return (
    <div className={styles.homeContainer}> 
      <div className={styles.languageSwitcher}>
        <Select
          defaultValue={i18n.language}
          style={{ width: 80 }}
          onChange={changeLanguage}
          options={[
            { value: 'en', label: 'EN' },
            { value: 'th', label: 'TH' },
          ]}
        />
      </div>
      <Row gutter={[32, 32]} justify="center">
        {tests.map((test) => (
          <Col key={test.key}>
            <Link href={test.href} passHref>
                <Card hoverable className={styles.testCard}>
                  <Title level={4}>{t(`${test.key}_title`)}</Title>
                  <Text type="secondary">{t(`${test.key}_subtitle`)}</Text>
                </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;