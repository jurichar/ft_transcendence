import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Repository } from 'typeorm';
import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class MatchesService {
  constructor (private matchRepo : Repository<Match>)
  {
    this.matchRepo = myDataSource.getRepository(Match);
  }

  create() : Promise<Match>
  {
    let match : Match = new Match();
    return this.matchRepo.save(match);
  }

  init(match: Match, player1 : Player, player2: Player) : string
  {
    match.players.push(player1);
    match.players.push(player2);
    match.active = true;
    this.matchRepo.save(match);

    return 'This action adds a new match';
  }

  findAllFinished() : Promise<Match[]>
  {
    return this.matchRepo.find({
      where: { active: true }
    });
  }

  findOne(id: string) : Promise<Match> 
  {
    return this.matchRepo.findOne({
      where: { id: id }
    });
  }

  finish(match: Match) : string
  {
    match.active = false;
    this.matchRepo.save(match);
    return 'this action set the match as finished';
  }
}
