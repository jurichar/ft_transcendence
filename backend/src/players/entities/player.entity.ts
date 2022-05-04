import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Match } from "src/matches/entities/match.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Player {

    @ManyToOne(() => User, (user : User) => user.id)
    userRef: User;

    @ManyToOne(() => Match, (match : Match) => match.id)
    matchRef: Match;

    @Column({
        type : "int8",
        nullable : false,
        default: 0 
    })
    score: number;

    @Column({
        type : "boolean",
        nullable : false,
        default: false 
    })
    winner: boolean;
}
