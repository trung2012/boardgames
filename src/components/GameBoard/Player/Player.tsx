import React from 'react';
import { Droppable } from 'react-dragtastic';
import { IServerPlayer } from '../../../api/types';
import { useAnimationContext, useErrorContext, useGameContext } from '../../../context';
import { delayBetweenActions } from '../../../game/constants';
import { ICard, IGamePlayer } from '../../../game/types';
import { calculateDistanceFromTarget } from '../../../utils';
import { PlayerCardsInPlay } from '../PlayerCardsInPlay';
import { PlayerEquipments } from '../PlayerEquipments';
import { PlayerHand } from '../PlayerHand';
import { PlayerInfo } from '../PlayerInfo';
import './Player.scss';

interface IPlayerProps {
  player: IGamePlayer & IServerPlayer;
  playerIndex: number;
}

export const Player: React.FC<IPlayerProps> = ({ player, playerIndex }) => {
  const { playerID, G, playersInfo, moves } = useGameContext();
  const { setError } = useErrorContext();
  const { players } = G;

  const onDrop = (data: { sourceCard: ICard; sourceCardIndex: number; sourcePlayerId: string }) => {
    if (!playersInfo?.length) throw Error('Something went wrong');
    const { sourceCard, sourceCardIndex, sourcePlayerId } = data;

    const sourcePlayer = players[sourcePlayerId];
    const distanceBetweenPlayers = calculateDistanceFromTarget(
      players,
      playersInfo,
      Number(sourcePlayerId),
      Number(player.id)
    );

    if (sourceCard.name !== 'jail') {
      moves.playCard(sourceCardIndex, player.id);
    }

    setTimeout(() => {
      switch (sourceCard.name) {
        case 'missed': {
          if (sourcePlayer.character.name !== 'calamity janet') {
            setError('Only Calamity Janet can play missed as bang');
            return;
          }
          if (sourcePlayer.gunRange < distanceBetweenPlayers) {
            setError('Target is out of range');
            return;
          }
          moves.bang(player.id);
          return;
        }
        case 'bang': {
          if (sourcePlayer.gunRange < distanceBetweenPlayers) {
            setError('Target is out of range');
            return;
          }
          moves.bang(player.id);
          return;
        }
        case 'duel': {
          moves.duel(player.id);
          return;
        }
        case 'jail': {
          if (player.role === 'sheriff') {
            setError('Cannot jail sheriff');
            return;
          }
          moves.jail(player.id, sourceCardIndex);
          return;
        }
        default:
          return;
      }
    }, delayBetweenActions);
  };

  return (
    <div className={`player player${playerIndex}`}>
      <Droppable accepts='card' onDrop={onDrop}>
        {dragState => (
          <div className='player-info-container' {...dragState.events}>
            <PlayerInfo player={player} />
          </div>
        )}
      </Droppable>
      <PlayerEquipments equipments={player.equipments} playerId={player.id} />
      <PlayerHand hand={player.hand} playerId={player.id} />
      <PlayerCardsInPlay cards={player.cardsInPlay} playerId={player.id} />
    </div>
  );
};