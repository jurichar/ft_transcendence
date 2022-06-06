import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { myDataSource } from 'src/app-data-source';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor (private userRepo: Repository<User>)
  {
    this.userRepo = myDataSource.getRepository(User);
  }

  create(createUserDto: CreateUserDto) {
    return myDataSource.getRepository(User).save(createUserDto);
  }

  findAll() {
    return this.userRepo.find();
  }

 /* findName(login:string)
  {
    const userRepository = myDataSource.getRepository(User);
    return userRepository.findOne({ where: { login} })
  }*/
  findOne(id:string) {
    console.log(`id : ${id}`);
    return this.userRepo.findOne({ where: {id
     } });
  }

  async update(id:string, updateUserDto: UpdateUserDto) {
    const usrToUpdate= await this.userRepo.findOneBy({id});
    const {login} = updateUserDto;
    usrToUpdate.login = login;
    myDataSource.getRepository(User).save(usrToUpdate);
  }

  async remove(id: string) {
    const usrToUpdate= await  this.userRepo.findOneBy({id});
    return usrToUpdate.remove();
  }

  async insertUser() : Promise<string>
  {
    const user : User = new User;
    user.login = 'jojo';
    user.username = 'jojo';
    user.status = UserStatus.INGAME;
    user.authToken="1234";
    user.winCount=0;
    user.lossCount=0;
    await this.userRepo.save(user);
    return "my user is created";
  }

  async switchStatus(id: string, status: UserStatus)
  {
    const usrToUpdate= await this.userRepo.findOneBy({id});
    usrToUpdate.status = status;
    return this.userRepo.save(usrToUpdate);
  }

  async faker() : Promise<User>
  {
    const user = await myDataSource.getRepository(User).findOne({
      where : {
        login: 'faker'
      }
    })
    return user;
  } 

  async setTwoFactorSecret(userId: string, secret: string)
  {
    this.userRepo.update(userId, {twoFactorSecret: secret});
  }
}
