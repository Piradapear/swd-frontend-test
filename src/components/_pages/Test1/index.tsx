"use client";
import React, { useState, useCallback, FC } from 'react';
import { Select, Button, Typography } from 'antd';
import { useTranslation } from "react-i18next";
import '../../../i18n/locales/config';
import styles from './style.module.scss';

const { Title } = Typography;

const SHAPES_IN_FIRST_ROW = 3;

const initialShapes = [
  'square', 'circle', 'oval',
  'trapezoid', 'rectangle', 'parallelogram'
];

// Utility function to shuffle an array randomly.
const shuffleArray = (array: string[]) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

const LayoutAndStylePage: FC = () => {
  const { t, i18n } = useTranslation();
  const [shapes, setShapes] = useState<string[]>(initialShapes);
  const [isFirstRowOffset, setIsFirstRowOffset] = useState<boolean>(false);

  // Rotates the shapes array to the left.
  const handleMoveLeft = useCallback(() => {
    setShapes(prevShapes => {
      const newShapes = [...prevShapes];
      const firstElement = newShapes.shift();
      if (firstElement) newShapes.push(firstElement);
      return newShapes;
    });
  }, []);
  
  // Rotates the shapes array to the right.
  const handleMoveRight = useCallback(() => {
    setShapes(prevShapes => {
      const newShapes = [...prevShapes];
      const lastElement = newShapes.pop();
      if (lastElement) newShapes.unshift(lastElement);
      return newShapes;
    });
  }, []);

  // Swaps the top and bottom rows of shapes.
  const swapShapeRows = useCallback(() => {
    setShapes(prevShapes => {
      const row1 = prevShapes.slice(0, SHAPES_IN_FIRST_ROW);
      const row2 = prevShapes.slice(SHAPES_IN_FIRST_ROW);
      return [...row2, ...row1];
    });
    setIsFirstRowOffset(prev => !prev);
  }, []);
  
  // Randomizes the order of all shapes.
  const randomizeShapes = useCallback(() => {
    setShapes(shuffleArray(initialShapes));
  }, []);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className={styles.body}>
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <Title level={2} style={{ color: 'black', margin: 0 }}>{t('page_1_title')}</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'end' }}>
            <Select
                defaultValue={i18n.language}
                style={{ width: 80 }}
                onChange={handleLanguageChange}
                options={[{ value: 'en', label: 'EN' }, { value: 'th', label: 'TH' }]}
            />
            <Button style={{ width: 60 }} href="/">{t('home')}</Button>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.controlPanel}>
            <div className={styles.controlButtonWrapper}>
              <button onClick={handleMoveLeft} className={`${styles.controlButton} ${styles.moveShapeLeft}`} />
              <span className={styles.controlButtonLabel}>{t('move_shape')}</span>
            </div>

            <div className={styles.controlButtonWrapper}>
              <button onClick={swapShapeRows} className={`${styles.controlButton} ${styles.movePosition}`}>
                  <div className={styles.triangleUpIcon}></div>
                  <div className={styles.triangleDownIcon}></div>
              </button>
              <span className={styles.controlButtonLabel}>{t('move_position')}</span>
            </div>

            <div className={styles.controlButtonWrapper}>
                <button onClick={handleMoveRight} className={`${styles.controlButton} ${styles.moveShapeRight}`} />
                <span className={styles.controlButtonLabel}>{t('move_shape')}</span>
            </div>
          </div>
                
          <div className={styles.controlSeparator}>
            <div className={styles.separator} />
          </div>

          <div className={styles.displayPanel}>
            <div className={`${styles.shapeRow} ${isFirstRowOffset ? styles.offsetRow : ''}`}>
              {shapes.slice(0, SHAPES_IN_FIRST_ROW).map((shape, index) => (
                <div key={`${shape}-${index}`} className={styles.shapeWrapper} onClick={randomizeShapes}>
                  <div className={`${styles.shape} ${styles[shape]}`} />
                </div>
              ))}
            </div>
            
            <div className={`${styles.shapeRow} ${!isFirstRowOffset ? styles.offsetRow : ''}`}>
              {shapes.slice(SHAPES_IN_FIRST_ROW).map((shape, index) => (
                <div key={`${shape}-${index}`} className={styles.shapeWrapper} onClick={randomizeShapes}>
                  <div className={`${styles.shape} ${styles[shape]}`} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutAndStylePage;
