import React from 'react';
import styled from '@emotion/styled';
import { Card } from '../Card';

import { ICard } from '../../../game/types';
import './CardPile.scss';

const CardContainer = styled(Card)<{ index: number; cardRotationValue: number }>`
  position: absolute;
  transform: ${props => `rotate(${props.cardRotationValue}deg)`};
  transform-origin: center;
`;

interface ICardPileProps {
  cards: ICard[];
  isFacedUp: boolean;
  className?: string;
}

export const CardPile: React.FC<ICardPileProps> = React.memo(({ cards, isFacedUp, className }) => {
  return (
    <div className={`${className ?? ''} card-pile`}>
      {cards.map((card, index) => {
        return (
          <CardContainer
            key={card.id}
            index={index}
            card={card}
            isFacedUp={isFacedUp}
            cardRotationValue={card.rotationValue ?? 0}
          />
        );
      })}
    </div>
  );
});